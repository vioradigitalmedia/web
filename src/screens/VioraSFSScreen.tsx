import { useState } from 'react';
import { useSeo } from '../hooks/useSeo';
import { supabase } from '../supabaseClient';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

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
    title: 'Viora Short Film Festival 2026 | Official Page',
    description: 'Welcome to the official page of the Viora Short Film Festival 2026. Submit your projects, view award categories, and explore screening details.'
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);

  // Section 1: Submitter
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
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

  const categories = [
    {
      title: 'Narrative Short',
      description: 'Original fictional stories showcasing narrative depth, character development, and cinematic vision.',
      duration: 'Under 30 mins'
    }
  ];

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
        setErrorMessage('Please upload a scanned copy of your College ID Card.');
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
      if (!posterFile) {
        setErrorMessage('Please upload a movie poster to submit.');
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
      amount: 100, // ₹999 in paise (999 * 100)
      currency: 'INR',
      name: 'Viora Media',
      description: `Short Film Fest 2026 Entry: ${filmTitle}`,
      prefill: {
        name,
        email,
        contact: phone
      },
      notes: {
        city,
        genre,
        director,
        film_title: filmTitle
      },
      theme: {
        color: '#C5A059' // Gold color theme matching Viora branding
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

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);

    try {
      if (!selectedFile) {
        throw new Error('No movie file selected.');
      }

      // 1. Upload Movie File directly to Cloudflare R2
      const movieFileName = `movies/${Date.now()}_${selectedFile.name}`;
      const moviePutCommand = new PutObjectCommand({
        Bucket: 'viorasf',
        Key: movieFileName,
        Body: selectedFile,
        ContentType: selectedFile.type,
      });

      try {
        await r2Client.send(moviePutCommand);
      } catch (uploadErr: any) {
        throw new Error(`Movie upload to R2 failed: ${uploadErr.message}`);
      }

      const movieUrl = movieFileName; // Save S3/R2 storage key path directly

      // 2. Upload College ID Card scanning file directly to Cloudflare R2 if student is selected
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

      // 3. Upload Poster File directly to Cloudflare R2 if available
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
          posterUrl = posterFileName; // Save S3/R2 storage key path directly
        } catch (uploadErr: any) {
          throw new Error(`Poster upload to R2 failed: ${uploadErr.message}`);
        }
      }

      // 4. Insert details into the festival_submissions table
      const { error: insertError } = await supabase
        .from('festival_submissions')
        .insert([
          {
            name,
            phone,
            email,
            city,
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
            amount_paid: 999.00
          }
        ]);

      if (insertError) {
        throw new Error(`Database insert failed: ${insertError.message}`);
      }

      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setUploading(false);
        setSubmitted(true);
      }, 500);

    } catch (err) {
      clearInterval(interval);
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

  return (
    <div className="w-full bg-black min-h-screen pb-24 relative">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 relative overflow-hidden text-center">
        {/* Glow effect */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[140px] animate-pulse-slow" />
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="font-serif text-4xl md:text-7xl text-white tracking-wide leading-tight max-w-4xl mx-auto">
            Viora Short Film <br />
            <span className="text-gold-gradient font-italic font-normal">Festival 2026</span>
          </h1>
          <p className="text-sm md:text-base text-accent-muted font-light leading-relaxed tracking-wide max-w-2xl mx-auto">
            Celebrating the art of visual storytelling. We invite independent directors, scriptwriters, and creators from around the globe to present their finest works on a premium cinematic stage.
          </p>
          <div className="pt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-block px-8 py-3.5 bg-secondary text-black font-semibold text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 rounded-sm cursor-pointer"
            >
              Submit Your Cut
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-5xl text-white tracking-wide">
            Submission <span className="text-gold-gradient font-italic font-normal">Guidelines</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category, idx) => (
            <div
              key={idx}
              className="border border-white/5 bg-primary-light p-8 md:p-10 rounded-sm relative flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-serif text-xl text-white tracking-wide">{category.title}</h3>
                  <span className="text-[10px] tracking-widest uppercase text-secondary bg-secondary/10 px-2.5 py-1 rounded-sm border border-secondary/20">
                    {category.duration}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-accent-muted font-light leading-relaxed mb-6">
                  {category.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Submission CTA Section */}
      <section className="bg-primary-light border-y border-white/5 py-20 px-6 relative text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="font-serif text-3xl md:text-4xl text-white tracking-wide">Bring Your Vision to the Big Screen</h2>
          <p className="text-xs md:text-sm text-accent-muted font-light leading-relaxed">
            Ready to share your masterpiece with the world? Reach out to our programming committee to secure submission details, waiver options, and guidelines.
          </p>
          <div className="pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-block px-8 py-3.5 bg-transparent border border-secondary text-secondary font-semibold text-xs tracking-widest uppercase hover:bg-secondary hover:text-black transition-all duration-300 rounded-sm cursor-pointer"
            >
              Submit Your Cut Now
            </button>
          </div>
        </div>
      </section>

      {/* Modal Overlay / Layover Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          {/* Modal Container */}
          <div className="relative w-full max-w-2xl bg-primary-light border border-white/10 rounded-sm shadow-[0_0_55px_rgba(197,160,89,0.25)] overflow-hidden my-8 animate-fade-in">

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-black/20">
              <div className="space-y-1">
                <h3 className="font-serif text-xl text-white tracking-wide">Viora Short Film Fest 2026</h3>
                {!uploading && !submitted && (
                  <p className="text-[10px] text-secondary tracking-widest uppercase font-mono">
                    {paying ? 'CONTACTING PAYMENT GATEWAY...' : `SECTION ${step} OF 4 : ${step === 1 ? 'Contact Details' : step === 2 ? 'Film Details' : step === 3 ? 'Creative Credits' : 'Upload & Consent'}`}
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
                <div className="mb-5 p-3.5 bg-red-950/40 border border-red-500/20 text-red-200 text-xs rounded-sm">
                  {errorMessage}
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
                  </div>
                </div>
              ) : paying ? (
                /* Payment Redirect / Launch State */
                <div className="py-16 flex flex-col items-center justify-center text-center space-y-6 bg-black/30 border border-white/5 rounded-md">
                  <div className="w-16 h-16 rounded-full border border-[#1780cb]/20 flex items-center justify-center bg-[#1780cb]/5 relative">
                    <div className="absolute inset-0 border-2 border-transparent border-t-[#1780cb] rounded-full animate-spin"></div>
                    <i className="fa-solid fa-credit-card text-[#1780cb] text-xl animate-pulse"></i>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-white font-medium">Launching Razorpay payment portal...</p>
                    <p className="text-[10px] text-[#8692a6] tracking-widest uppercase font-mono">Please authorize payment in the popup window</p>
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
                      Congratulations! Your registration has been finalized. We have received your payment of ₹999.00 via Razorpay and uploaded your movie files. A confirmation package has been recorded in the system.
                    </p>
                  </div>
                  <button
                    onClick={resetForm}
                    className="px-8 py-3 bg-secondary text-black font-semibold text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 rounded-sm cursor-pointer"
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
                      <div>
                        <label className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-1.5">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3.5 text-xs text-white placeholder-white/20 transition-all rounded-sm focus:ring-1 focus:ring-secondary/30"
                          placeholder="Submitter name"
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
                          className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3.5 text-xs text-white placeholder-white/20 transition-all rounded-sm focus:ring-1 focus:ring-secondary/30"
                          placeholder="Phone number"
                        />
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
                          className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3.5 text-xs text-white placeholder-white/20 transition-all rounded-sm focus:ring-1 focus:ring-secondary/30"
                          placeholder="Email address"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-1.5">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3.5 text-xs text-white placeholder-white/20 transition-all rounded-sm focus:ring-1 focus:ring-secondary/30"
                          placeholder="City of residence"
                        />
                      </div>

                      {/* College Student Tickbox */}
                      <div className="flex items-center gap-3 py-1 mt-2">
                        <input
                          id="isCollegeStudent"
                          type="checkbox"
                          checked={isCollegeStudent}
                          onChange={(e) => {
                            setIsCollegeStudent(e.target.checked);
                            if (!e.target.checked) setCollegeIdFile(null); // Reset file if unchecked
                          }}
                          className="h-4 w-4 bg-black/60 border border-white/10 rounded-sm accent-secondary focus:ring-0 focus:outline-none transition-colors"
                        />
                        <label
                          htmlFor="isCollegeStudent"
                          className="text-[11px] tracking-wide text-white/70 hover:text-white cursor-pointer select-none transition-colors"
                        >
                          I am a college student (Eligible for student category)
                        </label>
                      </div>

                      {/* College ID Upload (Conditionally Revealed) */}
                      {isCollegeStudent && (
                        <div className="animate-fade-in space-y-2 mt-2">
                          <label className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-1">
                            Upload College ID Card
                          </label>
                          <div className="relative group border border-dashed border-white/10 hover:border-secondary/40 transition-colors duration-300 rounded-sm bg-black/40 p-5 flex flex-col items-center justify-center text-center cursor-pointer h-28">
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              required
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setCollegeIdFile(e.target.files[0]);
                                }
                              }}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <i className="fa-solid fa-address-card text-lg text-secondary/60 group-hover:text-secondary mb-1.5 transition-colors duration-300"></i>
                            {collegeIdFile ? (
                              <div className="space-y-0.5">
                                <p className="text-[11px] text-white font-medium max-w-[280px] truncate mx-auto">{collegeIdFile.name}</p>
                                <p className="text-[9px] text-accent-muted">
                                  {(collegeIdFile.size / (1024 * 1024)).toFixed(2)} MB
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-0.5">
                                <p className="text-[11px] text-white font-medium">Click to select ID scan</p>
                                <p className="text-[9px] text-accent-muted font-light">JPEG, PNG, or PDF</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
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
                          className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3.5 text-xs text-white placeholder-white/20 transition-all rounded-sm focus:ring-1 focus:ring-secondary/30"
                          placeholder="Name of your project"
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
                            className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3.5 text-xs text-white placeholder-white/20 transition-all rounded-sm focus:ring-1 focus:ring-secondary/30"
                            placeholder="e.g. Sci-Fi, Drama"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-1.5">
                            Runtime (minutes) *
                          </label>
                          <input
                            type="number"
                            min="1"
                            required
                            value={runtime}
                            onChange={(e) => setRuntime(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3.5 text-xs text-white placeholder-white/20 transition-all rounded-sm focus:ring-1 focus:ring-secondary/30"
                            placeholder="Runtime duration"
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
                            className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3.5 text-xs text-white placeholder-white/20 transition-all rounded-sm focus:ring-1 focus:ring-secondary/30"
                            placeholder="e.g. English, Spanish"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-1.5">
                            Oneline *
                          </label>
                          <input
                            type="text"
                            required
                            value={logline}
                            onChange={(e) => setLogline(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3.5 text-xs text-white placeholder-white/20 transition-all rounded-sm focus:ring-1 focus:ring-secondary/30"
                            placeholder="A one-sentence summary of your film..."
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
                            className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3.5 text-xs text-white placeholder-white/20 transition-all rounded-sm focus:ring-1 focus:ring-secondary/30"
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
                            className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3.5 text-xs text-white placeholder-white/20 transition-all rounded-sm focus:ring-1 focus:ring-secondary/30"
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
                            className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3.5 text-xs text-white placeholder-white/20 transition-all rounded-sm focus:ring-1 focus:ring-secondary/30"
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
                            className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3.5 text-xs text-white placeholder-white/20 transition-all rounded-sm focus:ring-1 focus:ring-secondary/30"
                            placeholder="Editor"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-1.5">
                            Sound Engineer
                          </label>
                          <input
                            type="text"
                            value={soundEngineer}
                            onChange={(e) => setSoundEngineer(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3.5 text-xs text-white placeholder-white/20 transition-all rounded-sm focus:ring-1 focus:ring-secondary/30"
                            placeholder="Sound Engineer"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-4">
                        <div>
                          <label className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-1.5">
                            Main Actor
                          </label>
                          <input
                            type="text"
                            value={mainActor}
                            onChange={(e) => setMainActor(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3.5 text-xs text-white placeholder-white/20 transition-all rounded-sm focus:ring-1 focus:ring-secondary/30"
                            placeholder="Lead Actor"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-1.5">
                            Main Actress
                          </label>
                          <input
                            type="text"
                            value={mainActress}
                            onChange={(e) => setMainActress(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3.5 text-xs text-white placeholder-white/20 transition-all rounded-sm focus:ring-1 focus:ring-secondary/30"
                            placeholder="Lead Actress"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    /* Section 4: File Upload & Rules */
                    <div className="space-y-5 animate-fade-in text-left">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-1.5">
                            Upload Movie File
                          </label>
                          <div className="relative group border border-dashed border-white/10 hover:border-secondary/40 transition-colors duration-300 rounded-sm bg-black/40 p-5 flex flex-col items-center justify-center text-center cursor-pointer h-32">
                            <input
                              type="file"
                              accept="video/*"
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
                                <p className="text-[11px] text-white font-medium">Click to select video</p>
                                <p className="text-[9px] text-accent-muted font-light">MP4, MOV, or MKV</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-1.5">
                            Upload Poster
                          </label>
                          <div className="relative group border border-dashed border-white/10 hover:border-secondary/40 transition-colors duration-300 rounded-sm bg-black/40 p-5 flex flex-col items-center justify-center text-center cursor-pointer h-32">
                            <input
                              type="file"
                              accept="image/*"
                              required
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
                            className="mt-0.5 h-4 w-4 rounded-sm border-white/10 bg-black/60 text-secondary focus:ring-0 cursor-pointer accent-secondary"
                          />
                          <span className="text-xs text-accent-muted font-light leading-relaxed hover:text-white transition-colors duration-200">
                            I agree to the official Viora Short Film Festival 2026 rules, guidelines, and terms of regulation.
                          </span>
                        </label>

                        <label className="flex items-start gap-3 select-none cursor-pointer">
                          <input
                            type="checkbox"
                            checked={allowMediaUse}
                            onChange={(e) => setAllowMediaUse(e.target.checked)}
                            className="mt-0.5 h-4 w-4 rounded-sm border-white/10 bg-black/60 text-secondary focus:ring-0 cursor-pointer accent-secondary"
                          />
                          <span className="text-xs text-accent-muted font-light leading-relaxed hover:text-white transition-colors duration-200">
                            I authorize Viora Media to use the submitted movie's posters, cuts, trailers, and promotional imagery for exhibition and event programming.
                          </span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Navigation Footer */}
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
                        Next
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleProceedToPayment}
                        disabled={!agreeRules || !allowMediaUse}
                        className="flex-1 py-3.5 bg-secondary text-black font-semibold text-xs tracking-widest uppercase transition-all duration-300 rounded-sm text-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:text-black cursor-pointer hover:shadow-[0_0_15px_rgba(197,160,89,0.2)]"
                      >
                        Proceed to Payment
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
