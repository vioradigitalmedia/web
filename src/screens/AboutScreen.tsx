import { motion } from 'motion/react';
import {
  Newspaper,
  Film,
  GraduationCap,
  Users,
  Trophy,
  Briefcase,
  Clapperboard,
  Calendar,
  Lightbulb,
  Zap,
  Globe,
  Award,
  Heart
} from 'lucide-react';
import { useSeo } from '../hooks/useSeo';

export default function AboutScreen() {
  useSeo({
    title: 'About Viora Media | Empowering Independent Filmmakers',
    description: 'Learn about our mission to democratize filmmaking. Discover how Viora provides masterclasses, original digital media, and opportunities for creators.'
  });

  const vioraMeaning = [
    { letter: 'V', word: 'Vizhi', detail: 'Vision', desc: 'The initial spark of imagination.' },
    { letter: 'I', word: 'Innovation', detail: 'Innovation', desc: 'Pushing boundaries and new perspectives.' },
    { letter: 'O', word: 'Oli', detail: 'Light', desc: 'The fundamental canvas of cinema.' },
    { letter: 'R', word: 'Rhythm', detail: 'Rhythm', desc: 'The emotional pulse of the cut.' },
    { letter: 'A', word: 'Art', detail: 'Art', desc: 'The final integration of craftsmanship.' },
  ];

  const activities = [
    { title: 'Digital Media', icon: <Newspaper className="w-5 h-5 text-secondary" /> },
    { title: 'Short Film Festivals', icon: <Film className="w-5 h-5 text-secondary" /> },
    { title: 'Academy', icon: <GraduationCap className="w-5 h-5 text-secondary" /> },
    { title: 'Community', icon: <Users className="w-5 h-5 text-secondary" /> },
    { title: 'Awards & Recognition', icon: <Trophy className="w-5 h-5 text-secondary" /> },
    { title: 'Opportunities', icon: <Briefcase className="w-5 h-5 text-secondary" /> },
    { title: 'Viora Originals', icon: <Clapperboard className="w-5 h-5 text-secondary" /> },
    { title: 'Live Events', icon: <Calendar className="w-5 h-5 text-secondary" /> }
  ];

  const values = [
    {
      title: 'Creativity',
      desc: 'Every story deserves a chance.',
      icon: <Lightbulb className="w-6 h-6 text-secondary" />
    },
    {
      title: 'Innovation',
      desc: 'We embrace new ideas and new voices.',
      icon: <Zap className="w-6 h-6 text-secondary" />
    },
    {
      title: 'Community',
      desc: 'Great cinema grows through collaboration.',
      icon: <Globe className="w-6 h-6 text-secondary" />
    },
    {
      title: 'Quality',
      desc: 'We value thoughtful storytelling and craftsmanship.',
      icon: <Award className="w-6 h-6 text-secondary" />
    },
    {
      title: 'Inclusivity',
      desc: 'Creators from every background are welcome.',
      icon: <Heart className="w-6 h-6 text-secondary" />
    }
  ];

  return (
    <div className="w-full bg-black min-h-screen pt-12 pb-24 text-white overflow-hidden">

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">

          {/* Left Brand Card */}
          <div className="md:col-span-5 flex justify-center items-center select-none">
            <div className="relative w-64 h-64 flex flex-col items-center justify-center border border-white/10 bg-zinc-950 rounded-sm p-6 shadow-[0_0_30px_rgba(197,160,89,0.1)] text-center">
              <img
                src="/logo.jpg"
                alt="Viora Logo"
                className="h-16 w-16 object-contain rounded-md border border-secondary/40 shadow-[0_0_15px_rgba(197,160,89,0.3)] mb-4"
              />
              <span className="font-serif tracking-[0.2em] text-lg font-semibold text-white mb-1">
                VIORA
              </span>
              <span className="text-secondary tracking-widest text-[9px] uppercase font-light leading-tight">
                Where Every Story Finds Its Stage.
              </span>
            </div>
          </div>

          {/* Right Header Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="md:col-span-7 text-left flex flex-col items-start"
          >

            <h1 className="font-serif text-4xl md:text-6xl text-white tracking-wide mb-4 leading-tight">
              About Viora
            </h1>

            <p className="text-gold-gradient font-serif italic text-lg md:text-xl tracking-wide mb-6">
              "Where Vision Becomes Art."
            </p>

            <p className="text-base text-accent-muted font-light leading-relaxed tracking-wide">
              Viora is a premium cinema ecosystem dedicated to bringing together creators, industry professionals, and audiences under one unified platform. Through digital media, film festivals, workshops, networking, awards, original content, and creative collaborations, we create meaningful opportunities that inspire growth and empower storytellers.
            </p>
          </motion.div>

        </div>
      </section>

      {/* Our Story Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-t border-white/10">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-5xl text-white">Our Story</h2>
        </div>

        <div className="space-y-8 font-light text-accent-muted text-base leading-relaxed">
          <p className="font-serif italic text-white text-lg md:text-xl text-center mb-8">
            Every filmmaker starts with an idea. <br />
            <span className="text-secondary">A single vision. A single frame. A single story waiting to be told.</span>
          </p>

          <p>
            Viora was founded with a clear vision: to create a platform that brings every aspect of cinema together under one ecosystem. Creators seek guidance, professionals seek meaningful collaborations, emerging voices seek recognition, and audiences seek authentic stories. Viora bridges these gaps to create a connected environment where everyone can learn, collaborate, grow, and contribute.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <div className="p-8 border border-white/10 bg-zinc-950 rounded-sm">
              <span className="text-xs tracking-widest text-secondary uppercase font-semibold block mb-2">Today</span>
              <p className="text-sm text-accent-muted font-light leading-relaxed">
                We bring creators together through digital media, film festivals, workshops, industry conversations, networking events, and collaborative opportunities.
              </p>
            </div>
            <div className="p-8 border border-white/10 bg-zinc-950 rounded-sm">
              <span className="text-xs tracking-widest text-secondary uppercase font-semibold block mb-2">Tomorrow</span>
              <p className="text-sm text-accent-muted font-light leading-relaxed">
                Building the world's most connected cinema ecosystem—a platform where creators learn, collaborate, showcase work, and shape the future of storytelling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Viora Means Section */}
      <section className="bg-zinc-950 border-y border-white/10 py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl text-white">What Viora Means</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
            {vioraMeaning.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="border border-white/10 bg-black/60 p-8 rounded-sm text-center flex flex-col items-center justify-center hover:border-secondary/50 transition-all duration-300 group"
              >
                <span className="font-serif text-5xl md:text-6xl text-gold-gradient font-bold mb-4 group-hover:scale-110 transition-transform duration-300">
                  {item.letter}
                </span>
                <span className="text-xs font-semibold text-white tracking-widest uppercase mb-1">
                  {item.word}
                </span>
                {item.detail !== item.word && (
                  <span className="text-[10px] text-secondary tracking-widest uppercase font-light">
                    ({item.detail})
                  </span>
                )}
              </motion.div>
            ))}
          </div>

          <p className="text-center text-sm text-accent-muted font-light tracking-wide max-w-xl mx-auto italic">
            These five ideas represent every stage of storytelling—from imagination to the final frame.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 border border-white/10 bg-black/60 rounded-sm relative">
          <span className="text-xs tracking-widest text-secondary uppercase font-semibold block mb-3">Focus</span>
          <h3 className="font-serif text-2xl md:text-3xl text-white mb-4">Our Mission</h3>
          <p className="text-sm text-accent-muted font-light leading-relaxed">
            To build a thriving cinema ecosystem where creativity meets opportunity. We empower storytellers by connecting creators, industry professionals, and audiences through meaningful experiences, education, recognition, and digital media.
          </p>
        </div>

        <div className="p-8 border border-white/10 bg-black/60 rounded-sm relative">
          <span className="text-xs tracking-widest text-secondary uppercase font-semibold block mb-3">Future</span>
          <h3 className="font-serif text-2xl md:text-3xl text-white mb-4">Our Vision</h3>
          <p className="text-sm text-accent-muted font-light leading-relaxed">
            To create one of the world's most trusted cinema ecosystems, where every storyteller has access to the platform, community, and recognition needed to inspire audiences worldwide.
          </p>
        </div>
      </section>

      {/* Capabilities */}
      <section className="bg-zinc-950 border-y border-white/10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl text-white">What We Do</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {activities.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-5 bg-black border border-white/10 rounded-sm hover:border-secondary/40 transition-all duration-300 group"
              >
                <div className="h-10 w-10 rounded-full border border-secondary/30 flex items-center justify-center flex-shrink-0 bg-secondary/10 group-hover:scale-105 transition-transform duration-300">
                  {item.icon}
                </div>
                <span className="text-sm font-medium text-white tracking-wide">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-5xl text-white">Our Values</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {values.map((item, idx) => (
            <div
              key={idx}
              className="p-8 border border-white/10 bg-zinc-950 hover:border-secondary/40 transition-all duration-300 rounded-sm text-center flex flex-col justify-start group"
            >
              <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h3 className="font-serif text-lg text-white mb-2 pb-2 border-b border-white/10">
                {item.title}
              </h3>
              <p className="text-xs text-accent-muted font-light leading-relaxed pt-2">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Join the Journey */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-secondary/5 rounded-full blur-[90px] pointer-events-none" />

        <h2 className="font-serif text-3xl md:text-5xl text-white tracking-wide mb-6">
          Join the Journey
        </h2>

        <p className="text-sm text-accent-muted leading-relaxed mb-10 max-w-xl mx-auto font-light">
          Be part of a community shaping the future of cinema—where creativity connects and every story matters.
        </p>
        <div className="font-serif text-2xl md:text-3xl text-gold-gradient font-bold tracking-wide">
          Welcome to Viora.
        </div>
      </section>

    </div>
  );
}
