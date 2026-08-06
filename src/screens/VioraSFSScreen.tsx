import { useState } from 'react';
import { useSeo } from '../hooks/useSeo';
import { supabase } from '../supabaseClient';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

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

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: {
    city: string;
    genre: string;
    director: string;
    film_title: string;
    category: string;
  };
  theme: {
    color: string;
  };
  handler: (response: { razorpay_payment_id: string }) => void;
  modal: {
    ondismiss: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
}

interface RazorpayConstructor {
  new(options: RazorpayOptions): RazorpayInstance;
}

interface RazorpayWindow {
  Razorpay?: RazorpayConstructor;
}

export default function VioraSFSScreen() {
  useSeo({
    title: 'Viora Short Film Fest 2026 | Official Rulebook & Submission Guidelines',
    description: 'Official Rulebook and Submission Portal for Viora Short Film Fest 2026. Explore categories, awards, eligibility, submission guidelines, and register your short film.'
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'categories' | 'eligibility' | 'opportunities' | 'judging' | 'copyright'>('overview');

  // Section 1: Submitter Info & Student Details
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [isCollegeStudent, setIsCollegeStudent] = useState(false);
  const [collegeIdFile, setCollegeIdFile] = useState<File | null>(null);

  // Section 2: Film Details
  const [filmTitle, setFilmTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [runtime, setRuntime] = useState('');
  const [logline, setLogline] = useState('');
  const [lang, setLang] = useState('');

  // Section 3: Cast & Crew
  const [director, setDirector] = useState('');
  const [cinematographer, setCinematographer] = useState('');
  const [editor, setEditor] = useState('');
  const [music, setMusic] = useState('');
  const [soundEngineer, setSoundEngineer] = useState('');
  const [mainActor, setMainActor] = useState('');
  const [mainActress, setMainActress] = useState('');

  // Section 4: Movie Upload, Poster & Agreements
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [agreeRules, setAgreeRules] = useState(false);
  const [allowMediaUse, setAllowMediaUse] = useState(false);

  // Razorpay Integration State
  const [paying, setPaying] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const feeAmount = isCollegeStudent ? 499 : 799;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const rzpWindow = window as unknown as RazorpayWindow;
      if (rzpWindow.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPosterFile(e.target.files[0]);
    }
  };

  const validateStep = () => {
    setErrorMessage(null);
    if (step === 1) {
      if (!name || !phone || !email || !city) {
        setErrorMessage('All contact information fields are required.');
        return false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setErrorMessage('Please enter a valid email address.');
        return false;
      }

      const digitsOnly = phone.replace(/\D/g, '');
      if (digitsOnly.length < 10) {
        setErrorMessage('Please enter a valid phone number (at least 10 digits).');
        return false;
      }

      if (isCollegeStudent && !collegeIdFile) {
        setErrorMessage('Please upload a scanned copy of your Student ID Card.');
        return false;
      }
    } else if (step === 2) {
      if (!filmTitle || !genre || !runtime || !logline || !lang) {
        setErrorMessage('All film metadata fields are required.');
        return false;
      }
    } else if (step === 3) {
      if (!director) {
        setErrorMessage('Director name is required.');
        return false;
      }
    } else if (step === 4) {
      if (!selectedFile) {
        setErrorMessage('Please select a movie file to submit.');
        return false;
      }
      if (!agreeRules) {
        setErrorMessage('You must agree to the festival rules to proceed.');
        return false;
      }
      if (!allowMediaUse) {
        setErrorMessage('You must authorize Viora to use the poster/cut.');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setErrorMessage(null);
    setStep((prev) => prev - 1);
  };

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    setPaying(true);
    setErrorMessage(null);

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setPaying(false);
      setErrorMessage('Failed to load Razorpay payment gateway. Please check your internet connection.');
      return;
    }

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_V3Vq4K9lB5j9yF';
    const rzpWindow = window as unknown as RazorpayWindow;

    if (!rzpWindow.Razorpay) {
      setPaying(false);
      setErrorMessage('Razorpay SDK script not initialized properly.');
      return;
    }

    const options: RazorpayOptions = {
      key: razorpayKey,
      amount: feeAmount * 100, // in paise (₹499 or ₹799)
      currency: 'INR',
      name: 'Viora Media',
      description: `SFS 2026 (${isCollegeStudent ? 'Student Category' : 'Professional Category'}): ${filmTitle}`,
      prefill: {
        name,
        email,
        contact: phone
      },
      notes: {
        city: `${city}, ${stateName}`,
        genre,
        director,
        film_title: filmTitle,
        category: isCollegeStudent ? 'Student' : 'Professional'
      },
      theme: {
        color: '#C5A059'
      },
      handler: function (response: { razorpay_payment_id: string }) {
        setPaying(false);
        startMovieUpload(response.razorpay_payment_id);
      },
      modal: {
        ondismiss: function () {
          setPaying(false);
        }
      }
    };

    try {
      const Razorpay = rzpWindow.Razorpay;
      const rzp = new Razorpay(options);
      rzp.open();
    } catch (err) {
      setPaying(false);
      const errorMsg = err instanceof Error ? err.message : 'Razorpay initiation failed. Please make sure VITE_RAZORPAY_KEY_ID is valid.';
      setErrorMessage(errorMsg);
    }
  };

  const startMovieUpload = async (paymentId: string) => {
    setUploading(true);
    setProgress(0);

    try {
      if (!selectedFile) {
        throw new Error('No movie file selected.');
      }

      // 1. Upload Movie File directly to Cloudflare R2
      const movieFileName = `movies/${Date.now()}_${selectedFile.name}`;
      const movieUpload = new Upload({
        client: r2Client,
        params: {
          Bucket: 'viorasf',
          Key: movieFileName,
          Body: selectedFile,
          ContentType: selectedFile.type,
        },
      });

      movieUpload.on('httpUploadProgress', (progressEvent) => {
        if (progressEvent.loaded && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded / progressEvent.total) * 95);
          setProgress(percent);
        }
      });

      try {
        await movieUpload.done();
      } catch (uploadErr: any) {
        throw new Error(`Movie upload to R2 failed: ${uploadErr.message}`);
      }

      const movieUrl = movieFileName;

      // 2. Upload College ID Card file if applicable
      let idUrl = null;
      if (isCollegeStudent && collegeIdFile) {
        const idFileName = `id/${Date.now()}_${collegeIdFile.name}`;
        const idPutCommand = new PutObjectCommand({
          Bucket: 'viorasf',
          Key: idFileName,
          Body: collegeIdFile,
          ContentType: collegeIdFile.type,
        });

        try {
          await r2Client.send(idPutCommand);
          idUrl = idFileName;
        } catch (uploadErr: any) {
          throw new Error(`College ID upload to R2 failed: ${uploadErr.message}`);
        }
      }

      // 3. Upload Poster File if available
      let posterUrl = null;
      if (posterFile) {
        const posterFileName = `posters/${Date.now()}_${posterFile.name}`;
        const posterPutCommand = new PutObjectCommand({
          Bucket: 'viorasf',
          Key: posterFileName,
          Body: posterFile,
          ContentType: posterFile.type,
        });

        try {
          await r2Client.send(posterPutCommand);
          posterUrl = posterFileName;
        } catch (uploadErr: any) {
          throw new Error(`Poster upload to R2 failed: ${uploadErr.message}`);
        }
      }

      // 4. Insert details into Supabase
      const { error: insertError } = await supabase
        .from('festival_submissions')
        .insert([
          {
            name,
            phone,
            email,
            city: stateName ? `${city}, ${stateName}` : city,
            is_cs: isCollegeStudent,
            id_url: idUrl,
            film_title: filmTitle,
            genre,
            runtime,
            logline,
            lang,
            director,
            cinematographer: cinematographer || null,
            editor: editor || null,
            music_composer: music || null,
            sound_engineer: soundEngineer || null,
            main_actor: mainActor || null,
            main_actress: mainActress || null,
            movie_url: movieUrl,
            poster_url: posterUrl,
            payment_id: paymentId,
            payment_status: 'completed',
            amount_paid: feeAmount
          }
        ]);

      if (insertError) {
        throw new Error(`Database insert failed: ${insertError.message}`);
      }

      setProgress(100);
      setTimeout(() => {
        setUploading(false);
        setSubmitted(true);
      }, 500);

    } catch (err) {
      setUploading(false);
      const errorMsg = err instanceof Error ? err.message : 'Submission failed. Please check your network and try again.';
      setErrorMessage(errorMsg);
    }
  };

  const resetForm = () => {
    setStep(1);
    setName('');
    setPhone('');
    setEmail('');
    setCity('');
    setStateName('');
    setIsCollegeStudent(false);
    setCollegeIdFile(null);
    setFilmTitle('');
    setGenre('');
    setRuntime('');
    setLogline('');
    setLang('');
    setDirector('');
    setCinematographer('');
    setEditor('');
    setMusic('');
    setSoundEngineer('');
    setMainActor('');
    setMainActress('');
    setSelectedFile(null);
    setPosterFile(null);
    setAgreeRules(false);
    setAllowMediaUse(false);
    setProgress(0);
    setUploading(false);
    setSubmitted(false);
    setErrorMessage(null);
    setIsModalOpen(false);
  };

  const openRegistrationWithCategory = (student: boolean) => {
    setIsCollegeStudent(student);
    setIsModalOpen(true);
    setStep(1);
  };

  return (
    <div className="w-full bg-black min-h-screen pb-24 text-white relative">
      {/* Header Banner / Hero Section */}
      <section className="relative border-b border-white/10 overflow-hidden bg-gradient-to-b from-black via-primary-dark/80 to-black py-16 md:py-24">
        {/* Ambient Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="w-[700px] h-[700px] bg-secondary/10 rounded-full blur-[150px] animate-pulse-slow" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          {/* Partner Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8 text-[11px] font-mono uppercase tracking-widest text-accent-muted">
            <span className="flex items-center gap-2 border border-secondary/30 bg-secondary/5 px-3 py-1.5 rounded-full text-secondary">
              <i className="fa-solid fa-award"></i> VIORA MEDIA
            </span>
            <span className="text-white/30">•</span>
            <span className="flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-1.5 rounded-full text-white/80">
              <i className="fa-solid fa-handshake"></i> Official Acquisition Partner: VERUS PRODUCTIONS
            </span>
          </div>

          <h1 className="font-serif text-4xl md:text-7xl tracking-wide leading-tight max-w-5xl mx-auto mb-6">
            VIORA SHORT FILM FEST <br />
            <span className="text-gold-gradient font-italic font-normal">2026</span>
          </h1>

          <div className="inline-block px-4 py-1 border border-secondary/40 text-secondary text-xs uppercase tracking-[0.25em] rounded-full mb-6 font-mono">
            Official Rulebook & Submission Guidelines
          </div>

          <p className="text-sm md:text-lg text-accent-muted font-light leading-relaxed max-w-3xl mx-auto italic mb-10">
            "Every remarkable film begins with a story worth telling."
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => openRegistrationWithCategory(false)}
              className="px-8 py-4 bg-secondary text-black font-semibold text-xs tracking-widest uppercase rounded-sm hover:bg-white transition-all duration-300 shadow-[0_0_25px_rgba(197,160,89,0.3)] cursor-pointer flex items-center gap-2"
            >
              <i className="fa-solid fa-paper-plane"></i> Submit Your Short Film
            </button>
            <a
              href="#schedule"
              className="px-8 py-4 bg-transparent border border-white/20 text-white font-semibold text-xs tracking-widest uppercase rounded-sm hover:border-secondary hover:text-secondary transition-all duration-300 flex items-center gap-2"
            >
              <i className="fa-solid fa-calendar-days"></i> View Schedule
            </a>
          </div>
        </div>
      </section>

      {/* Navigation Tabs Bar */}
      <nav className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/10 py-3 px-6 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-center overflow-x-auto no-scrollbar gap-2 md:gap-8 text-xs font-mono tracking-widest uppercase">
          {[
            { id: 'overview', label: 'About & Vision', icon: 'fa-circle-info' },
            { id: 'categories', label: 'Categories & Fees', icon: 'fa-tags' },
            { id: 'eligibility', label: 'Film Eligibility', icon: 'fa-film' },
            { id: 'opportunities', label: 'Verus Opportunities', icon: 'fa-star' },
            { id: 'judging', label: 'Judging & Criteria', icon: 'fa-gavel' },
            { id: 'copyright', label: 'Copyright & Terms', icon: 'fa-shield-halved' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                document.getElementById(tab.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-4 py-2 rounded-sm transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${activeTab === tab.id
                ? 'bg-secondary/20 text-secondary border border-secondary/40 font-semibold'
                : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
            >
              <i className={`fa-solid ${tab.icon}`}></i>
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-24">

        {/* SECTION 1: ABOUT THE FESTIVAL & VISION */}
        <section id="overview" className="scroll-mt-24 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono text-secondary tracking-[0.2em] uppercase">Page 02</span>
            <h2 className="font-serif text-3xl md:text-5xl tracking-wide">
              About The <span className="text-gold-gradient font-italic font-normal">Festival</span>
            </h2>
            <p className="text-xs text-accent-muted max-w-2xl mx-auto font-light">
              Celebrating original storytelling, emerging talent, and cinematic excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Welcome & Vision */}
            <div className="bg-primary-light/60 border border-white/10 p-8 rounded-sm space-y-6">
              <div className="space-y-3">
                <h3 className="font-serif text-xl text-secondary flex items-center gap-3">
                  <i className="fa-solid fa-clapperboard text-secondary/70"></i> Welcome to VIORA
                </h3>
                <p className="text-xs md:text-sm text-white/80 font-light leading-relaxed">
                  VIORA Short Film Fest is a celebration of original storytelling, emerging talent and cinematic excellence. Created for passionate filmmakers, the festival provides a professional platform where creative voices can showcase their work, connect with the filmmaking community and gain meaningful industry exposure.
                </p>
                <p className="text-xs md:text-sm text-white/80 font-light leading-relaxed">
                  Designed for both <strong className="text-white">Student</strong> and <strong className="text-white">Professional</strong> filmmakers, the festival welcomes stories that inspire, challenge and entertain while encouraging originality, artistic expression and technical craftsmanship.
                </p>
              </div>

              <div className="border-t border-white/10 pt-6 space-y-3">
                <h3 className="font-serif text-xl text-secondary flex items-center gap-3">
                  <i className="fa-solid fa-compass text-secondary/70"></i> Our Vision
                </h3>
                <p className="text-xs md:text-sm text-white/80 font-light leading-relaxed">
                  Our vision is to build a thriving community where filmmakers are recognised not only for winning awards but also for creating lasting opportunities. Through industry collaboration, networking, acquisition opportunities and exhibition platforms, VIORA aims to support filmmakers beyond the festival and contribute to the growth of independent cinema.
                </p>
              </div>
            </div>

            {/* Why Participate */}
            <div className="bg-primary-light/60 border border-white/10 p-8 rounded-sm space-y-6 flex flex-col justify-between">
              <h3 className="font-serif text-xl text-secondary flex items-center gap-3">
                <i className="fa-solid fa-rocket text-secondary/70"></i> Why Participate?
              </h3>

              <div className="space-y-3">
                {[
                  'Two dedicated competition categories (Student & Professional).',
                  'Industry-focused recognition & professional evaluation.',
                  'Official acquisition opportunities with VERUS Productions.',
                  'Pilot film narration opportunity for First Prize winners.',
                  'Opportunity to release your film through VIORA Media Hub YouTube Channel.',
                  'Professional networking environment with filmmakers & industry leaders.'
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-black/40 border border-white/5 rounded-sm">
                    <span className="w-6 h-6 rounded-full bg-secondary/10 border border-secondary/30 text-secondary text-xs flex items-center justify-center shrink-0 font-mono">
                      {i + 1}
                    </span>
                    <span className="text-xs md:text-sm text-white/90 font-light leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-secondary/10 border border-secondary/30 rounded-sm text-center">
                <p className="font-serif italic text-sm text-secondary">
                  "Every remarkable film begins with a story worth telling."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: IMPORTANT DATES & FESTIVAL SCHEDULE */}
        <section id="schedule" className="scroll-mt-24 space-y-12 border-t border-white/10 pt-16">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono text-secondary tracking-[0.2em] uppercase">Page 03</span>
            <h2 className="font-serif text-3xl md:text-5xl tracking-wide">
              Important <span className="text-gold-gradient font-italic font-normal">Dates</span>
            </h2>
            <p className="text-xs text-accent-muted max-w-2xl mx-auto font-light">
              Festival Schedule 2026 — Mark your calendar for key submission milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                num: '01',
                title: 'REGISTRATION OPENS',
                date: '31 JULY 2026',
                desc: 'Online registrations officially begin through the VIORA Media website.',
                icon: 'fa-door-open',
                status: 'Open Now'
              },
              {
                num: '02',
                title: 'SUBMISSION DEADLINE',
                date: '30 AUGUST 2026',
                desc: 'Last date to complete registration and submit your short film cut.',
                icon: 'fa-clock',
                status: 'Upcoming'
              },
              {
                num: '03',
                title: 'OFFICIAL SHORTLIST',
                date: '08 SEPTEMBER 2026',
                desc: 'Selected films from both competition categories will be announced.',
                icon: 'fa-list-check',
                status: 'Phase 3'
              },
              {
                num: '04',
                title: 'SCREENING & AWARDS',
                date: '12 SEPTEMBER 2026',
                desc: 'Official festival screenings followed by awards presentation and networking.',
                icon: 'fa-trophy',
                status: 'Final Gala'
              }
            ].map((step, idx) => (
              <div
                key={idx}
                className="bg-primary-light/60 border border-white/10 p-6 rounded-sm space-y-4 relative group hover:border-secondary/50 transition-all duration-300"
              >
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-serif font-bold text-secondary">{step.num}</span>
                  <span className="text-[10px] font-mono tracking-widest uppercase bg-secondary/10 border border-secondary/30 text-secondary px-2.5 py-0.5 rounded-full">
                    {step.status}
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-sm tracking-wider text-white uppercase">{step.title}</h3>
                  <p className="text-xs font-mono text-secondary font-semibold">{step.date}</p>
                </div>
                <p className="text-xs text-accent-muted font-light leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-primary-light/40 border border-white/10 p-6 rounded-sm flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-accent-muted">
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-circle-exclamation text-secondary text-lg"></i>
              <div>
                <strong className="text-white block font-medium">Important Registration Notes:</strong>
                <span>Late submissions will not be accepted. Incomplete submissions may be disqualified. Dates subject to change if required.</span>
              </div>
            </div>
            <button
              onClick={() => openRegistrationWithCategory(false)}
              className="px-6 py-2.5 bg-secondary text-black font-semibold text-[11px] tracking-widest uppercase rounded-sm hover:bg-white transition-all whitespace-nowrap cursor-pointer"
            >
              Register Now
            </button>
          </div>
        </section>

        {/* SECTION 3: FESTIVAL CATEGORIES & ENTRY FEES & AWARDS */}
        <section id="categories" className="scroll-mt-24 space-y-12 border-t border-white/10 pt-16">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono text-secondary tracking-[0.2em] uppercase">Pages 04 & 06</span>
            <h2 className="font-serif text-3xl md:text-5xl tracking-wide">
              Festival <span className="text-gold-gradient font-italic font-normal">Categories & Awards</span>
            </h2>
            <p className="text-xs text-accent-muted max-w-2xl mx-auto font-light">
              VIORA Short Film Fest 2026 welcomes filmmakers through two dedicated competition categories, ensuring fair & meaningful recognition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Student Category */}
            <div className="bg-primary-light/60 border border-secondary/30 p-8 rounded-sm space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-secondary text-black font-mono text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-bl-sm">
                Student Special
              </div>

              <div>
                <span className="text-xs font-mono text-secondary uppercase tracking-widest">Category 01</span>
                <h3 className="font-serif text-2xl text-white tracking-wide mt-1">STUDENT CATEGORY</h3>
                <p className="text-xs text-accent-muted italic">For aspiring student filmmakers currently enrolled in school, college or university.</p>
              </div>

              {/* Pricing Box */}
              <div className="bg-black/50 border border-white/10 p-6 rounded-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-accent-muted uppercase tracking-widest block">Entry Fee</span>
                  <span className="font-serif text-3xl text-secondary font-bold">₹499</span>
                </div>
                <button
                  onClick={() => openRegistrationWithCategory(true)}
                  className="px-6 py-2.5 bg-secondary text-black font-semibold text-[11px] tracking-widest uppercase rounded-sm hover:bg-white transition-all cursor-pointer"
                >
                  Apply as Student
                </button>
              </div>

              {/* Rules & Eligibility */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-accent-muted">Who Can Apply:</span>
                  <span className="text-white font-medium text-right">Enrolled Students (School, College, Univ)</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-accent-muted">Participation:</span>
                  <span className="text-white font-medium">Individual & Team Submissions</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-accent-muted">Verification:</span>
                  <span className="text-white font-medium text-right">Valid Student ID Required at Registration</span>
                </div>
              </div>

              {/* Narration with Verus Productions */}
              <div className="border-t border-white/10 pt-6">
                <div className="p-4 bg-secondary/5 border border-secondary/30 rounded-sm flex items-start gap-3">
                  <i className="fa-solid fa-bullhorn text-secondary text-lg mt-0.5 shrink-0"></i>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-secondary uppercase tracking-widest block">1st Prize Exclusive</span>
                    <h4 className="font-serif text-sm text-white">Pilot Film Narration with VERUS Productions</h4>
                    <p className="text-[11px] text-accent-muted font-light leading-relaxed">
                      The First Prize winner receives an exclusive opportunity to narrate a pilot feature film project directly to the VERUS production team.
                    </p>
                  </div>
                </div>
              </div>

              {/* Cash Prizes */}
              <div className="border-t border-white/10 pt-6 space-y-4">
                <h4 className="font-serif text-sm text-secondary uppercase tracking-wider flex items-center gap-2">
                  <i className="fa-solid fa-trophy"></i> Category Cash Prizes
                </h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-black/40 border border-white/10 rounded-sm">
                    <span className="text-[10px] font-mono text-secondary block">1ST PRIZE</span>
                    <span className="font-serif text-lg text-white font-bold">₹5,000</span>
                  </div>
                  <div className="p-3 bg-black/40 border border-white/10 rounded-sm">
                    <span className="text-[10px] font-mono text-secondary block">2ND PRIZE</span>
                    <span className="font-serif text-lg text-white font-bold">₹3,000</span>
                  </div>
                  <div className="p-3 bg-black/40 border border-white/10 rounded-sm">
                    <span className="text-[10px] font-mono text-secondary block">3RD PRIZE</span>
                    <span className="font-serif text-lg text-white font-bold">₹2,000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Category */}
            <div className="bg-primary-light/60 border border-white/20 p-8 rounded-sm space-y-8 relative overflow-hidden">
              <div>
                <span className="text-xs font-mono text-secondary uppercase tracking-widest">Category 02</span>
                <h3 className="font-serif text-2xl text-white tracking-wide mt-1">PROFESSIONAL CATEGORY</h3>
                <p className="text-xs text-accent-muted italic">For independent filmmakers, production houses, working professionals & passionate creators.</p>
              </div>

              {/* Pricing Box */}
              <div className="bg-black/50 border border-white/10 p-6 rounded-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-accent-muted uppercase tracking-widest block">Entry Fee</span>
                  <span className="font-serif text-3xl text-secondary font-bold">₹799</span>
                </div>
                <button
                  onClick={() => openRegistrationWithCategory(false)}
                  className="px-6 py-2.5 bg-secondary text-black font-semibold text-[11px] tracking-widest uppercase rounded-sm hover:bg-white transition-all cursor-pointer"
                >
                  Apply as Professional
                </button>
              </div>

              {/* Rules & Eligibility */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-accent-muted">Who Can Apply:</span>
                  <span className="text-white font-medium text-right">Independent Creators & Professionals</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-accent-muted">Participation:</span>
                  <span className="text-white font-medium">Individual & Team Submissions</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-accent-muted">Eligibility:</span>
                  <span className="text-white font-medium text-right">Open to non-student creators</span>
                </div>
              </div>

              {/* Narration with Verus Productions */}
              <div className="border-t border-white/10 pt-6">
                <div className="p-4 bg-secondary/5 border border-secondary/30 rounded-sm flex items-start gap-3">
                  <i className="fa-solid fa-bullhorn text-secondary text-lg mt-0.5 shrink-0"></i>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-secondary uppercase tracking-widest block">1st Prize Exclusive</span>
                    <h4 className="font-serif text-sm text-white">Pilot Film Narration with VERUS Productions</h4>
                    <p className="text-[11px] text-accent-muted font-light leading-relaxed">
                      The First Prize winner receives an exclusive opportunity to narrate a pilot feature film project directly to the VERUS production team.
                    </p>
                  </div>
                </div>
              </div>

              {/* Cash Prizes */}
              <div className="border-t border-white/10 pt-6 space-y-4">
                <h4 className="font-serif text-sm text-secondary uppercase tracking-wider flex items-center gap-2">
                  <i className="fa-solid fa-trophy"></i> Category Cash Prizes
                </h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-black/40 border border-white/10 rounded-sm">
                    <span className="text-[10px] font-mono text-secondary block">1ST PRIZE</span>
                    <span className="font-serif text-lg text-white font-bold">₹5,000</span>
                  </div>
                  <div className="p-3 bg-black/40 border border-white/10 rounded-sm">
                    <span className="text-[10px] font-mono text-secondary block">2ND PRIZE</span>
                    <span className="font-serif text-lg text-white font-bold">₹3,000</span>
                  </div>
                  <div className="p-3 bg-black/40 border border-white/10 rounded-sm">
                    <span className="text-[10px] font-mono text-secondary block">3RD PRIZE</span>
                    <span className="font-serif text-lg text-white font-bold">₹2,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Common Category Benefits */}
          <div className="bg-primary-light/40 border border-white/10 p-6 rounded-sm">
            <h4 className="font-serif text-sm text-secondary uppercase tracking-wider text-center mb-6">
              Both Categories Include
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center text-xs">
              <div className="p-3 bg-black/40 border border-white/5 rounded-sm">
                <i className="fa-solid fa-gavel text-secondary text-base mb-2"></i>
                <p className="text-white font-medium">Independent Jury Evaluation</p>
              </div>
              <div className="p-3 bg-black/40 border border-white/5 rounded-sm">
                <i className="fa-solid fa-medal text-secondary text-base mb-2"></i>
                <p className="text-white font-medium">Separate Winners per Category</p>
              </div>
              <div className="p-3 bg-black/40 border border-white/5 rounded-sm">
                <i className="fa-solid fa-film text-secondary text-base mb-2"></i>
                <p className="text-white font-medium">Official Festival Screening</p>
              </div>
              <div className="p-3 bg-black/40 border border-white/5 rounded-sm">
                <i className="fa-solid fa-certificate text-secondary text-base mb-2"></i>
                <p className="text-white font-medium">Certificates for Winners</p>
              </div>
              <div className="p-3 bg-black/40 border border-white/5 rounded-sm col-span-2 md:col-span-1">
                <i className="fa-solid fa-scale-balanced text-secondary text-base mb-2"></i>
                <p className="text-white font-medium">Equal Judging Standards</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: FILM ELIGIBILITY REQUIREMENTS */}
        <section id="eligibility" className="scroll-mt-24 space-y-12 border-t border-white/10 pt-16">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono text-secondary tracking-[0.2em] uppercase">Page 05</span>
            <h2 className="font-serif text-3xl md:text-5xl tracking-wide">
              Film <span className="text-gold-gradient font-italic font-normal">Eligibility</span>
            </h2>
            <p className="text-xs text-accent-muted max-w-2xl mx-auto font-light">
              Every submitted film must satisfy the following eligibility requirements prior to registration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* General Criteria */}
            <div className="bg-primary-light/60 border border-white/10 p-6 rounded-sm space-y-4">
              <h3 className="font-serif text-lg text-secondary border-b border-white/10 pb-2">
                <i className="fa-solid fa-[#C5A059] fa-clock text-secondary mr-2"></i> Runtime & Limits
              </h3>
              <ul className="space-y-3 text-xs text-accent-muted">
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span>Entry Limit:</span>
                  <strong className="text-white">One film per individual or team</strong>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span>Minimum Runtime:</span>
                  <strong className="text-white">5 Minutes</strong>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span>Maximum Runtime:</span>
                  <strong className="text-white">30 Minutes</strong>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span>Allowed Genre:</span>
                  <strong className="text-white">Open Genre (Fictional Narrative)</strong>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span>Submission Format:</span>
                  <strong className="text-white">MP4 (HD recommended)</strong>
                </li>
              </ul>
            </div>

            {/* Language & Release Status */}
            <div className="bg-primary-light/60 border border-white/10 p-6 rounded-sm space-y-4">
              <h3 className="font-serif text-lg text-secondary border-b border-white/10 pb-2">
                <i className="fa-solid fa-language text-secondary mr-2"></i> Language & Subtitles
              </h3>
              <ul className="space-y-3 text-xs text-accent-muted">
                <li className="space-y-1">
                  <span className="text-white block font-medium">Language Policy:</span>
                  <p>Films may be submitted in any language.</p>
                </li>
                <li className="space-y-1">
                  <span className="text-white block font-medium">Subtitles Requirement:</span>
                  <p className="text-secondary">English subtitles are mandatory for films made in languages other than Tamil.</p>
                </li>
                <li className="space-y-1 border-t border-white/5 pt-2">
                  <span className="text-white block font-medium">Film Release Status:</span>
                  <p>Previously completed films are accepted provided they have not been officially released on any public platform before the festival.</p>
                </li>
              </ul>
            </div>

            {/* Excluded Content */}
            <div className="bg-primary-light/60 border border-red-500/20 p-6 rounded-sm space-y-4">
              <h3 className="font-serif text-lg text-red-400 border-b border-red-500/20 pb-2 flex items-center gap-2">
                <i className="fa-solid fa-ban"></i> Not Accepted Formats
              </h3>
              <p className="text-xs text-accent-muted">The following film categories are strictly NOT accepted for VIORA SFS 2026:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  'Animation Films',
                  'Documentary Films',
                  'Web Series Episodes',
                  'Music Videos',
                  'Advertisement Films',
                  'Promotional Videos'
                ].map((item, i) => (
                  <div key={i} className="p-2 bg-red-950/20 border border-red-500/20 rounded-sm text-red-300 text-center font-mono text-[11px]">
                    ✕ {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-secondary/10 border border-secondary/30 p-6 rounded-sm text-xs text-center space-y-2">
            <strong className="text-secondary font-serif text-sm block">COMPLIANCE & ORIGINALITY REQUIREMENT</strong>
            <p className="text-white/80 max-w-4xl mx-auto font-light">
              The submitted film must be an original work created by the participant. All creative rights, music licences and permissions remain the responsibility of the filmmaker. Films failing to satisfy the official eligibility requirements may be rejected before the judging process.
            </p>
          </div>
        </section>

        {/* SECTION 5: EXCLUSIVE OPPORTUNITIES WITH VERUS PRODUCTIONS */}
        <section id="opportunities" className="scroll-mt-24 space-y-12 border-t border-white/10 pt-16">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono text-secondary tracking-[0.2em] uppercase">Page 07</span>
            <h2 className="font-serif text-3xl md:text-5xl tracking-wide">
              Exclusive <span className="text-gold-gradient font-italic font-normal">Opportunities</span>
            </h2>
            <p className="text-xs text-accent-muted max-w-2xl mx-auto font-light">
              Recognition extends beyond the festival through acquisition, industry exposure, and distribution opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                step: '01',
                title: 'OFFICIAL ACQUISITION WITH VERUS',
                desc: 'The First, Second and Third Prize-winning films from both the Student and Professional categories will be considered for acquisition by VERUS PRODUCTIONS. Selected films will be acquired at a mutually agreed value based on the budget quoted by VERUS.',
                icon: 'fa-film'
              },
              {
                step: '02',
                title: 'PILOT FILM NARRATION OPPORTUNITY',
                desc: 'The First Prize winner from both the Student and Professional categories will receive an exclusive opportunity to narrate a pilot feature film project directly to the VERUS production team. Designed to encourage emerging directors with promising storytelling abilities.',
                icon: 'fa-bullhorn'
              },
              {
                step: '03',
                title: 'DIGITAL RELEASE OPPORTUNITY',
                desc: 'Filmmakers who do not have a suitable platform to release their short films may request an official digital release through the VIORA Media Hub YouTube Channel. The release schedule will be determined by festival organisers.',
                icon: 'fa-youtube'
              },
              {
                step: '04',
                title: 'INDUSTRY NETWORKING & COLLABORATION',
                desc: 'VIORA Short Film Fest brings together filmmakers, creators and industry professionals to encourage meaningful networking, collaboration and future creative partnerships beyond the festival context.',
                icon: 'fa-users'
              }
            ].map((opp, idx) => (
              <div
                key={idx}
                className="bg-primary-light/60 border border-white/10 p-8 rounded-sm space-y-4 flex items-start gap-6 relative group hover:border-secondary/40 transition-all"
              >
                <span className="font-serif text-4xl font-bold text-secondary shrink-0">{opp.step}</span>
                <div className="space-y-2">
                  <h3 className="font-serif text-lg text-white tracking-wide">{opp.title}</h3>
                  <p className="text-xs text-accent-muted font-light leading-relaxed">{opp.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Special Awards Matrix */}
          <div className="bg-primary-light/40 border border-white/10 p-8 rounded-sm space-y-6">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-mono text-secondary tracking-widest uppercase">Page 09</span>
              <h3 className="font-serif text-2xl text-white">SPECIAL INDIVIDUAL AWARDS</h3>
              <p className="text-xs text-accent-muted">Determined by the festival jury and audience in recognition of individual excellence across departments.</p>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-9 gap-3 text-center">
              {[
                { title: 'Best Director', icon: 'fa-video' },
                { title: 'Best Actor', icon: 'fa-user-ninja' },
                { title: 'Best Actress', icon: 'fa-user-astronaut' },
                { title: 'Best Cinematography', icon: 'fa-camera-retro' },
                { title: 'Best Editing', icon: 'fa-scissors' },
                { title: 'Best Sound Design', icon: 'fa-sliders' },
                { title: 'Best Music', icon: 'fa-music' },
                { title: 'Special Jury Award', icon: 'fa-star' },
                { title: 'Audience Choice', icon: 'fa-heart' },
              ].map((award, idx) => (
                <div key={idx} className="p-3 bg-black/60 border border-white/10 rounded-sm space-y-2 hover:border-secondary/40 transition-all">
                  <i className={`fa-solid ${award.icon} text-secondary text-sm`}></i>
                  <p className="text-[11px] text-white font-medium leading-tight">{award.title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6: JUDGING PROCESS & SELECTION CRITERIA */}
        <section id="judging" className="scroll-mt-24 space-y-12 border-t border-white/10 pt-16">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono text-secondary tracking-[0.2em] uppercase">Page 11</span>
            <h2 className="font-serif text-3xl md:text-5xl tracking-wide">
              Judging Process & <span className="text-gold-gradient font-italic font-normal">Official Selection</span>
            </h2>
            <p className="text-xs text-accent-muted max-w-2xl mx-auto font-light">
              Every film is evaluated through an independent and fair selection process that values originality, creativity and cinematic excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Selection Process Flow */}
            <div className="bg-primary-light/60 border border-white/10 p-8 rounded-sm space-y-6">
              <h3 className="font-serif text-xl text-secondary flex items-center gap-3">
                <i className="fa-solid fa-list-check"></i> Selection Process Stages
              </h3>

              <div className="space-y-4 text-xs">
                <div className="p-4 bg-black/40 border-l-2 border-secondary rounded-r-sm space-y-1">
                  <strong className="text-white block font-medium">1. Initial Eligibility Review</strong>
                  <p className="text-accent-muted">All submitted films undergo verification for runtime, format, rights, and compliance with festival rules.</p>
                </div>
                <div className="p-4 bg-black/40 border-l-2 border-secondary rounded-r-sm space-y-1">
                  <strong className="text-white block font-medium">2. Official Shortlisting</strong>
                  <p className="text-accent-muted">A selected number of films from both categories will be officially shortlisted and notified via official communication channels.</p>
                </div>
                <div className="p-4 bg-black/40 border-l-2 border-secondary rounded-r-sm space-y-1">
                  <strong className="text-white block font-medium">3. Final Screening & Gala</strong>
                  <p className="text-accent-muted">Officially selected films will be screened during the VIORA Short Film Fest 2026 screening event before award announcements.</p>
                </div>
              </div>

              <div className="p-4 bg-black/60 border border-white/10 rounded-sm space-y-2 text-xs text-accent-muted">
                <strong className="text-white block font-mono text-[11px] uppercase">Jury Decision Policy</strong>
                <p>The decision of the festival jury shall be final and binding. No correspondence regarding final results or judging decisions will be entertained.</p>
              </div>
            </div>

            {/* Judging Criteria list */}
            <div className="bg-primary-light/60 border border-white/10 p-8 rounded-sm space-y-6">
              <h3 className="font-serif text-xl text-secondary flex items-center gap-3">
                <i className="fa-solid fa-scale-balanced"></i> Official Judging Criteria
              </h3>
              <p className="text-xs text-accent-muted">Submitted entries are evaluated on a balanced score across the following 9 cinematic pillars:</p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  '1. Storytelling',
                  '2. Screenplay',
                  '3. Direction',
                  '4. Performances',
                  '5. Technical Execution',
                  '6. Cinematography',
                  '7. Editing',
                  '8. Sound & Music',
                  '9. Overall Creative Impact'
                ].map((crit, idx) => (
                  <div key={idx} className="p-3 bg-black/40 border border-white/5 rounded-sm font-medium text-white flex items-center gap-2">
                    <i className="fa-solid fa-check text-secondary text-xs"></i>
                    <span>{crit}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-secondary/10 border border-secondary/30 rounded-sm text-xs text-center">
                <strong className="text-secondary font-mono text-[11px] uppercase block mb-1">Our Commitment</strong>
                <p className="text-white/80 font-light">
                  VIORA Short Film Fest is committed to recognising genuine creativity through a fair, transparent and independent evaluation process. Every submission receives equal consideration within its respective category.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: COPYRIGHT, ORIGINALITY & LEGAL TERMS */}
        <section id="copyright" className="scroll-mt-24 space-y-12 border-t border-white/10 pt-16">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono text-secondary tracking-[0.2em] uppercase">Page 10</span>
            <h2 className="font-serif text-3xl md:text-5xl tracking-wide">
              Copyright & <span className="text-gold-gradient font-italic font-normal">Originality</span>
            </h2>
            <p className="text-xs text-accent-muted max-w-2xl mx-auto font-light">
              Every submission should reflect originality, creative integrity and responsible filmmaking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="bg-primary-light/60 border border-white/10 p-6 rounded-sm space-y-3">
              <h3 className="font-serif text-base text-secondary flex items-center gap-2">
                <i className="fa-solid fa-copyright"></i> Original Work & Rights
              </h3>
              <p className="text-accent-muted leading-relaxed">
                Every submitted film must be an original creative work. Participants must own or have legal permission to use all visuals, music, footage, graphics and other copyrighted material included in the film.
              </p>
              <p className="text-red-400 font-mono text-[11px]">
                The use of copyrighted material without proper permission is strictly prohibited.
              </p>
            </div>

            <div className="bg-primary-light/60 border border-white/10 p-6 rounded-sm space-y-3">
              <h3 className="font-serif text-base text-secondary flex items-center gap-2">
                <i className="fa-solid fa-eye"></i> Festival Screening Rights
              </h3>
              <p className="text-accent-muted leading-relaxed">
                By submitting a film, participants grant VIORA Short Film Fest the non-exclusive right to screen the film as part of the festival and related promotional activities.
              </p>
              <p className="text-white/80 leading-relaxed">
                The festival may use film stills, posters, trailers, titles and brief excerpts exclusively for promotional purposes related to the festival.
              </p>
            </div>

            <div className="bg-primary-light/60 border border-white/10 p-6 rounded-sm space-y-3">
              <h3 className="font-serif text-base text-secondary flex items-center gap-2">
                <i className="fa-solid fa-user-shield"></i> Participant Rights
              </h3>
              <p className="text-accent-muted leading-relaxed">
                All intellectual property rights remain with the original creators. Submission does NOT transfer ownership of the film to VIORA Media or partners.
              </p>
              <p className="text-white/80 leading-relaxed">
                The filmmaker assumes full responsibility for any copyright claims or legal disputes arising from the submitted work.
              </p>
            </div>
          </div>
        </section>

        {/* SUBMISSION PROCESS SUMMARY & FINAL CTA */}
        <section className="bg-gradient-to-r from-primary-dark via-primary-light to-primary-dark border border-secondary/30 p-10 rounded-sm text-center space-y-8 relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-mono text-secondary tracking-widest uppercase">Page 08 — Ready to Submit?</span>
            <h2 className="font-serif text-3xl md:text-5xl text-white">Complete Your Registration</h2>
            <p className="text-xs md:text-sm text-accent-muted font-light leading-relaxed">
              Ensure you have your film file (MP4), project details, crew credits, and valid Student ID (if applying under Student Category) ready before beginning.
            </p>
          </div>

          {/* Submission Checklist */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-[11px] font-mono uppercase tracking-wider text-center max-w-4xl mx-auto">
            <div className="p-3 bg-black/60 border border-white/10 rounded-sm text-secondary">1. Category Selection</div>
            <div className="p-3 bg-black/60 border border-white/10 rounded-sm text-secondary">2. Contact Info</div>
            <div className="p-3 bg-black/60 border border-white/10 rounded-sm text-secondary">3. Film Details</div>
            <div className="p-3 bg-black/60 border border-white/10 rounded-sm text-secondary">4. MP4 Cut Upload</div>
            <div className="p-3 bg-black/60 border border-white/10 rounded-sm text-secondary">5. Payment Fee</div>
            <div className="p-3 bg-black/60 border border-white/10 rounded-sm text-secondary">6. Final Review</div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              onClick={() => openRegistrationWithCategory(true)}
              className="px-8 py-4 bg-secondary text-black font-semibold text-xs tracking-widest uppercase rounded-sm hover:bg-white transition-all cursor-pointer shadow-lg"
            >
              Student Submission (₹499)
            </button>
            <button
              onClick={() => openRegistrationWithCategory(false)}
              className="px-8 py-4 bg-white text-black font-semibold text-xs tracking-widest uppercase rounded-sm hover:bg-secondary transition-all cursor-pointer shadow-lg"
            >
              Professional Submission (₹799)
            </button>
          </div>
        </section>

      </div>

      {/* FOOTER / CONTACT INFORMATION */}
      <footer className="border-t border-white/10 bg-black py-12 px-6 text-center text-xs text-accent-muted space-y-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-left">
            <h4 className="font-serif text-lg text-white">VIORA SHORT FILM FEST 2026</h4>
            <p className="text-[11px] text-accent-muted">Organised by Viora Media • Official Partner: Verus Productions</p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[11px] font-mono">
            <a href="https://www.vioramedia.in/viorasfs" className="hover:text-secondary transition-colors">
              www.vioramedia.in/viorasfs
            </a>
            <span>•</span>
            <a href="mailto:contact@vioramedia.in" className="hover:text-secondary transition-colors">
              contact@vioramedia.in
            </a>
            <span>•</span>
            <a href="https://instagram.com/vioramediahub" className="hover:text-secondary transition-colors">
              Instagram @vioramediahub
            </a>
            <span>•</span>
            <span>+91 80723 53940</span>
          </div>
        </div>
        <p className="text-[10px] text-white/30 pt-4 border-t border-white/5">
          © 2026 VIORA MEDIA. All Rights Reserved. All intellectual property rights remain with respective content owners.
        </p>
      </footer>

      {/* REGISTRATION MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-primary-light border border-white/10 rounded-sm shadow-[0_0_55px_rgba(197,160,89,0.25)] overflow-hidden my-8 animate-fade-in text-white">

            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-black/40">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-serif text-xl text-white tracking-wide">VIORA Short Film Fest 2026</h3>
                </div>
                {!uploading && !submitted && (
                  <p className="text-[10px] text-secondary tracking-widest uppercase font-mono">
                    {paying ? 'CONTACTING PAYMENT GATEWAY...' : `SECTION ${step} OF 4 : ${step === 1 ? 'Submitter Details' : step === 2 ? 'Film Details' : step === 3 ? 'Creative Credits' : 'Upload & Consent'}`}
                  </p>
                )}
              </div>
              <button
                onClick={resetForm}
                disabled={uploading || paying}
                className="text-accent-muted hover:text-white transition-colors duration-200 cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            {/* Stepper Progress Bar */}
            {!uploading && !submitted && (
              <div className="w-full bg-black/40 h-1 flex">
                <div className={`h-full bg-secondary transition-all duration-500`} style={{ width: `${(step / 4) * 100}%` }}></div>
              </div>
            )}

            {/* Content area */}
            <div className="p-6 md:p-8 max-h-[70vh] overflow-y-auto">

              {errorMessage && (
                <div className="mb-5 p-3.5 bg-red-950/40 border border-red-500/20 text-red-200 text-xs rounded-sm flex items-center gap-2">
                  <i className="fa-solid fa-triangle-exclamation text-red-400"></i>
                  <span>{errorMessage}</span>
                </div>
              )}

              {uploading ? (
                /* Uploading Screen */
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-16 h-16 rounded-full border border-secondary/20 flex items-center justify-center bg-secondary/5 relative">
                    <div className="absolute inset-0 border-2 border-transparent border-t-secondary rounded-full animate-spin"></div>
                    <i className="fa-solid fa-film text-secondary text-xl"></i>
                  </div>
                  <div className="space-y-2 w-full max-w-xs mx-auto">
                    <p className="text-sm text-white font-medium">Uploading cinematic files...</p>
                    <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden border border-white/5">
                      <div
                        className="bg-gold-gradient h-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-[10px] text-secondary font-mono tracking-widest">{progress}% COMPLETE</p>
                    <p className="text-[9px] text-accent-muted pt-1 animate-pulse">Kindly wait until the upload finishes. Do not close this tab.</p>
                  </div>
                </div>
              ) : paying ? (
                /* Payment Redirect State */
                <div className="py-16 flex flex-col items-center justify-center text-center space-y-6 bg-black/30 border border-white/5 rounded-md">
                  <div className="w-16 h-16 rounded-full border border-[#1780cb]/20 flex items-center justify-center bg-[#1780cb]/5 relative">
                    <div className="absolute inset-0 border-2 border-transparent border-t-[#1780cb] rounded-full animate-spin"></div>
                    <i className="fa-solid fa-credit-card text-[#1780cb] text-xl animate-pulse"></i>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-white font-medium">Launching Razorpay payment portal...</p>
                    <p className="text-[10px] text-secondary tracking-widest uppercase font-mono">Amount: ₹{feeAmount}.00 INR</p>
                  </div>
                </div>
              ) : submitted ? (
                /* Success Screen */
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="h-16 w-16 rounded-full border border-secondary flex items-center justify-center shadow-[0_0_20px_rgba(197,160,89,0.3)] bg-secondary/5">
                    <i className="fa-solid fa-check text-secondary text-2xl animate-bounce"></i>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-serif text-xl text-white">Film Registered Successfully</h4>
                    <p className="text-xs text-accent-muted font-light leading-relaxed max-w-md mx-auto">
                      Congratulations! Your registration has been finalized. We have received your payment of ₹{feeAmount}.00 via Razorpay and stored your film files securely.
                    </p>
                  </div>
                  <button
                    onClick={resetForm}
                    className="px-8 py-3 bg-secondary text-black font-semibold text-xs tracking-widest uppercase hover:bg-white transition-all duration-300 rounded-sm cursor-pointer"
                  >
                    Close Screen
                  </button>
                </div>
              ) : (
                /* Stepper Forms */
                <div>
                  {step === 1 && (
                    /* Section 1: Submitter Info */
                    <div className="space-y-4 animate-fade-in text-left">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-1.5">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3 text-xs text-white placeholder-white/20 transition-all rounded-sm"
                            placeholder="Participant full name"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-1.5">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3 text-xs text-white placeholder-white/20 transition-all rounded-sm"
                            placeholder="Phone number"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-1.5">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3 text-xs text-white placeholder-white/20 transition-all rounded-sm"
                          placeholder="Email address for notifications"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-1.5">
                            City *
                          </label>
                          <input
                            type="text"
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3 text-xs text-white placeholder-white/20 transition-all rounded-sm"
                            placeholder="City of residence"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-1.5">
                            State
                          </label>
                          <input
                            type="text"
                            value={stateName}
                            onChange={(e) => setStateName(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3 text-xs text-white placeholder-white/20 transition-all rounded-sm"
                            placeholder="State"
                          />
                        </div>
                      </div>

                      {/* College Student Category Toggle */}
                      <div className="p-4 bg-black/40 border border-white/10 rounded-sm space-y-3 mt-2">
                        <div className="flex items-center justify-between">
                          <label htmlFor="isCollegeStudentModal" className="text-xs text-white font-medium cursor-pointer">
                            Submit under Student Category (₹499)
                          </label>
                          <input
                            id="isCollegeStudentModal"
                            type="checkbox"
                            checked={isCollegeStudent}
                            onChange={(e) => setIsCollegeStudent(e.target.checked)}
                            className="h-4 w-4 rounded-sm border-white/10 bg-black text-secondary accent-secondary cursor-pointer"
                          />
                        </div>

                        {isCollegeStudent && (
                          <div className="space-y-3 pt-3 border-t border-white/5 text-xs animate-fade-in">
                            <div>
                              <label className="block text-[10px] text-secondary font-mono uppercase mb-1">
                                Upload Valid Student ID Card *
                              </label>
                              <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    setCollegeIdFile(e.target.files[0]);
                                  }
                                }}
                                className="block w-full text-xs text-accent-muted border border-white/10 p-2 rounded-sm bg-black/60"
                              />
                              {collegeIdFile && (
                                <p className="text-[10px] text-secondary mt-1">Uploaded: {collegeIdFile.name}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    /* Section 2: Film Details */
                    <div className="space-y-4 animate-fade-in text-left">
                      <div>
                        <label className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-1.5">
                          Film Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={filmTitle}
                          onChange={(e) => setFilmTitle(e.target.value)}
                          className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3 text-xs text-white placeholder-white/20 transition-all rounded-sm"
                          placeholder="Official Title of Short Film"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-1.5">
                            Genre *
                          </label>
                          <input
                            type="text"
                            required
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3 text-xs text-white placeholder-white/20 transition-all rounded-sm"
                            placeholder="e.g. Drama, Thriller, Sci-Fi"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-1.5">
                            Running Time (5 to 30 mins) *
                          </label>
                          <input
                            type="number"
                            min="5"
                            max="30"
                            required
                            value={runtime}
                            onChange={(e) => setRuntime(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3 text-xs text-white placeholder-white/20 transition-all rounded-sm"
                            placeholder="Runtime in minutes"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-1.5">
                            Language *
                          </label>
                          <input
                            type="text"
                            required
                            value={lang}
                            onChange={(e) => setLang(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3 text-xs text-white placeholder-white/20 transition-all rounded-sm"
                            placeholder="Film spoken language (Subtitles required for non-Tamil)"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-1.5">
                            One Line Synopsis *
                          </label>
                          <input
                            type="text"
                            required
                            value={logline}
                            onChange={(e) => setLogline(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3 text-xs text-white placeholder-white/20 transition-all rounded-sm"
                            placeholder="A concise summary of your story..."
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    /* Section 3: Cast & Crew Credits */
                    <div className="space-y-4 animate-fade-in max-h-[50vh] overflow-y-auto pr-1 text-left">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-1.5">
                            Director Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={director}
                            onChange={(e) => setDirector(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3 text-xs text-white placeholder-white/20 transition-all rounded-sm"
                            placeholder="Director"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-1.5">
                            Music Composer
                          </label>
                          <input
                            type="text"
                            value={music}
                            onChange={(e) => setMusic(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3 text-xs text-white placeholder-white/20 transition-all rounded-sm"
                            placeholder="Composer"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-1.5">
                            Cinematographer
                          </label>
                          <input
                            type="text"
                            value={cinematographer}
                            onChange={(e) => setCinematographer(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3 text-xs text-white placeholder-white/20 transition-all rounded-sm"
                            placeholder="DoP"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-1.5">
                            Editor
                          </label>
                          <input
                            type="text"
                            value={editor}
                            onChange={(e) => setEditor(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3 text-xs text-white placeholder-white/20 transition-all rounded-sm"
                            placeholder="Editor"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-1.5">
                            Sound Designer
                          </label>
                          <input
                            type="text"
                            value={soundEngineer}
                            onChange={(e) => setSoundEngineer(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3 text-xs text-white placeholder-white/20 transition-all rounded-sm"
                            placeholder="Sound Designer"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-4">
                        <div>
                          <label className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-1.5">
                            Lead Actor (Optional)
                          </label>
                          <input
                            type="text"
                            value={mainActor}
                            onChange={(e) => setMainActor(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3 text-xs text-white placeholder-white/20 transition-all rounded-sm"
                            placeholder="Actor"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-1.5">
                            Lead Actress (Optional)
                          </label>
                          <input
                            type="text"
                            value={mainActress}
                            onChange={(e) => setMainActress(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3 text-xs text-white placeholder-white/20 transition-all rounded-sm"
                            placeholder="Actress"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    /* Section 4: File Upload & Legal Consent */
                    <div className="space-y-5 animate-fade-in text-left">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-1.5">
                            Upload Film Cut (MP4 Format) *
                          </label>
                          <div className="relative group border border-dashed border-white/10 hover:border-secondary/40 transition-colors duration-300 rounded-sm bg-black/40 p-5 flex flex-col items-center justify-center text-center cursor-pointer h-32">
                            <input
                              type="file"
                              accept="video/mp4,video/*"
                              required
                              onChange={handleFileChange}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <i className="fa-solid fa-file-video text-xl text-secondary/60 group-hover:text-secondary mb-2 transition-colors duration-300"></i>
                            {selectedFile ? (
                              <div className="space-y-1">
                                <p className="text-[11px] text-white font-medium max-w-[180px] truncate mx-auto">{selectedFile.name}</p>
                                <p className="text-[9px] text-accent-muted">
                                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <p className="text-[11px] text-white font-medium">Click to select MP4 video</p>
                                <p className="text-[9px] text-accent-muted font-light">High definition quality recommended</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-1.5">
                            Upload Poster (Optional)
                          </label>
                          <div className="relative group border border-dashed border-white/10 hover:border-secondary/40 transition-colors duration-300 rounded-sm bg-black/40 p-5 flex flex-col items-center justify-center text-center cursor-pointer h-32">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePosterChange}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <i className="fa-solid fa-image text-xl text-secondary/60 group-hover:text-secondary mb-2 transition-colors duration-300"></i>
                            {posterFile ? (
                              <div className="space-y-1">
                                <p className="text-[11px] text-white font-medium max-w-[180px] truncate mx-auto">{posterFile.name}</p>
                                <p className="text-[9px] text-accent-muted">
                                  {(posterFile.size / (1024 * 1024)).toFixed(2)} MB
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <p className="text-[11px] text-white font-medium">Click to select poster</p>
                                <p className="text-[9px] text-accent-muted font-light">JPG, PNG, or WEBP</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        <label className="flex items-start gap-3 select-none cursor-pointer">
                          <input
                            type="checkbox"
                            checked={agreeRules}
                            onChange={(e) => setAgreeRules(e.target.checked)}
                            className="mt-0.5 h-4 w-4 rounded-sm border-white/10 bg-black text-secondary focus:ring-0 cursor-pointer accent-secondary"
                          />
                          <span className="text-xs text-accent-muted font-light leading-relaxed hover:text-white transition-colors duration-200">
                            I agree to the official VIORA Short Film Fest 2026 rulebook guidelines, eligibility criteria, and terms of regulation.
                          </span>
                        </label>

                        <label className="flex items-start gap-3 select-none cursor-pointer">
                          <input
                            type="checkbox"
                            checked={allowMediaUse}
                            onChange={(e) => setAllowMediaUse(e.target.checked)}
                            className="mt-0.5 h-4 w-4 rounded-sm border-white/10 bg-black text-secondary focus:ring-0 cursor-pointer accent-secondary"
                          />
                          <span className="text-xs text-accent-muted font-light leading-relaxed hover:text-white transition-colors duration-200">
                            I authorize VIORA Media & Verus Productions to use the submitted movie's posters, cuts, trailers, and promotional imagery for exhibition and festival programming.
                          </span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Modal Navigation Footer */}
                  <div className="pt-6 border-t border-white/5 flex gap-4 mt-6">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex-1 py-3.5 border border-white/10 hover:border-white/25 text-white text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm cursor-pointer text-center"
                      >
                        Back
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="flex-1 py-3.5 border border-white/10 hover:border-white/25 text-white text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm cursor-pointer text-center"
                      >
                        Cancel
                      </button>
                    )}

                    {step < 4 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="flex-1 py-3.5 bg-secondary hover:bg-white text-black font-semibold text-xs tracking-widest uppercase transition-all duration-300 rounded-sm cursor-pointer text-center"
                      >
                        Next Step
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleProceedToPayment}
                        disabled={!agreeRules || !allowMediaUse}
                        className="flex-1 py-3.5 bg-secondary text-black font-semibold text-xs tracking-widest uppercase transition-all duration-300 rounded-sm text-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:text-black cursor-pointer hover:shadow-[0_0_15px_rgba(197,160,89,0.2)]"
                      >
                        Pay ₹{feeAmount} & Submit
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
