import { useState, useEffect } from 'react';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import html2pdf from 'html2pdf.js';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${import.meta.env.VITE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: import.meta.env.VITE_R2_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_R2_SECRET_ACCESS_KEY || '',
  },
  requestChecksumCalculation: 'WHEN_REQUIRED',
  forcePathStyle: true,
});
interface AdminData {
  first_name: string;
  last_name: string;
  designation: string;
  signature?: string | null;
}

interface LetterheadScreenProps {
  adminData?: AdminData | null;
}

export default function LetterheadScreen({ adminData }: LetterheadScreenProps) {

  const [date, setDate] = useState(new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }));
  const [honorific, setHonorific] = useState('Mr.');
  const [recipientName, setRecipientName] = useState('ALEXANDER REED');
  const [recipientTitle, setRecipientTitle] = useState('Creative Director');
  const [recipientCompany, setRecipientCompany] = useState('LUXE STUDIOS');
  const [salutation, setSalutation] = useState('Dear Mr. Alexander Reed,');
  const [signerName, setSignerName] = useState(adminData ? `${adminData.first_name} ${adminData.last_name}` : 'ISABELLA VANCE');
  const [signerTitle, setSignerTitle] = useState(adminData?.designation || 'Founder, Viora Media');
  const [isPrintMode, setIsPrintMode] = useState(true);
  const [paragraphs, setParagraphs] = useState<string[]>([
    'We are pleased to extend this formal proposal for a strategic partnership between Luxe Studios and Viora Media. Following our recent discussion regarding the co-production of the upcoming cinematic showcases, we believe combining our resources will deliver unmatched experiences for our global audiences.',
    'Under this partnership, Viora Media will provide top-tier editing suites, distribution support, and custom marketing materials, while Luxe Studios will lead raw production and talent recruitment. Detailed terms and revenue projections are outlined in the attached brief.',
    'Please review these guidelines and sign the agreement to initiate the next phase of our collaboration. We look forward to creating exceptional cinema together.'
  ]);

  // Update signer details when adminData changes
  useEffect(() => {
    if (adminData) {
      setSignerName(`${adminData.first_name} ${adminData.last_name}`);
      setSignerTitle(adminData.designation);
    }
  }, [adminData]);

  // Auto-populate salutation when recipient name or honorific changes
  useEffect(() => {
    // Convert to title case (first letters uppercase)
    const titleCaseName = recipientName
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    setSalutation(`Dear ${honorific} ${titleCaseName},`);
  }, [recipientName, honorific]);

  const handleParagraphChange = (index: number, val: string) => {
    setParagraphs(prev => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const addParagraph = () => {
    setParagraphs(prev => [...prev, '']);
  };

  const removeParagraph = (index: number) => {
    if (paragraphs.length <= 1) return;
    setParagraphs(prev => prev.filter((_, i) => i !== index));
  };

  const [isSaving, setIsSaving] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleSaveToBucket = async () => {
    setIsSaving(true);
    try {
      const element = document.getElementById('letterhead-preview-container');
      if (!element) throw new Error('Preview container not found');
      
      const originalIsPrintMode = isPrintMode;
      if (!isPrintMode) {
        setIsPrintMode(true);
        await new Promise(resolve => setTimeout(resolve, 150));
      }

      const opt = {
        margin:       0,
        filename:     `letterhead_${Date.now()}.pdf`,
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'in' as const, format: 'a4' as const, orientation: 'portrait' as const }
      };

      const pdfBlob = await html2pdf().set(opt).from(element).outputPdf('blob');
      
      const key = `docs/letterhead_${Date.now()}.pdf`;
      const uploadCommand = new PutObjectCommand({
        Bucket: 'viorasf',
        Key: key,
        Body: pdfBlob,
        ContentType: 'application/pdf',
      });
      
      await r2Client.send(uploadCommand);
      
      alert('Letterhead securely saved to the document bucket!');
      
      if (!originalIsPrintMode) {
        setIsPrintMode(false);
      }
    } catch (err) {
      console.error('Error saving letterhead:', err);
      alert('Failed to save letterhead to bucket. Please check console.');
    } finally {
      setIsSaving(false);
    }
  };

  // Heuristic-based paragraph paginator for rendering separate A4 screen blocks
  const paginateParagraphs = () => {
    // Pre-process paragraphs: split by newlines to handle multi-line inputs in a single textarea
    const flatParagraphs: string[] = [];
    paragraphs.forEach(p => {
      if (!p.trim()) return;
      const parts = p.split(/\n+/).map(part => part.trim()).filter(Boolean);
      flatParagraphs.push(...parts);
    });

    if (flatParagraphs.length === 0) {
      flatParagraphs.push('');
    }

    const pageList: string[][] = [[]];
    let currentPageIdx = 0;
    let currentHeight = 0;

    const estParaHeight = (p: string) => {
      // ~85 characters per line for 12px font size, 20px line height, 16px bottom margin
      const lines = Math.ceil(Math.max(p.length, 1) / 85);
      return (lines * 20) + 16;
    };

    for (let i = 0; i < flatParagraphs.length; i++) {
      const p = flatParagraphs[i];
      const estHeight = estParaHeight(p);

      // Look ahead: total height of all remaining paragraphs starting from the current index i
      let remainingHeight = 0;
      for (let j = i; j < flatParagraphs.length; j++) {
        remainingHeight += estParaHeight(flatParagraphs[j]);
      }

      // Check if this page is the final one (remaining content + signature details fits here)
      // Limit with signature details: Page 1 = 420px, Page 2+ = 580px
      const finalPageLimit = currentPageIdx === 0 ? 420 : 580;
      const isLastParagraph = i === flatParagraphs.length - 1;

      let isFinalPage = false;
      if (isLastParagraph) {
        // If this is the last paragraph, the current page must be the final page.
        isFinalPage = true;
      } else {
        // Can all remaining paragraphs (from current to end) fit on this page?
        isFinalPage = (currentHeight + remainingHeight) <= finalPageLimit;
      }

      // Max height allocations:
      // If final page: Page 1 = 420px, Page 2+ = 580px (accounts for signature details space)
      // If NOT final page: Page 1 = 650px, Page 2+ = 780px (no signature block space needed)
      const maxHeight = isFinalPage
        ? finalPageLimit
        : (currentPageIdx === 0 ? 650 : 780);

      if (currentHeight + estHeight > maxHeight && pageList[currentPageIdx].length > 0) {
        // Create a new page
        currentPageIdx++;
        pageList.push([p]);
        currentHeight = estHeight;
      } else {
        pageList[currentPageIdx].push(p);
        currentHeight += estHeight;
      }
    }

    return pageList;
  };

  const paperBgColor = isPrintMode ? '#F9F8F5' : '#080808';
  const paperTextColor = isPrintMode ? '#000000' : '#ffffff';

  return (
    <div className="w-full bg-[#030303] min-h-screen text-white flex flex-col md:flex-row min-w-0 font-sans print:bg-white print:text-black print:block print:h-auto">
      <style>{`
        @media print {
          /* Force overflow visible and heights on all layout wrappers to enable pagination */
          html, body, #root, .min-h-screen, main, .flex-1 {
            height: auto !important;
            min-height: 0 !important;
            overflow: visible !important;
            overflow-y: visible !important;
            display: block !important;
            background-color: ${paperBgColor} !important;
            color: ${paperTextColor} !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            size: A4;
            margin: 0 !important; /* Hides default browser print headers and footers */
          }
          .print-sheet {
            display: none !important;
          }
          .print-page {
            width: 210mm !important;
            height: 297mm !important;
            min-height: 297mm !important;
            max-height: 297mm !important;
            margin: 0 !important;
            padding: 40mm 20mm 30mm 20mm !important;
            box-sizing: border-box !important;
            position: relative !important;
            page-break-after: always;
            background-color: ${paperBgColor} !important;
            color: ${paperTextColor} !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-page:last-child {
            page-break-after: avoid !important;
          }
        }
      `}</style>

      {/* LEFT COLUMN: EDITOR PANEL (hidden in print) */}
      <div className="w-full md:w-1/3 min-w-[320px] max-w-[450px] border-r border-white/5 bg-primary-light p-6 overflow-y-auto h-auto md:h-screen sticky top-0 print:hidden flex flex-col gap-6 select-none">
        <div className="flex items-center gap-3 w-full border-b border-white/5 pb-6">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 px-2 bg-secondary text-black font-semibold text-[10px] sm:text-xs tracking-widest uppercase transition-all duration-300 hover:bg-white flex items-center justify-center gap-2 rounded-sm cursor-pointer shadow-[0_4px_20px_rgba(197,160,89,0.15)]"
          >
            <i className="fa-solid fa-print text-sm"></i> Print
          </button>
          <button
            onClick={handleSaveToBucket}
            disabled={isSaving}
            className="flex-1 py-3 px-2 bg-[#0A0A0A] border border-white/10 hover:border-secondary text-white font-semibold text-[10px] sm:text-xs tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 rounded-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></div> : <i className="fa-solid fa-floppy-disk text-sm"></i>}
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
        <div className="space-y-4">
          {/* Style Mode Selector */}
          <div>
            <label className="text-[10px] tracking-wider text-accent-muted uppercase font-bold block mb-2">Paper Color Style</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setIsPrintMode(true)}
                className={`py-2 px-3 text-xs uppercase font-semibold border transition-all rounded-sm cursor-pointer ${isPrintMode
                  ? 'border-secondary text-secondary bg-secondary/5'
                  : 'border-white/10 text-accent-muted hover:text-white'
                  }`}
              >
                Light (Print-Ready)
              </button>
              <button
                onClick={() => setIsPrintMode(false)}
                className={`py-2 px-3 text-xs uppercase font-semibold border transition-all rounded-sm cursor-pointer ${!isPrintMode
                  ? 'border-secondary text-secondary bg-secondary/5'
                  : 'border-white/10 text-accent-muted hover:text-white'
                  }`}
              >
                Dark (Digital View)
              </button>
            </div>
          </div>

          <hr className="border-white/5" />

          {/* Letter Meta Details */}
          <div className="space-y-3.5">
            <span className="text-[10px] tracking-widest text-secondary font-semibold uppercase block">Letter Details</span>

            <div>
              <label className="text-[9px] tracking-wider text-accent-muted uppercase block mb-1">Date String</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-black/40 border border-white/10 hover:border-white/20 focus:border-secondary transition-all rounded-sm px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            {/* Honorifics Selector */}
            <div>
              <label className="text-[9px] tracking-wider text-accent-muted uppercase block mb-1">Honorifics</label>
              <select
                value={honorific}
                onChange={(e) => setHonorific(e.target.value)}
                className="w-full bg-black/40 border border-white/10 hover:border-white/20 focus:border-secondary transition-all rounded-sm px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="Mr." className="bg-primary">Mr.</option>
                <option value="Ms." className="bg-primary">Ms.</option>
                <option value="Mrs." className="bg-primary">Mrs.</option>
                <option value="Dr." className="bg-primary">Dr.</option>
                <option value="Prof." className="bg-primary">Prof.</option>
              </select>
            </div>

            <div>
              <label className="text-[9px] tracking-wider text-accent-muted uppercase block mb-1">Recipient Name</label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 hover:border-white/20 focus:border-secondary transition-all rounded-sm px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] tracking-wider text-accent-muted uppercase block mb-1">Title</label>
                <input
                  type="text"
                  value={recipientTitle}
                  onChange={(e) => setRecipientTitle(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 hover:border-white/20 focus:border-secondary transition-all rounded-sm px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[9px] tracking-wider text-accent-muted uppercase block mb-1">Company</label>
                <input
                  type="text"
                  value={recipientCompany}
                  onChange={(e) => setRecipientCompany(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 hover:border-white/20 focus:border-secondary transition-all rounded-sm px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          <hr className="border-white/5" />

          {/* Letter Body Editor */}
          <div className="space-y-3.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] tracking-widest text-secondary font-semibold uppercase">Letter Content</span>
              <button
                onClick={addParagraph}
                className="text-[9px] tracking-widest text-secondary uppercase hover:text-white transition-colors cursor-pointer"
              >
                + Add Paragraph
              </button>
            </div>

            <div className="space-y-3">
              {paragraphs.map((p, idx) => (
                <div key={idx} className="relative group">
                  <textarea
                    value={p}
                    onChange={(e) => handleParagraphChange(idx, e.target.value)}
                    className="w-full bg-black/40 border border-white/10 hover:border-white/20 focus:border-secondary transition-all rounded-sm px-3 py-2 text-xs text-white focus:outline-none min-h-[70px] resize-y pr-6"
                    placeholder={`Paragraph ${idx + 1}...`}
                  />
                  {paragraphs.length > 1 && (
                    <button
                      onClick={() => removeParagraph(idx)}
                      className="absolute top-2 right-2 text-accent-muted hover:text-red-400 p-0.5 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                      title="Remove paragraph"
                    >
                      <i className="fa-solid fa-trash-can text-[10px]"></i>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>


      </div>

      {/* RIGHT COLUMN: PREVIEW PANEL */}
      <div className="flex-1 bg-black/50 p-6 md:p-12 overflow-y-auto h-screen print:h-auto print:p-0 flex flex-col items-center gap-8 min-w-0 print:block print:static">

        {/* Mapped A4 Pages (Rendered identically for both screen and print) */}
        <div id="letterhead-preview-container" className="flex flex-col gap-8 print:gap-0 w-full items-center">
        {paginateParagraphs().map((pageParas, pageIdx, allPages) => {
          const isFirstPage = pageIdx === 0;
          const isLastPage = pageIdx === allPages.length - 1;

          return (
            <div
              key={pageIdx}
              className={`print-page relative font-serif overflow-hidden transition-all duration-300 shadow-[0_12px_40px_rgba(0,0,0,0.4)] print:shadow-none ${isPrintMode
                ? 'bg-[#F9F8F5] text-black border border-black/5'
                : 'bg-[#080808] text-white border border-white/5 print:bg-[#F9F8F5] print:text-black print:border-none'
                }`}
              style={{
                width: '210mm',
                minWidth: '210mm',
                maxWidth: '210mm',
                height: '297mm',
                minHeight: '297mm',
                maxHeight: '297mm',
                paddingTop: '40mm',
                paddingBottom: '30mm',
                paddingLeft: '20mm',
                paddingRight: '20mm',
                boxSizing: 'border-box',
                pageBreakAfter: isLastPage ? 'avoid' : 'always',
              }}
            >
              {/* Centered Watermark Logo */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
                <img
                  src="/file_no_bg.svg"
                  alt="Watermark"
                  className={`w-3/5 h-auto object-contain transition-opacity duration-300 ${isPrintMode ? 'opacity-[0.12]' : 'opacity-[0.06] print:opacity-[0.12]'
                    }`}
                />
              </div>

              {/* Top Logo Header (Fixed position inside top margin) */}
              <div className="absolute top-[15mm] left-[20mm] right-[20mm] flex flex-col gap-4 z-10">
                <div className="flex justify-between items-center w-full">
                  {/* Left Side: Logo and Title */}
                  <div className="flex items-center gap-3">
                    <img
                      src="/logo.jpg"
                      alt="Viora Media Logo"
                      className="h-10 w-10 object-contain rounded-md border border-secondary/20 flex-shrink-0"
                    />
                    <div className="flex flex-col text-left">
                      <span className={`font-serif tracking-[0.25em] text-lg font-bold uppercase ${isPrintMode ? 'text-black' : 'text-white print:text-black'
                        }`}>
                        VIORA
                      </span>
                      <span className="text-[8px] tracking-[0.4em] text-secondary font-semibold uppercase mt-0.5 block">
                        MEDIA
                      </span>
                    </div>
                  </div>

                  {/* Right Side: Header Contacts */}
                  <div className="flex flex-col text-right font-sans">
                    <span className={`text-[9px] tracking-widest font-semibold uppercase ${isPrintMode ? 'text-black/70' : 'text-white/70 print:text-black/70'
                      }`}>
                      www.vioramedia.in
                    </span>
                    <span className={`text-[8px] tracking-wider font-light mt-0.5 lowercase ${isPrintMode ? 'text-black/50' : 'text-white/50 print:text-black/50'
                      }`}>
                      contact@vioramedia.in
                    </span>
                  </div>
                </div>

                {/* Divider Line with Clapboard in Center */}
                <div className="relative flex items-center justify-center py-1 w-full">
                  <div className={`flex-grow h-[0.5px] ${isPrintMode ? 'bg-black/10' : 'bg-white/10 print:bg-black/10'}`} />
                  <i className="fa-solid fa-clapperboard text-secondary text-[11px] mx-4"></i>
                  <div className={`flex-grow h-[0.5px] ${isPrintMode ? 'bg-black/10' : 'bg-white/10 print:bg-black/10'}`} />
                </div>
              </div>

              {/* Letter Body Container */}
              <div className="relative z-10 text-left font-sans text-xs font-light leading-relaxed">
                <div className="space-y-6">
                  {/* Date, Recipient, Salutation only on first page */}
                  {isFirstPage && (
                    <div className="space-y-6">
                      {/* Date String */}
                      <p className={`font-semibold tracking-wide text-xs ${isPrintMode ? 'text-black/80' : 'text-white/80 print:text-black/80'
                        }`}>
                        {date}
                      </p>

                      {/* Recipient Details - Always uppercase with honorific */}
                      <div className="space-y-1">
                        <p className={`font-bold tracking-wide text-xs ${isPrintMode ? 'text-black/90' : 'text-white/90 print:text-black/90'
                          }`}>
                          {`${honorific} ${recipientName.toUpperCase()}`}
                        </p>
                        <p className={`text-xs ${isPrintMode ? 'text-black/60' : 'text-white/60 print:text-black/60'
                          }`}>
                          {recipientTitle.toUpperCase()}
                        </p>
                        <p className={`text-xs ${isPrintMode ? 'text-black/60' : 'text-white/60 print:text-black/60'
                          }`}>
                          {recipientCompany.toUpperCase()}
                        </p>
                      </div>

                      {/* Salutation */}
                      <p className={`mt-8 ${isPrintMode ? 'text-black/80' : 'text-white/80 print:text-black/80'
                        }`}>
                        {salutation}
                      </p>
                    </div>
                  )}

                  {/* Paragraphs allocated to this page */}
                  <div className="space-y-4">
                    {pageParas.map((p, idx) => (
                      <p
                        key={idx}
                        className={`leading-relaxed text-justify indent-8 tracking-wide ${isPrintMode ? 'text-black/70' : 'text-white/70 print:text-black/70'
                          }`}
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sign-off & Signature Block only on the last page (Anchored to bottom of the A4 sheet) */}
              {isLastPage && (
                <div className="absolute bottom-[35mm] left-[20mm] right-[20mm] no-break select-none font-sans">
                  <p className={isPrintMode ? 'text-black/70' : 'text-white/70 print:text-black/70'}>Sincerely,</p>

                  {/* Signature Image - Dynamic from admin data or default */}
                  {adminData?.signature && (
                    <div className={`absolute h-28 pointer-events-none z-0 ${adminData.signature === '1.png' ? 'top-[3px]' : 'top-[-7px]'
                      }`}>
                      <img
                        src={`/signatures/${adminData.signature}`}
                        alt="Signature"
                        className={`h-28 w-auto object-contain select-none transition-all duration-300 transform -translate-x-6 translate-y-3 ${isPrintMode ? 'invert-0' : 'invert brightness-[2] print:invert-0'
                          }`}
                        onError={(e) => {
                          // Fallback to default signature if custom one fails to load
                          e.currentTarget.src = '/SignatureV.png';
                        }}
                      />
                    </div>
                  )}
                  {!adminData?.signature && (
                    <div className="absolute top-[3px] left-0 h-28 pointer-events-none z-0">
                      <img
                        src="/SignatureV.png"
                        alt="Signature"
                        className={`h-28 w-auto object-contain select-none transition-all duration-300 transform -translate-x-6 translate-y-3 ${isPrintMode ? 'invert-0' : 'invert brightness-[2] print:invert-0'
                          }`}
                      />
                    </div>
                  )}

                  <div className="space-y-1 relative z-10 pt-20">
                    <p className={`font-bold tracking-wide text-xs ${isPrintMode ? 'text-black/90' : 'text-white/90 print:text-black/90'
                      }`}>
                      {signerName}
                    </p>
                    <p className={`text-[11px] ${isPrintMode ? 'text-black/50' : 'text-white/50 print:text-black/50'
                      }`}>
                      {signerTitle}
                    </p>
                  </div>
                </div>
              )}

              {/* Letter Footer Details (Fixed position inside bottom margin) */}
              <div className="absolute bottom-[15mm] left-[20mm] right-[20mm] border-t border-secondary/20 pt-5 text-center font-sans z-10">
                <p className="text-[10px] font-bold text-secondary tracking-widest uppercase">
                  Viora Media
                </p>
                <p className={`text-[8px] tracking-[0.2em] font-light mt-1.5 uppercase ${isPrintMode ? 'text-black/45' : 'text-white/45 print:text-black/45'
                  }`}>
                  www.vioramedia.in &nbsp;|&nbsp; contact@vioramedia.in &nbsp;|&nbsp; +91 9994595001
                </p>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}
