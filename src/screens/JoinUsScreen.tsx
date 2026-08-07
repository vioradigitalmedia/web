import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSeo } from '../hooks/useSeo';
import { supabase } from '../supabaseClient';

interface JobRole {
  id: string;
  title: string;
  type: string;
  location: string;
  description: string;
  icon: string;
}

const openRoles: JobRole[] = [
  {
    id: 'male-artist',
    title: 'Male Artist',
    type: 'Full Time',
    location: 'Chennai, India',
    description:
      'We are looking for talented male artists to portray compelling characters in our upcoming short films, festival entries, and digital productions. Prior acting experience in theatre or film is a plus.',
    icon: 'fa-solid fa-user',
  },
  {
    id: 'female-artist',
    title: 'Female Artist',
    type: 'Full Time',
    location: 'Chennai, India',
    description:
      'We are seeking expressive female artists to bring powerful stories to life across our short films, indie features, and digital content. All experience levels are welcome to audition.',
    icon: 'fa-solid fa-user',
  },
  {
    id: 'open-role',
    title: 'Open Role',
    type: 'Flexible',
    location: 'Chennai / Remote',
    description:
      'Have a skill that doesn\'t fit the roles above? We\'re always on the lookout for passionate individuals — directors, writers, cinematographers, editors, and more. Tell us how you\'d like to contribute.',
    icon: 'fa-solid fa-door-open',
  },
];

const perks = [
  {
    icon: 'fa-solid fa-masks-theater',
    title: 'Creative Freedom',
    description: 'Work on projects that blend art and technology in the world of cinema.',
  },
  {
    icon: 'fa-solid fa-rocket',
    title: 'Growth Trajectory',
    description: 'Join a fast-growing media company with mentorship and upskilling opportunities.',
  },
  {
    icon: 'fa-solid fa-users',
    title: 'Small Team, Big Impact',
    description: 'Your contributions are visible and meaningful from day one.',
  },
];

export default function JoinUsScreen() {
  useSeo({
    title: 'Join Us — Careers at Viora Media',
    description:
      'Explore career opportunities at Viora Media. Join our team of passionate storytellers, designers, and technologists shaping the future of independent cinema.',
  });

  const [selectedRole, setSelectedRole] = useState<JobRole | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    portfolio: '',
    coverLetter: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleApply = (role: JobRole) => {
    setSelectedRole(role);
    setIsModalOpen(true);
    setSubmitted(false);
    setSubmitError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const { error } = await supabase.from('job_applications').insert([
        {
          role_id: selectedRole.id,
          role_title: selectedRole.title,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          portfolio: formData.portfolio || null,
          cover_letter: formData.coverLetter,
          status: 'pending',
        },
      ]);

      if (error) throw error;

      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', portfolio: '', coverLetter: '' });
    } catch (err: any) {
      console.error('Error submitting application:', err);
      setSubmitError(err.message || 'Failed to submit your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRole(null);
    setSubmitted(false);
    setSubmitError(null);
  };

  return (
    <div className="w-full bg-black min-h-screen pb-24 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-[-15%] right-[-8%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      {/* ─── Hero Section ─── */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {/* Left — Icon */}
          <div className="flex-shrink-0">
            <div className="inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-full border border-secondary/30 bg-secondary/5">
              <i className="fa-solid fa-briefcase text-4xl md:text-5xl text-secondary" />
            </div>
          </div>

          {/* Right — Content */}
          <div className="text-center md:text-left">
            <span className="text-[10px] tracking-[0.4em] text-secondary font-semibold uppercase block mb-4">
              Careers
            </span>
            <h1 className="font-serif text-4xl md:text-6xl text-white tracking-wide leading-tight mb-6">
              Join <span className="text-gold-gradient font-italic font-normal">Viora</span>
            </h1>
            <p className="text-sm md:text-base text-accent-muted font-light leading-relaxed tracking-wide max-w-2xl">
              We're building the future of independent cinema — one story at a time. If you're
              passionate about film, design, technology, or storytelling, we'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Open Positions ─── */}
      <section className="max-w-6xl mx-auto px-6 pb-24 relative z-10">
        <div className="text-center mb-14">
          <span className="text-[10px] tracking-[0.4em] text-secondary font-semibold uppercase block mb-3">
            Open Roles
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-white tracking-wide">
            Current Openings
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {openRoles.map((role) => (
            <div
              key={role.id}
              className="group border border-white/5 bg-primary-light/50 rounded-sm p-8 hover:border-secondary/30 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(197,160,89,0.12)] transition-all duration-300"
            >
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-full border border-secondary/20 bg-secondary/5 flex items-center justify-center">
                  <i className={`${role.icon} text-secondary text-lg`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-lg text-white tracking-wide mb-1">
                    {role.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="text-[9px] tracking-widest uppercase text-secondary font-semibold bg-secondary/10 px-2 py-0.5 rounded-sm">
                      {role.type}
                    </span>
                    <span className="text-[10px] text-accent-muted font-light flex items-center gap-1.5">
                      <i className="fa-solid fa-location-dot text-secondary/60 text-[8px]" />
                      {role.location}
                    </span>
                  </div>
                  <p className="text-xs text-accent-muted font-light leading-relaxed mb-5">
                    {role.description}
                  </p>
                  <button
                    onClick={() => handleApply(role)}
                    className="text-[10px] tracking-widest uppercase font-semibold text-secondary hover:text-white border border-secondary/30 hover:border-secondary hover:bg-secondary/10 px-5 py-2.5 rounded-sm transition-all duration-300"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Perks & Culture ─── */}
      <section className="max-w-6xl mx-auto px-6 pb-24 relative z-10">
        <div className="text-center mb-14">
          <span className="text-[10px] tracking-[0.4em] text-secondary font-semibold uppercase block mb-3">
            Why Viora
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-white tracking-wide">
            Life at Viora Media
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {perks.map((perk, idx) => (
            <div
              key={idx}
              className="text-center p-8 border border-white/5 bg-primary-light/50 rounded-sm hover:border-secondary/20 transition-all duration-300"
            >
              <i className={`${perk.icon} text-3xl text-secondary mb-6 block`} />
              <h3 className="font-serif text-lg text-white tracking-wide mb-3">{perk.title}</h3>
              <p className="text-xs text-accent-muted font-light leading-relaxed">
                {perk.description}
              </p>
            </div>
          ))}
        </div>
      </section>


      {/* ─── Application Modal ─── */}
      {isModalOpen && selectedRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-primary-light border border-white/5 p-8 md:p-12 rounded-sm shadow-2xl mt-20 mb-20 md:mt-0 md:mb-0">
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <i className="fa-solid fa-xmark text-2xl" />
            </button>

            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 rounded-full border border-secondary/20 bg-secondary/5 flex items-center justify-center flex-shrink-0">
                <i className={`${selectedRole.icon} text-secondary text-sm`} />
              </div>
              <div>
                <h2 className="font-serif text-2xl text-white tracking-wide">
                  {selectedRole.title}
                </h2>
                <span className="text-[10px] tracking-widest uppercase text-secondary font-light">
                  {selectedRole.type} · {selectedRole.location}
                </span>
              </div>
            </div>

            <div className="border-b border-white/5 mb-8 mt-4" />

            {submitted ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 text-secondary mb-6">
                  <i className="fa-solid fa-check text-2xl" />
                </div>
                <h3 className="font-serif text-xl text-white tracking-wide mb-3">
                  Application Received
                </h3>
                <p className="text-sm text-accent-muted font-light">
                  Thank you for your interest in joining Viora Media. Our team will review your
                  application and get back to you shortly.
                </p>
                <button
                  onClick={closeModal}
                  className="mt-8 text-xs tracking-widest uppercase text-secondary hover:text-white transition-colors duration-300"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="apply-name"
                      className="text-[10px] tracking-widest uppercase text-accent-muted font-semibold"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="apply-name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-black border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-secondary/50 transition-colors duration-300 rounded-sm placeholder:text-white/20"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="apply-email"
                      className="text-[10px] tracking-widest uppercase text-accent-muted font-semibold"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="apply-email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-black border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-secondary/50 transition-colors duration-300 rounded-sm placeholder:text-white/20"
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="apply-phone"
                      className="text-[10px] tracking-widest uppercase text-accent-muted font-semibold"
                    >
                      Phone <span className="text-accent-muted/40">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      id="apply-phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-black border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-secondary/50 transition-colors duration-300 rounded-sm placeholder:text-white/20"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="apply-portfolio"
                      className="text-[10px] tracking-widest uppercase text-accent-muted font-semibold"
                    >
                      Portfolio / LinkedIn <span className="text-accent-muted/40">(Optional)</span>
                    </label>
                    <input
                      type="url"
                      id="apply-portfolio"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleChange}
                      className="w-full bg-black border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-secondary/50 transition-colors duration-300 rounded-sm placeholder:text-white/20"
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="apply-cover"
                    className="text-[10px] tracking-widest uppercase text-accent-muted font-semibold"
                  >
                    Why Viora?
                  </label>
                  <textarea
                    id="apply-cover"
                    name="coverLetter"
                    required
                    rows={5}
                    value={formData.coverLetter}
                    onChange={handleChange}
                    className="w-full bg-black border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-secondary/50 transition-colors duration-300 rounded-sm placeholder:text-white/20 resize-y"
                    placeholder="Tell us what excites you about this role and how you'd contribute to Viora Media..."
                  />
                </div>

                {submitError && (
                  <div className="text-red-500 text-xs mt-2 bg-red-950/25 border border-red-500/25 p-3.5 rounded-sm">
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 bg-secondary text-black py-4 text-xs tracking-widest uppercase font-semibold hover:bg-white hover:text-black transition-colors duration-300 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
