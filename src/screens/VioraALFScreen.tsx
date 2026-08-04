import { useState } from 'react';
import { motion } from 'motion/react';
import { Camera, Sparkles, Award, User, Mail, Phone, MapPin, Upload, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';

export default function VioraALFScreen() {
  useSeo({
    title: 'Viora Art & Light Photo Fest 2026 | Visual Storytelling & Photography',
    description: 'Celebrating visual storytelling, photography, and the art of light. Submit your photo entries today.'
  });

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !city.trim()) {
      setErrorMsg('Please fill in all personal details fields.');
      return;
    }
    setErrorMsg(null);
    setStep(2);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
      setErrorMsg(null);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo) {
      setErrorMsg('Please upload a photo to complete your submission.');
      return;
    }
    setErrorMsg(null);
    setIsSubmitting(true);

    // Simulate submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(3);
    }, 1200);
  };

  return (
    <div className="w-full bg-black min-h-screen pb-24 text-white overflow-hidden">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-20 relative overflow-hidden mb-12 border-b border-white/10">
        <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-secondary/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="relative z-10 text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-block px-3 py-1 bg-white/10 text-secondary border border-secondary/30 font-bold text-[10px] tracking-widest uppercase rounded-sm mb-2">
            Art & Light Photo Fest 2026
          </div>

          <h1 className="font-serif text-4xl md:text-6xl text-white tracking-wide leading-tight">
            Art & Light <span className="text-gold-gradient font-italic font-normal">Photo Fest</span>
          </h1>

          <p className="text-base md:text-lg text-accent-muted font-light leading-relaxed tracking-wide">
            Celebrating visual storytelling, photography, and the art of light. Submit your photographic works to participate in the festival.
          </p>
        </div>
      </section>

      {/* Submission Form Section */}
      <section className="max-w-3xl mx-auto px-6 mb-24">
        <div className="border border-white/10 bg-zinc-950 p-8 md:p-12 rounded-sm shadow-[0_0_40px_rgba(197,160,89,0.08)] relative overflow-hidden">
          
          {/* Form Header / Progress */}
          <div className="mb-8 border-b border-white/10 pb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-secondary tracking-widest uppercase font-semibold">
                Submission Portal
              </span>
              <span className="text-xs font-mono text-zinc-400">
                Step {step} of 2
              </span>
            </div>

            {/* Step Indicators */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`h-1.5 rounded-full transition-colors duration-300 ${step >= 1 ? 'bg-secondary' : 'bg-white/10'}`} />
              <div className={`h-1.5 rounded-full transition-colors duration-300 ${step >= 2 ? 'bg-secondary' : 'bg-white/10'}`} />
            </div>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-950/50 border border-red-500/50 text-red-300 text-xs rounded-sm">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <motion.form
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleStep1Next}
              className="space-y-6"
            >
              <div>
                <h2 className="font-serif text-2xl text-white mb-1">Participant Details</h2>
                <p className="text-xs text-accent-muted">Please provide your contact information to get started.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-secondary" /> Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-black border border-white/15 rounded-sm px-4 py-3 text-sm text-white focus:outline-none focus:border-secondary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-secondary" /> Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-black border border-white/15 rounded-sm px-4 py-3 text-sm text-white focus:outline-none focus:border-secondary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-secondary" /> Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-black border border-white/15 rounded-sm px-4 py-3 text-sm text-white focus:outline-none focus:border-secondary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-secondary" /> City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Your current city"
                    className="w-full bg-black border border-white/15 rounded-sm px-4 py-3 text-sm text-white focus:outline-none focus:border-secondary transition-colors"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <button
                  type="submit"
                  className="group w-full py-3.5 bg-secondary text-black font-semibold text-xs uppercase tracking-widest rounded-sm hover:bg-white transition-all flex items-center justify-center gap-2"
                >
                  <span>Next: Upload Photo</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.form>
          )}

          {/* STEP 2: Upload Photo */}
          {step === 2 && (
            <motion.form
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleFormSubmit}
              className="space-y-6"
            >
              <div>
                <h2 className="font-serif text-2xl text-white mb-1">Upload Photo Entry</h2>
                <p className="text-xs text-accent-muted">Select and upload your photo for Art & Light Photo Fest.</p>
              </div>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-white/20 bg-black/60 rounded-sm p-8 text-center flex flex-col items-center justify-center hover:border-secondary/50 transition-colors relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />

                  {photoPreview ? (
                    <div className="space-y-4 flex flex-col items-center">
                      <img
                        src={photoPreview}
                        alt="Photo Preview"
                        className="max-h-56 w-auto object-contain rounded-sm border border-white/20"
                      />
                      <p className="text-xs text-secondary font-mono">{photo?.name}</p>
                      <p className="text-[11px] text-zinc-400">Click or drag to replace image</p>
                    </div>
                  ) : (
                    <div className="space-y-3 flex flex-col items-center">
                      <div className="p-4 bg-secondary/10 rounded-full text-secondary border border-secondary/20">
                        <Upload className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white mb-1">Click to upload or drag & drop</p>
                        <p className="text-xs text-zinc-400">JPG, PNG, WEBP (Max resolution accepted)</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3.5 border border-white/20 text-white font-semibold text-xs uppercase tracking-widest rounded-sm hover:border-white transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 py-3.5 bg-secondary text-black font-semibold text-xs uppercase tracking-widest rounded-sm hover:bg-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <span>Submit Entry</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          )}

          {/* STEP 3: Confirmation / Success */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-8 space-y-6"
            >
              <div className="w-16 h-16 bg-secondary/20 border border-secondary/50 rounded-full text-secondary flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="font-serif text-3xl text-white">Submission Received!</h2>
                <p className="text-sm text-accent-muted max-w-md mx-auto">
                  Thank you, <strong className="text-white">{name}</strong>. Your entry for Art & Light Photo Fest has been successfully submitted.
                </p>
              </div>

              <div className="p-4 bg-black border border-white/10 rounded-sm max-w-md mx-auto text-left text-xs space-y-2 font-mono text-zinc-300">
                <p><span className="text-zinc-500">Name:</span> {name}</p>
                <p><span className="text-zinc-500">Email:</span> {email}</p>
                <p><span className="text-zinc-500">Phone:</span> {phone}</p>
                <p><span className="text-zinc-500">City:</span> {city}</p>
                <p><span className="text-zinc-500">Photo:</span> {photo?.name}</p>
              </div>

              <button
                onClick={() => {
                  setStep(1);
                  setName('');
                  setEmail('');
                  setPhone('');
                  setCity('');
                  setPhoto(null);
                  setPhotoPreview(null);
                }}
                className="px-8 py-3 bg-secondary text-black font-semibold text-xs uppercase tracking-widest rounded-sm hover:bg-white transition-colors"
              >
                Submit Another Photo
              </button>
            </motion.div>
          )}

        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="border border-white/10 bg-zinc-950 p-8 rounded-sm text-center flex flex-col items-center space-y-4 hover:border-secondary/40 transition-colors"
          >
            <div className="p-4 bg-secondary/10 rounded-full border border-secondary/20 text-secondary">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl text-white">Visual Storytelling</h3>
            <p className="text-xs text-accent-muted font-light leading-relaxed">
              Capturing moments, emotions, and narratives through the medium of photography and creative lighting.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="border border-white/10 bg-zinc-950 p-8 rounded-sm text-center flex flex-col items-center space-y-4 hover:border-secondary/40 transition-colors"
          >
            <div className="p-4 bg-secondary/10 rounded-full border border-secondary/20 text-secondary">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl text-white">Exhibitions & Laurels</h3>
            <p className="text-xs text-accent-muted font-light leading-relaxed">
              Featured galleries, digital laurels, and curated exhibitions recognizing outstanding photographic works.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="border border-white/10 bg-zinc-950 p-8 rounded-sm text-center flex flex-col items-center space-y-4 hover:border-secondary/40 transition-colors"
          >
            <div className="p-4 bg-secondary/10 rounded-full border border-secondary/20 text-secondary">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl text-white">Creative Community</h3>
            <p className="text-xs text-accent-muted font-light leading-relaxed">
              Connecting emerging and professional photographers with curators, visual directors, and photography lovers.
            </p>
          </motion.div>

        </div>
      </section>
    </div>
  );
}
