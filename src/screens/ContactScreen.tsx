import React, { useState } from 'react';

export default function ContactScreen() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    projectType: 'campaign',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormState({ name: '', email: '', projectType: 'campaign', message: '' });
    }, 4000);
  };

  return (
    <div className="w-full bg-black min-h-screen pt-12 pb-24">
      
      {/* Intro */}
      <section className="max-w-7xl mx-auto px-6 py-16 text-center">
        <span className="text-xs tracking-[0.3em] text-secondary font-semibold uppercase">Connect</span>
        <h1 className="font-serif text-4xl md:text-7xl text-white tracking-wide mt-4 mb-8">
          Initiate The <span className="text-gold-gradient font-italic font-normal">Dialogue</span>
        </h1>
        <p className="text-sm text-accent-muted max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
          Let’s discuss your project requirements. Complete the concierge briefing form below, or reach out directly to our Mayfair office.
        </p>
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
              <h3 className="font-serif text-lg text-white mb-1">Transmission Received</h3>
              <p className="text-xs text-accent-muted max-w-xs font-light leading-relaxed">
                Thank you. A creative consultant will review your brief and contact you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label htmlFor="name" className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-2">
                  Your Name / Entity
                </label>
                <input 
                  type="text" 
                  id="name"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="e.g. Sterling Developments"
                  className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3.5 text-xs text-white placeholder-white/20 transition-all rounded-sm focus:ring-1 focus:ring-secondary/30"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-2">
                  Secure Email Address
                </label>
                <input 
                  type="email" 
                  id="email"
                  required
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  placeholder="e.g. desk@sterling.com"
                  className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3.5 text-xs text-white placeholder-white/20 transition-all rounded-sm focus:ring-1 focus:ring-secondary/30"
                />
              </div>

              <div>
                <label htmlFor="projectType" className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-2">
                  Nature of Campaign
                </label>
                <select 
                  id="projectType"
                  value={formState.projectType}
                  onChange={(e) => setFormState({ ...formState, projectType: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3.5 text-xs text-white transition-all rounded-sm focus:ring-1 focus:ring-secondary/30 appearance-none cursor-pointer"
                >
                  <option value="campaign">Cinematic Campaign & Editorial</option>
                  <option value="brand">Bespoke Branding & Strategy</option>
                  <option value="cgi">CGI & Digital Assets</option>
                  <option value="consultancy">Creative Advisory Partnership</option>
                </select>
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

              <button 
                type="submit" 
                className="w-full py-4 bg-gold-gradient hover:bg-none hover:bg-secondary text-black font-semibold text-xs tracking-widest uppercase transition-all duration-300 rounded-sm hover:shadow-[0_0_15px_rgba(197,160,89,0.4)] border border-secondary"
              >
                Transmit Brief
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
                    href="mailto:vioradigitalmedia@gmail.com" 
                    className="text-xs text-white hover:text-secondary transition-colors duration-300 font-light break-all"
                  >
                    vioradigitalmedia@gmail.com
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Premium brand statement placeholder */}
          <div className="border border-white/5 bg-primary-light p-8 rounded-sm border-gold-glow flex flex-col gap-4">
            <span className="text-[10px] tracking-[0.25em] text-secondary font-semibold uppercase">Studio Vision</span>
            <p className="text-xs text-accent-muted font-light leading-relaxed">
              "We believe visual narratives are the single most powerful way to define standard-setting brands. We look forward to crafting yours."
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}
