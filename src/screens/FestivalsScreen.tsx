import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Clapperboard,
  UserCheck,
  Scissors,
  Video,
  Music,
  Volume2,
  Award,
  Users,
  Camera,
  Scroll,
  Trophy,
  ArrowUpRight,
} from 'lucide-react';
import { useSeo } from '../hooks/useSeo';

export default function FestivalsScreen() {
  useSeo({
    title: 'Short Film Festivals 2026 | Submit Your Film to Viora',
    description: 'Compete for digital laurels, handcrafted trophies, and cash prizes. Submit your narrative, documentary, or animation short film to Viora today.'
  });

  const awards = [
    { title: 'Best Director', category: 'Individual Excellence', icon: <Clapperboard className="w-5 h-5 text-secondary" /> },
    { title: 'Best Actor', category: 'Performance Excellence', icon: <UserCheck className="w-5 h-5 text-secondary" /> },
    { title: 'Best Actress', category: 'Performance Excellence', icon: <UserCheck className="w-5 h-5 text-secondary" /> },
    { title: 'Best Editing', category: 'Post-Production Excellence', icon: <Scissors className="w-5 h-5 text-secondary" /> },
    { title: 'Best Cinematography', category: 'Visual Excellence', icon: <Video className="w-5 h-5 text-secondary" /> },
    { title: 'Best Composer', category: 'Auditory Excellence', icon: <Music className="w-5 h-5 text-secondary" /> },
    { title: 'Best Sound Design', category: 'Auditory Excellence', icon: <Volume2 className="w-5 h-5 text-secondary" /> },
    { title: 'Special Jury Award', category: 'Honorary Excellence', icon: <Award className="w-5 h-5 text-secondary" /> },
    { title: 'Audience Choice', category: 'Popular Choice', icon: <Users className="w-5 h-5 text-secondary" /> },
  ];

  const reelFrames = [
    { title: 'Camera', label: 'Frame 01', icon: <Camera className="w-6 h-6 text-secondary" /> },
    { title: 'Script', label: 'Frame 02', icon: <Scroll className="w-6 h-6 text-secondary" /> },
    { title: 'Director', label: 'Frame 03', icon: <Clapperboard className="w-6 h-6 text-secondary" /> },
    { title: 'Actor', label: 'Frame 04', icon: <UserCheck className="w-6 h-6 text-secondary" /> },
    { title: 'Editing', label: 'Frame 05', icon: <Scissors className="w-6 h-6 text-secondary" /> },
    { title: 'Audience', label: 'Frame 06', icon: <Users className="w-6 h-6 text-secondary" /> },
    { title: 'Trophy', label: 'Frame 07', icon: <Trophy className="w-6 h-6 text-secondary" /> },
  ];

  return (
    <div className="w-full bg-black min-h-screen pb-24 text-white overflow-hidden">

      {/* Hero & Featured Card Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 relative overflow-hidden mb-16 border-b border-white/10">
        <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-secondary/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 text-left space-y-6"
          >
            <h1 className="font-serif text-4xl md:text-6xl text-white tracking-wide leading-tight">
              Short Film <span className="text-gold-gradient font-italic font-normal">Festivals</span>
            </h1>

            <p className="text-base text-accent-muted font-light leading-relaxed tracking-wide max-w-xl">
              Discover exceptional films, celebrate emerging talent, and experience cinema through curated festivals. We provide a premium stage for independent filmmakers to share their vision.
            </p>
          </motion.div>

          {/* Right Column: Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-6"
          >
            <div className="border border-white/10 bg-zinc-950 p-8 md:p-10 rounded-sm shadow-[0_0_30px_rgba(197,160,89,0.1)] relative overflow-hidden flex flex-col justify-between">
              <div className="inline-block px-3 py-1 bg-secondary text-black font-bold text-[9px] tracking-widest uppercase rounded-sm mb-4 self-start">
                Submissions Open
              </div>

              <div>
                <h2 className="font-serif text-2xl md:text-3xl text-white tracking-wide mb-4">
                  Viora Short Film Festival 2026
                </h2>
                <p className="text-sm text-accent-muted font-light leading-relaxed mb-8">
                  Showcase your creativity, connect with fellow filmmakers, and compete for recognition.
                </p>
              </div>

              <div className="pt-6 border-t border-white/10">
                <Link
                  to="/viorasfs"
                  className="group px-6 py-3.5 text-xs font-semibold tracking-widest uppercase bg-secondary text-black hover:bg-white transition-all duration-300 rounded-sm inline-flex items-center justify-center gap-2 w-full active:scale-[0.98]"
                >
                  <span>View Event Details</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Film Reel Section */}
      <div className="max-w-7xl mx-auto px-6 text-center mb-8">
        <h2 className="font-serif text-2xl md:text-4xl text-white">The Cinematic Journey</h2>
      </div>

      <section className="w-full py-10 bg-zinc-950 border-y border-white/10 relative mb-24">
        <div className="w-full overflow-hidden relative flex py-4 border-y border-dashed border-white/10 bg-black/60 z-10">
          <div className="flex animate-roll-reel">

            {/* Loop Set 1 */}
            <div className="flex gap-8 px-4 shrink-0">
              {reelFrames.map((frame, idx) => (
                <div key={`reel-1-${idx}`} className="flex flex-col items-center gap-3 w-56 relative">
                  <div className="w-56 h-36 bg-black border border-white/10 rounded-sm p-4 flex flex-col items-center justify-center text-center relative group hover:border-secondary/50 transition-colors duration-300">
                    <div className="mb-2 transition-transform duration-300 group-hover:scale-110">{frame.icon}</div>
                    <span className="block font-serif text-sm text-white font-medium tracking-wide mb-1">{frame.title}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Loop Set 2 */}
            <div className="flex gap-8 px-4 shrink-0">
              {reelFrames.map((frame, idx) => (
                <div key={`reel-2-${idx}`} className="flex flex-col items-center gap-3 w-56 relative">
                  <div className="w-56 h-36 bg-black border border-white/10 rounded-sm p-4 flex flex-col items-center justify-center text-center relative group hover:border-secondary/50 transition-colors duration-300">
                    <div className="mb-2 transition-transform duration-300 group-hover:scale-110">{frame.icon}</div>
                    <span className="block font-serif text-sm text-white font-medium tracking-wide mb-1">{frame.title}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Acquisition Partner */}
      <section className="max-w-7xl mx-auto px-6 py-16 mb-24">
        <div className="text-center">
          <span className="text-xs tracking-widest text-secondary font-semibold uppercase">Acquisition Partner</span>
          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="border border-white/10 bg-zinc-950 rounded-sm p-8 inline-flex items-center justify-center hover:border-secondary/40 transition-all duration-300">
              <img
                src="/verus.jpg"
                alt="Verus Productions"
                className="h-20 md:h-28 w-auto object-contain"
              />
            </div>
            <span className="font-serif text-lg md:text-xl text-white tracking-widest uppercase mt-2">Verus Productions</span>
          </div>
        </div>
      </section>

      {/* Accolades & Laurels */}
      <section className="bg-zinc-950 border-y border-white/10 py-24 px-6 mb-24 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl text-white">Accolades & Laurels</h2>
            <p className="text-sm text-accent-muted font-light tracking-wide max-w-xl mx-auto mt-4">
              Winners receive custom handcrafted trophies, digital laurels, and certification of recognition to highlight their achievement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {awards.map((award, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group border border-white/10 bg-black/60 p-8 rounded-sm text-center flex flex-col items-center justify-center hover:border-secondary/50 transition-all duration-300"
              >
                <div className="mb-3 transition-transform duration-300 group-hover:scale-110">
                  {award.icon}
                </div>
                <span className="text-sm font-semibold text-white tracking-wider uppercase mb-1">
                  {award.title}
                </span>
                <span className="text-[11px] text-accent-muted tracking-widest uppercase font-light">
                  {award.category}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
