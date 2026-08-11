import { useState } from 'react';
import { useSeo } from '../hooks/useSeo';
import { supabase } from '../supabaseClient';

export default function PartnerScreen() {
  useSeo({
    title: 'Partner With Us | Viora Media',
    description: 'Explore partnership opportunities with Viora Media and join us in shaping the future of cinema and digital storytelling.'
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    proposal: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const { error } = await supabase
        .from('partner_proposals')
        .insert([{
          name: formData.name,
          email: formData.email,
          company: formData.company,
          proposal: formData.proposal,
          status: 'pending'
        }]);

      if (error) throw error;

      setSubmitted(true);
      setFormData({ name: '', email: '', company: '', proposal: '' });
    } catch (err: any) {
      console.error('Error submitting proposal:', err);
      setSubmitError(err.message || 'Failed to submit proposal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-black min-h-screen pb-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Our Partners Section */}
      <section className="max-w-6xl mx-auto px-6 pt-32 pb-24 relative z-10">
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.4em] text-secondary font-semibold uppercase block mb-3">Trusted Collaborators</span>
          <h2 className="font-serif text-3xl md:text-4xl text-white tracking-wide">Our Partners</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {/* Verus Productions */}
          <div className="group border border-white/10 bg-primary-light/50 rounded-sm px-10 py-8 hover:border-secondary/30 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(197,160,89,0.12)] transition-all duration-300 cursor-default">
            <div className="flex items-center gap-6">
              <img
                src="/verus.jpg"
                alt="Verus Productions"
                className="h-24 md:h-32 w-auto object-contain"
              />
              <div className="flex flex-col gap-1">
                <span className="font-serif text-xl md:text-2xl text-white tracking-widest uppercase">Verus Productions</span>
                <span className="text-[10px] text-secondary tracking-widest uppercase font-light">Acquisition Partner</span>
                <div className="flex items-center gap-4 mt-3">
                  <a href="https://instagram.com/verusproductionsofficial" target="_blank" rel="noopener noreferrer" className="text-accent-muted hover:text-secondary transition-colors duration-300">
                    <i className="fa-brands fa-instagram text-lg"></i>
                  </a>
                  <a href="https://twitter.com/verusproduction" target="_blank" rel="noopener noreferrer" className="text-accent-muted hover:text-secondary transition-colors duration-300">
                    <i className="fa-brands fa-x-twitter text-lg"></i>
                  </a>
                  <a href="https://verusproductions.com" target="_blank" rel="noopener noreferrer" className="text-accent-muted hover:text-secondary transition-colors duration-300">
                    <i className="fa-solid fa-arrow-up-right-from-square text-lg"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Dark Colours Academy */}
          <div className="group border border-white/10 bg-primary-light/50 rounded-sm px-10 py-8 hover:border-secondary/30 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(197,160,89,0.12)] transition-all duration-300 cursor-default">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-primary-light/30 border border-white/5 flex items-center justify-center rounded-sm">
                <i className="fa-solid fa-handshake text-2xl text-secondary/20"></i>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-serif text-xl md:text-2xl text-white tracking-widest uppercase">Dark Colours Academy</span>
                <span className="text-[10px] text-secondary tracking-widest uppercase font-light">Creative Partner</span>
                <div className="flex items-center gap-4 mt-3">
                  <a href="#" className="text-accent-muted hover:text-secondary transition-colors duration-300">
                    <i className="fa-brands fa-instagram text-lg"></i>
                  </a>
                  <a href="#" className="text-accent-muted hover:text-secondary transition-colors duration-300">
                    <i className="fa-brands fa-x-twitter text-lg"></i>
                  </a>
                  <a href="#" className="text-accent-muted hover:text-secondary transition-colors duration-300">
                    <i className="fa-solid fa-arrow-up-right-from-square text-lg"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bridge Academy */}
          <div className="group border border-white/10 bg-primary-light/50 rounded-sm px-10 py-8 hover:border-secondary/30 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(197,160,89,0.12)] transition-all duration-300 cursor-default">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-primary-light/30 border border-white/5 flex items-center justify-center rounded-sm">
                <i className="fa-solid fa-handshake text-2xl text-secondary/20"></i>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-serif text-xl md:text-2xl text-white tracking-widest uppercase">Bridge Academy</span>
                <span className="text-[10px] text-secondary tracking-widest uppercase font-light">Creative Partner</span>
                <div className="flex items-center gap-4 mt-3">
                  <a href="#" className="text-accent-muted hover:text-secondary transition-colors duration-300">
                    <i className="fa-brands fa-instagram text-lg"></i>
                  </a>
                  <a href="#" className="text-accent-muted hover:text-secondary transition-colors duration-300">
                    <i className="fa-brands fa-x-twitter text-lg"></i>
                  </a>
                  <a href="https://www.bridgeacademy.in/film-studies/" className="text-accent-muted hover:text-secondary transition-colors duration-300">
                    <i className="fa-solid fa-arrow-up-right-from-square text-lg"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 pb-16 relative z-10 text-center">
        <div className="mb-8 flex justify-center">
          <i className="fa-solid fa-handshake text-5xl md:text-7xl text-secondary/80"></i>
        </div>
        <span className="text-[10px] tracking-[0.4em] text-secondary font-semibold uppercase block mb-6">
          Collaborate
        </span>
        <h1 className="font-serif text-4xl md:text-6xl text-white tracking-wide leading-tight mb-6">
          Partner With <span className="text-gold-gradient font-italic font-normal">Viora</span>
        </h1>
        <p className="text-sm md:text-base text-accent-muted font-light leading-relaxed tracking-wide max-w-2xl mx-auto">
          We believe in the power of synergy. Whether you are a brand, a production house, or a creative agency, partner with us to shape the future of visual storytelling and reach engaged, passionate audiences globally.
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-10 inline-block bg-secondary text-black px-10 py-4 text-xs tracking-widest uppercase font-semibold hover:bg-white hover:text-black transition-colors duration-300 rounded-sm"
        >
          Become a Partner
        </button>
      </section>

      {/* Form Overlay Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-primary-light border border-white/5 p-8 md:p-12 rounded-sm shadow-2xl mt-20 mb-20 md:mt-0 md:mb-0">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
            >
              <i className="fa-solid fa-xmark text-2xl"></i>
            </button>
            <h2 className="font-serif text-2xl text-white tracking-wide mb-8 border-b border-white/5 pb-4">
              Partnership Proposal
            </h2>

            {submitted ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 text-secondary mb-6">
                  <i className="fa-solid fa-check text-2xl"></i>
                </div>
                <h3 className="font-serif text-xl text-white tracking-wide mb-3">Proposal Received</h3>
                <p className="text-sm text-accent-muted font-light">
                  Thank you for your interest in partnering with Viora Media. Our team will review your proposal and get back to you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-xs tracking-widest uppercase text-secondary hover:text-white transition-colors duration-300"
                >
                  Submit another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-[10px] tracking-widest uppercase text-accent-muted font-semibold">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-black border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-secondary/50 transition-colors duration-300 rounded-sm placeholder:text-white/20"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-[10px] tracking-widest uppercase text-accent-muted font-semibold">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-black border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-secondary/50 transition-colors duration-300 rounded-sm placeholder:text-white/20"
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="company" className="text-[10px] tracking-widest uppercase text-accent-muted font-semibold">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full bg-black border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-secondary/50 transition-colors duration-300 rounded-sm placeholder:text-white/20"
                    placeholder="Your Company Name"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="proposal" className="text-[10px] tracking-widest uppercase text-accent-muted font-semibold">
                    Partnership Proposal
                  </label>
                  <textarea
                    id="proposal"
                    name="proposal"
                    required
                    rows={5}
                    value={formData.proposal}
                    onChange={handleChange}
                    className="w-full bg-black border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-secondary/50 transition-colors duration-300 rounded-sm placeholder:text-white/20 resize-y"
                    placeholder="Tell us about how we can work together..."
                  ></textarea>
                </div>

                {submitError && (
                  <div className="text-red-500 text-xs mt-2">{submitError}</div>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 bg-secondary text-black py-4 text-xs tracking-widest uppercase font-semibold hover:bg-white hover:text-black transition-colors duration-300 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Benefits Section */}
      <section className="max-w-6xl mx-auto px-6 py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 border border-white/5 bg-primary-light/50 rounded-sm hover:border-secondary/20 transition-all duration-300">
            <i className="fa-solid fa-users-viewfinder text-3xl text-secondary mb-6"></i>
            <h3 className="font-serif text-lg text-white tracking-wide mb-3">Wide Reach</h3>
            <p className="text-xs text-accent-muted font-light leading-relaxed">
              Access a diverse and rapidly growing audience of cinema lovers, creators, and industry professionals.
            </p>
          </div>
          <div className="text-center p-8 border border-white/5 bg-primary-light/50 rounded-sm hover:border-secondary/20 transition-all duration-300">
            <i className="fa-solid fa-star text-3xl text-secondary mb-6"></i>
            <h3 className="font-serif text-lg text-white tracking-wide mb-3">Premium Association</h3>
            <p className="text-xs text-accent-muted font-light leading-relaxed">
              Align your brand with high-quality cinematic storytelling, prestigious festivals, and artistic integrity.
            </p>
          </div>
          <div className="text-center p-8 border border-white/5 bg-primary-light/50 rounded-sm hover:border-secondary/20 transition-all duration-300">
            <i className="fa-solid fa-handshake-angle text-3xl text-secondary mb-6"></i>
            <h3 className="font-serif text-lg text-white tracking-wide mb-3">Custom Activations</h3>
            <p className="text-xs text-accent-muted font-light leading-relaxed">
              Collaborate on bespoke integrations, from digital campaigns to exclusive physical event sponsorships.
            </p>
          </div>
        </div>
      </section>

    </div>

  );
}
