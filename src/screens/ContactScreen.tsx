import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function ContactScreen() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: formState.name,
            email: formState.email,
            message: formState.message,
            status: 'pending',
            created_at: new Date().toISOString()
          }
        ]);

      if (insertError) {
        throw insertError;
      }

      setSubmitted(true);
      setFormState({ name: '', email: '', message: '' });
      setTimeout(() => {
        setSubmitted(false);
      }, 4000);
    } catch (err: any) {
      console.error('Error inserting message:', err);
      setError(err.message || 'Transmission failed. Please check your credentials or network and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Programmatically generate 60 jagged, realistic audio waveform bars
  const equalizerBars = Array.from({ length: 60 }, (_, i) => {
    // Math superposition to create realistic multi-peak soundwaves
    const wave1 = Math.sin(i * 0.25) * 80;
    const wave2 = Math.cos(i * 0.1) * 40;
    const noise = Math.sin(i * 1.5) * 30; // Jagged high-frequency details

    const rawHeight = 110 + wave1 + wave2 + noise;
    const height = Math.min(230, Math.max(20, rawHeight));
    const delay = `${(i % 7) * 0.12}s`;
    const duration = `${0.35 + (i % 4) * 0.12}s`;

    return { h: height, d: delay, s: duration };
  });

  return (
    <div className="w-full bg-black min-h-screen pt-12 pb-24">

      {/* Intro */}
      <section className="max-w-7xl mx-auto px-6 py-16 text-center relative overflow-hidden">
        {/* Background Audio Waveform Equalizer */}
        <div className="absolute inset-0 flex items-center justify-center gap-1 md:gap-1.5 opacity-25 pointer-events-none z-0 select-none">
          {equalizerBars.map((bar, idx) => (
            <span
              key={idx}
              className="w-1 bg-secondary rounded-full"
              style={{
                height: `${bar.h}px`,
                animation: `pulse ${bar.s} infinite alternate`,
                animationDelay: bar.d
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <span className="text-xs tracking-[0.3em] text-secondary font-semibold uppercase">Connect</span>
          <h1 className="font-serif text-4xl md:text-7xl text-white tracking-wide mt-4 mb-8">
            Initiate The <span className="text-gold-gradient font-italic font-normal">Dialogue</span>
          </h1>
        </div>
      </section>

      {/* Grid Layout: Form and Info */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-4">

        {/* Form Column - Spans 7 columns on desktop */}
        <div className="lg:col-span-7 bg-primary-light border border-white/5 p-8 md:p-10 rounded-sm relative">
          <h2 className="font-serif text-2xl text-white mb-6 tracking-wide">Briefing Inquiry</h2>

          {submitted ? (
            <div className="h-64 flex flex-col items-center justify-center text-center animate-fade-in">
              <div className="h-14 w-14 rounded-full border border-secondary flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(197,160,89,0.3)]">
                <svg className="h-6 w-6 text-secondary animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-serif text-lg text-white mb-1">Our team will get back to you shortly</h3>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <label htmlFor="name" className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3.5 text-xs text-white placeholder-white/20 transition-all rounded-sm focus:ring-1 focus:ring-secondary/30"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3.5 text-xs text-white placeholder-white/20 transition-all rounded-sm focus:ring-1 focus:ring-secondary/30"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-2">
                  Brief Overview
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder="Tell us about your brand narrative and project timeline..."
                  className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3.5 text-xs text-white placeholder-white/20 transition-all rounded-sm focus:ring-1 focus:ring-secondary/30 resize-none"
                />
              </div>

              {error && (
                <p className="text-red-500 text-xs font-light tracking-wide bg-red-950/25 border border-red-500/25 p-3.5 rounded-sm">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-gold-gradient hover:bg-none hover:bg-secondary text-black font-semibold text-xs tracking-widest uppercase transition-all duration-300 rounded-sm hover:shadow-[0_0_15px_rgba(197,160,89,0.4)] border border-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Transmitting...' : 'Transmit Brief'}
              </button>

            </form>
          )}
        </div>

        {/* Info Column - Spans 5 columns on desktop */}
        <div className="lg:col-span-5 flex flex-col justify-start gap-8">

          <div className="border border-white/5 bg-primary-light p-8 rounded-sm">
            <h3 className="font-serif text-xl text-white mb-6 tracking-wide">Direct Line</h3>
            <div className="space-y-6">

              <div className="flex gap-4">
                <div className="h-8 w-8 rounded-full border border-secondary/30 flex items-center justify-center flex-shrink-0">
                  <svg className="h-4 w-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <span className="block text-[9px] tracking-widest uppercase font-semibold text-secondary">Electronic Inquiries</span>
                  <a
                    href="mailto:contact@vioramedia.in"
                    className="text-xs text-white hover:text-secondary transition-colors duration-300 font-light break-all"
                  >
                    contact@vioramedia.in
                  </a>
                </div>
              </div>

            </div>
          </div>



        </div>

      </section>

    </div>
  );
}
