import { useState } from 'react';

export default function LetterheadScreen() {

  const [date, setDate] = useState(new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }));
  const [recipientName, setRecipientName] = useState('MR. ALEXANDER REED');
  const [recipientTitle, setRecipientTitle] = useState('Creative Director');
  const [recipientCompany, setRecipientCompany] = useState('LUXE STUDIOS');
  const [salutation, setSalutation] = useState('Dear Mr. Alexander Reed,');
  const [signerName, setSignerName] = useState('ISABELLA VANCE');
  const [signerTitle, setSignerTitle] = useState('Founder, Viora Media');
  const [isPrintMode, setIsPrintMode] = useState(true);
  const [paragraphs, setParagraphs] = useState<string[]>([
    'We are pleased to extend this formal proposal for a strategic partnership between Luxe Studios and Viora Media. Following our recent discussion regarding the co-production of the upcoming cinematic showcases, we believe combining our resources will deliver unmatched experiences for our global audiences.',
    'Under this partnership, Viora Media will provide top-tier editing suites, distribution support, and custom marketing materials, while Luxe Studios will lead raw production and talent recruitment. Detailed terms and revenue projections are outlined in the attached brief.',
    'Please review these guidelines and sign the agreement to initiate the next phase of our collaboration. We look forward to creating exceptional cinema together.'
  ]);

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

  const handlePrint = () => {
    window.print();
  };

  // Heuristic-based paragraph paginator for rendering separate A4 screen blocks
  const paginateParagraphs = () => {
    const pageList: string[][] = [[]];
    let currentPageIdx = 0;
    let currentHeight = 0;

    paragraphs.forEach((p) => {
      // Estimate height of this paragraph:
      // ~75 characters per line, 20px line height, 16px bottom margin
      const lines = Math.ceil(Math.max(p.length, 1) / 75);
      const estHeight = (lines * 20) + 16;

      // Available height limits for paragraphs:
      // Page 1 is shorter due to recipient header, date, and space reserves (~420px)
      // Page 2+ is longer (~780px)
      const maxHeight = currentPageIdx === 0 ? 420 : 780;

      if (currentHeight + estHeight > maxHeight && pageList[currentPageIdx].length > 0) {
        // Create a new page
        currentPageIdx++;
        pageList.push([p]);
        currentHeight = estHeight;
      } else {
        pageList[currentPageIdx].push(p);
        currentHeight += estHeight;
      }
    });

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
            margin: 40mm 20mm 30mm 20mm !important;
          }
          .print-sheet {
            display: none !important;
          }
          
          /* Fixed header and footer for every page */
          .letter-header {
            position: fixed !important;
            top: -30mm !important;
            left: 0 !important;
            right: 0 !important;
            height: 120px !important;
            z-index: 50 !important;
            background-color: ${paperBgColor} !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .letter-footer {
            position: fixed !important;
            bottom: -20mm !important;
            left: 0 !important;
            right: 0 !important;
            height: 60px !important;
            z-index: 50 !important;
            background-color: ${paperBgColor} !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .letter-watermark {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            width: 120mm !important;
            height: auto !important;
            transform: translate(-50%, -50%) !important;
            z-index: 0 !important;
            pointer-events: none !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .print-body-content {
            display: block !important;
            position: relative !important;
            z-index: 10 !important;
            page-break-inside: auto !important;
          }
          .print-body-content p {
            page-break-inside: avoid !important;
          }
          .no-break {
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      {/* LEFT COLUMN: EDITOR PANEL (hidden in print) */}
      <div className="w-full md:w-1/3 min-w-[320px] max-w-[450px] border-r border-white/5 bg-primary-light p-6 overflow-y-auto h-auto md:h-screen sticky top-0 print:hidden flex flex-col gap-6 select-none">
        <div>
          <span className="text-[10px] tracking-[0.25em] text-secondary font-semibold uppercase">Toolbox</span>
          <h2 className="font-serif text-2xl text-white tracking-wide mt-1">Letterhead Builder</h2>
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

            <div>
              <label className="text-[9px] tracking-wider text-accent-muted uppercase block mb-1">Salutation</label>
              <input
                type="text"
                value={salutation}
                onChange={(e) => setSalutation(e.target.value)}
                className="w-full bg-black/40 border border-white/10 hover:border-white/20 focus:border-secondary transition-all rounded-sm px-3 py-2 text-xs text-white focus:outline-none"
              />
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

          <hr className="border-white/5" />

          {/* Signer Details */}
          <div className="space-y-3.5">
            <span className="text-[10px] tracking-widest text-secondary font-semibold uppercase block">Signature Details</span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] tracking-wider text-accent-muted uppercase block mb-1">Signer Name</label>
                <input
                  type="text"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 hover:border-white/20 focus:border-secondary transition-all rounded-sm px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[9px] tracking-wider text-accent-muted uppercase block mb-1">Title / Designation</label>
                <input
                  type="text"
                  value={signerTitle}
                  onChange={(e) => setSignerTitle(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 hover:border-white/20 focus:border-secondary transition-all rounded-sm px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="mt-auto w-full py-3 bg-secondary hover:bg-white text-black font-bold text-xs tracking-widest uppercase transition-all duration-300 rounded-sm text-center flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(197,160,89,0.15)]"
        >
          <i className="fa-solid fa-print text-sm"></i> Print / Export PDF
        </button>
      </div>

      {/* RIGHT COLUMN: PREVIEW PANEL */}
      <div className="flex-1 bg-black/50 p-6 md:p-12 overflow-y-auto h-screen print:h-auto print:p-0 flex flex-col items-center gap-8 min-w-0 print:block print:static">

        {/* Loop through paginated screen pages */}
        {paginateParagraphs().map((pageParas, pageIdx, allPages) => {
          const isFirstPage = pageIdx === 0;
          const isLastPage = pageIdx === allPages.length - 1;

          return (
            <div
              key={pageIdx}
              className={`print-sheet w-full max-w-[800px] aspect-[1/1.414] shadow-[0_12px_40px_rgba(0,0,0,0.4)] px-12 md:px-16 py-14 flex flex-col justify-between font-serif relative transition-all duration-300 print:hidden ${isPrintMode
                ? 'bg-[#F9F8F5] text-black border border-black/5'
                : 'bg-[#080808] text-white border border-white/5'
                }`}
              style={{ minHeight: '297mm' }}
            >
              {/* Centered Watermark Logo */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
                <img
                  src="/file_no_bg.svg"
                  alt="Watermark"
                  className={`w-3/5 h-auto object-contain transition-opacity duration-300 ${isPrintMode ? 'opacity-[0.12]' : 'opacity-[0.06]'
                    }`}
                />
              </div>

              {/* Top Logo Header */}
              <div className="flex flex-col gap-4 relative z-10">
                <div className="flex justify-between items-center w-full">
                  {/* Left Side: Logo and Title */}
                  <div className="flex items-center gap-3">
                    <img
                      src="/logo.jpg"
                      alt="Viora Media Logo"
                      className="h-10 w-10 object-contain rounded-md border border-secondary/20 flex-shrink-0"
                    />
                    <div className="flex flex-col text-left">
                      <span className={`font-serif tracking-[0.25em] text-lg font-bold uppercase ${isPrintMode ? 'text-black' : 'text-white'}`}>
                        VIORA
                      </span>
                      <span className="text-[8px] tracking-[0.4em] text-secondary font-semibold uppercase mt-0.5 block">
                        MEDIA
                      </span>
                    </div>
                  </div>

                  {/* Right Side: Header Contacts */}
                  <div className="flex flex-col text-right font-sans">
                    <span className={`text-[9px] tracking-widest font-semibold uppercase ${isPrintMode ? 'text-black/70' : 'text-white/70'}`}>
                      www.vioramedia.in
                    </span>
                    <span className={`text-[8px] tracking-wider font-light mt-0.5 lowercase ${isPrintMode ? 'text-black/50' : 'text-white/50'}`}>
                      contact@vioramedia.in
                    </span>
                  </div>
                </div>

                {/* Divider Line with Clapboard in Center */}
                <div className="relative flex items-center justify-center py-1 w-full">
                  <div className={`flex-grow h-[0.5px] ${isPrintMode ? 'bg-black/10' : 'bg-white/10'}`} />
                  <i className="fa-solid fa-clapperboard text-secondary text-[11px] mx-4"></i>
                  <div className={`flex-grow h-[0.5px] ${isPrintMode ? 'bg-black/10' : 'bg-white/10'}`} />
                </div>
              </div>

              {/* Letter Body Container */}
              <div className="flex-grow my-12 text-left font-sans text-[13px] md:text-sm font-light leading-relaxed flex flex-col justify-between relative z-10">
                <div className="space-y-6">
                  {/* Date, Recipient, Salutation only on first page */}
                  {isFirstPage && (
                    <>
                      {/* Date String */}
                      <p className={`font-semibold tracking-wide text-xs ${isPrintMode ? 'text-black/80' : 'text-white/80'}`}>
                        {date}
                      </p>

                      {/* Recipient Details */}
                      <div className="space-y-1">
                        <p className={`font-bold tracking-wide text-xs ${isPrintMode ? 'text-black/90' : 'text-white/90'}`}>
                          {recipientName}
                        </p>
                        <p className={`text-xs ${isPrintMode ? 'text-black/60' : 'text-white/60'}`}>
                          {recipientTitle}
                        </p>
                        <p className={`text-xs ${isPrintMode ? 'text-black/60' : 'text-white/60'}`}>
                          {recipientCompany}
                        </p>
                      </div>

                      {/* Salutation */}
                      <p className={`mt-8 ${isPrintMode ? 'text-black/80' : 'text-white/80'}`}>
                        {salutation}
                      </p>
                    </>
                  )}

                  {/* Paragraphs allocated to this page */}
                  <div className="space-y-4">
                    {pageParas.map((p, idx) => (
                      <p
                        key={idx}
                        className={`leading-relaxed text-justify indent-8 tracking-wide ${isPrintMode ? 'text-black/70' : 'text-white/70'}`}
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Sign-off & Signature Block only on the last page */}
                {isLastPage && (
                  <div className="mt-12 relative select-none">
                    <p className={isPrintMode ? 'text-black/70' : 'text-white/70'}>Sincerely,</p>

                    {/* Signature Image */}
                    <div className="absolute top-[3px] left-0 h-28 pointer-events-none z-0">
                      <img
                        src="/SignatureV.png"
                        alt="Signature"
                        className={`h-28 w-auto object-contain select-none transition-all duration-300 transform -translate-x-6 translate-y-3 ${isPrintMode ? 'invert-0' : 'invert brightness-[2]'
                          }`}
                      />
                    </div>

                    <div className="space-y-1 relative z-10 pt-20">
                      <p className={`font-bold tracking-wide text-xs ${isPrintMode ? 'text-black/90' : 'text-white/90'}`}>
                        {signerName}
                      </p>
                      <p className={`text-[11px] ${isPrintMode ? 'text-black/50' : 'text-white/50'}`}>
                        {signerTitle}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Letter Footer Details */}
              <div className="border-t border-secondary/20 pt-5 text-center font-sans relative z-10">
                <p className="text-[10px] font-bold text-secondary tracking-widest uppercase">
                  Viora Media
                </p>
                <p className={`text-[8px] tracking-[0.2em] font-light mt-1.5 uppercase ${isPrintMode ? 'text-black/45' : 'text-white/45'}`}>
                  www.vioramedia.in &nbsp;|&nbsp; contact@vioramedia.in &nbsp;|&nbsp; +91 9994595001
                </p>
              </div>
            </div>
          );
        })}

        {/* Print-Only Page Wrapper (Clean semantic block flow, hidden on screen, visible during print) */}
        <div className="hidden print:block w-full text-black font-serif bg-transparent">
          {/* Centered Watermark Logo (Print View - Fixed on every page) */}
          <img
            src="/file_no_bg.svg"
            alt="Watermark"
            className="letter-watermark opacity-[0.12]"
          />

          {/* Top Logo Header (Print: position fixed on every page) */}
          <div className="letter-header flex flex-col gap-4">
            <div className="flex justify-between items-center w-full">
              {/* Left Side: Logo and Title */}
              <div className="flex items-center gap-3">
                <img
                  src="/logo.jpg"
                  alt="Viora Media Logo"
                  className="h-10 w-10 object-contain rounded-md border border-secondary/20 flex-shrink-0"
                />
                <div className="flex flex-col text-left">
                  <span className="font-serif tracking-[0.25em] text-lg font-bold uppercase text-black">
                    VIORA
                  </span>
                  <span className="text-[8px] tracking-[0.4em] text-secondary font-semibold uppercase mt-0.5 block">
                    MEDIA
                  </span>
                </div>
              </div>

              {/* Right Side: Header Contacts */}
              <div className="flex flex-col text-right font-sans">
                <span className="text-[9px] tracking-widest font-semibold uppercase text-black/70">
                  www.vioramedia.in
                </span>
                <span className="text-[8px] tracking-wider font-light mt-0.5 lowercase text-black/50">
                  contact@vioramedia.in
                </span>
              </div>
            </div>

            {/* Divider Line with Clapboard in Center */}
            <div className="relative flex items-center justify-center py-1 w-full">
              <div className="flex-grow h-[0.5px] bg-black/10" />
              <i className="fa-solid fa-clapperboard text-secondary text-[11px] mx-4"></i>
              <div className="flex-grow h-[0.5px] bg-black/10" />
            </div>
          </div>

          {/* Letter Body Container */}
          <div className="print-body-content text-left font-sans text-sm font-light leading-relaxed">
            <div className="space-y-6">
              {/* Date String */}
              <p className="font-semibold tracking-wide text-xs text-black/80">
                {date}
              </p>

              {/* Recipient Details */}
              <div className="space-y-1">
                <p className="font-bold tracking-wide text-xs text-black/90">
                  {recipientName}
                </p>
                <p className="text-xs text-black/60">
                  {recipientTitle}
                </p>
                <p className="text-xs text-black/60">
                  {recipientCompany}
                </p>
              </div>

              {/* Salutation */}
              <p className="mt-8 text-black/80">
                {salutation}
              </p>

              {/* Paragraphs */}
              <div className="space-y-4">
                {paragraphs.map((p, idx) => (
                  <p
                    key={idx}
                    className="leading-relaxed text-justify indent-8 tracking-wide text-black/70"
                  >
                    {p}
                  </p>
                ))}
              </div>
            </div>

            {/* Sign-off & Signature Block */}
            <div className="no-break mt-12 relative select-none">
              <p className="text-black/70">Sincerely,</p>

              {/* Signature Image */}
              <div className="absolute top-[3px] left-0 h-28 pointer-events-none z-0">
                <img
                  src="/SignatureV.png"
                  alt="Signature"
                  className="h-28 w-auto object-contain select-none transform -translate-x-6 translate-y-3 invert-0"
                />
              </div>

              <div className="space-y-1 relative z-10 pt-20">
                <p className="font-bold tracking-wide text-xs text-black/90">
                  {signerName}
                </p>
                <p className="text-[11px] text-black/50">
                  {signerTitle}
                </p>
              </div>
            </div>
          </div>

          {/* Letter Footer Details (Print: position fixed on every page) */}
          <div className="letter-footer border-t border-secondary/20 pt-5 text-center font-sans">
            <p className="text-[10px] font-bold text-secondary tracking-widest uppercase">
              Viora Media
            </p>
            <p className="text-[8px] tracking-[0.2em] font-light mt-1.5 uppercase text-black/45">
              www.vioramedia.in &nbsp;|&nbsp; contact@vioramedia.in &nbsp;|&nbsp; +91 9994595001
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
