import { Link } from 'react-router-dom';
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
  CheckCircle2,
  ArrowUpRight,
  Music
} from 'lucide-react';
import { useSeo } from '../hooks/useSeo';

export default function HomeScreen() {
  useSeo({
    title: 'Viora Media | Premium Cinema Ecosystem & Film Community',
    description: 'Viora connects filmmakers, audiences, and industry professionals. Watch original productions, discover resources, and showcase your stories today.'
  });

  const whatWeDo = [
    {
      title: 'Digital Media',
      desc: 'Original interviews, industry news, podcasts, reviews, and exclusive film journalism.',
      icon: <Newspaper className="w-5 h-5 text-secondary" />,
      span: 'lg:col-span-2 lg:row-span-1'
    },
    {
      title: 'Short Film Festivals',
      desc: 'Discover exceptional films and emerging talent through curated competition festivals.',
      icon: <Film className="w-5 h-5 text-secondary" />,
      span: 'lg:col-span-1 lg:row-span-1'
    },
    {
      title: 'Academy',
      desc: 'Workshops, masterclasses, and practical training led by active industry experts.',
      icon: <GraduationCap className="w-5 h-5 text-secondary" />,
      span: 'lg:col-span-1 lg:row-span-1'
    },
    {
      title: 'Viora Originals',
      desc: 'Exclusive films, documentaries, in-depth conversations, and flagship productions.',
      icon: <Clapperboard className="w-5 h-5 text-secondary" />,
      span: 'lg:col-span-2 lg:row-span-1'
    },
    {
      title: 'Community',
      desc: 'Network with filmmakers, actors, writers, technicians, and cinema enthusiasts.',
      icon: <Users className="w-5 h-5 text-secondary" />,
      span: 'lg:col-span-1 lg:row-span-1'
    },
    {
      title: 'Awards & Recognition',
      desc: 'Recognizing creative excellence and celebrating visionary voices shaping cinema.',
      icon: <Trophy className="w-5 h-5 text-secondary" />,
      span: 'lg:col-span-1 lg:row-span-1'
    },
    {
      title: 'Opportunities',
      desc: 'Access casting calls, crew roles, internships, collaborations, and career resources.',
      icon: <Briefcase className="w-5 h-5 text-secondary" />,
      span: 'lg:col-span-1 lg:row-span-1'
    },
    {
      title: 'Live Events',
      desc: 'Screenings, networking sessions, conferences, and immersive film industry experiences.',
      icon: <Calendar className="w-5 h-5 text-secondary" />,
      span: 'lg:col-span-1 lg:row-span-1'
    }
  ];

  const whyViora = [
    'Open to storytellers and creators at every career stage',
    'Industry-led workshops, practical labs, and mentorship',
    'Meaningful cross-functional networking and collaboration',
    'Global recognition through curated film festivals',
    'A thriving, independent community built around cinema'
  ];

  const pillars = ['Vizhi', 'Innovation', 'Oli', 'Rhythm', 'Art'];

  return (
    <div className="w-full bg-black min-h-screen text-white overflow-hidden">

      {/* Hero Section */}
      <section className="relative min-h-[92dvh] flex items-center px-6 md:px-16 pt-24 pb-16 border-b border-white/10">
        <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-secondary/10 rounded-full blur-[130px] pointer-events-none animate-pulse-slow" />
        <div className="absolute right-12 bottom-12 w-[350px] h-[350px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none animate-float-slow" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="lg:col-span-7 text-left flex flex-col items-start z-10 order-2 lg:order-1"
          >
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white mb-6 leading-[1.1]">
              Where Every Story <br />
              Finds Its <span className="text-gold-gradient font-italic font-normal pb-2 inline-block">Stage.</span>
            </h1>

            <p className="text-base text-accent-muted max-w-xl font-light tracking-wide leading-relaxed mb-8">
              Viora unites creators, audiences, and industry professionals through digital media, short film festivals, academy programs, awards, and original cinema productions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                to="/vioraalf"
                className="group px-8 py-3.5 bg-secondary text-black hover:bg-white hover:text-black transition-[transform,background-color,color] duration-160 ease-out font-semibold text-xs tracking-widest uppercase rounded-sm text-center inline-flex items-center justify-center gap-2 active:scale-[0.97]"
              >
                <span>Art & Light Photo Fest</span>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                to="/festivals"
                className="group px-8 py-3.5 bg-secondary text-black hover:bg-white hover:text-black transition-[transform,background-color,color] duration-160 ease-out font-semibold text-xs tracking-widest uppercase rounded-sm text-center inline-flex items-center justify-center gap-2 active:scale-[0.97]"
              >
                <span>Film Festival</span>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </motion.div>

          {/* Right Hero Visual Orbit */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
            className="lg:col-span-5 flex justify-center lg:justify-end items-center relative z-10 select-none order-1 lg:order-2 w-full"
          >
            <div className="relative w-[440px] h-[440px] sm:w-[480px] sm:h-[480px] flex items-center justify-center scale-90 sm:scale-100">

              {/* Center V Symbol */}
              <div className="relative z-10 flex flex-col items-center">
                <img
                  src="/file_no_bg.svg"
                  alt="Viora Logo"
                  className="w-48 h-48 sm:w-56 sm:h-56 object-contain mix-blend-screen select-none drop-shadow-[0_0_20px_rgba(197,160,89,0.3)]"
                />
              </div>

              {/* Axis Rings */}
              <div className="absolute w-[220px] h-[220px] rounded-full border border-secondary/20 flex items-center justify-center">
                <div className="absolute" style={{ animation: 'spin-orbit 26s linear infinite' }}>
                  <div className="absolute" style={{ transform: 'translate(-50%, -50%) translateY(-110px)' }}>
                    <div className="h-9 w-9 rounded-full bg-black border border-secondary/40 flex items-center justify-center shadow-[0_0_10px_rgba(197,160,89,0.3)]">
                      <Film className="w-4 h-4 text-secondary" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute w-[300px] h-[300px] rounded-full border border-secondary/20 flex items-center justify-center">
                <div className="absolute" style={{ animation: 'spin-orbit 34s linear infinite', animationDelay: '-12s' }}>
                  <div className="absolute" style={{ transform: 'translate(-50%, -50%) translateY(-150px)' }}>
                    <div className="h-10 w-10 rounded-full bg-black border border-secondary/40 flex items-center justify-center shadow-[0_0_12px_rgba(197,160,89,0.3)]">
                      <Clapperboard className="w-4 h-4 text-secondary" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute w-[380px] h-[380px] rounded-full border border-secondary/20 flex items-center justify-center">
                <div className="absolute" style={{ animation: 'spin-orbit 42s linear infinite', animationDelay: '-24s' }}>
                  <div className="absolute" style={{ transform: 'translate(-50%, -50%) translateY(-190px)' }}>
                    <div className="h-11 w-11 rounded-full bg-black border border-secondary/40 flex items-center justify-center shadow-[0_0_14px_rgba(197,160,89,0.3)]">
                      <Music className="w-4.5 h-4.5 text-secondary" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* Kinetic Brand Marquee */}
      <section className="bg-zinc-950 border-b border-white/10 py-6 overflow-hidden select-none">
        <div className="flex whitespace-nowrap animate-roll-reel items-center">
          {[...Array(4)].map((_, loopIdx) => (
            <div key={loopIdx} className="flex items-center gap-8 shrink-0 px-4">
              {pillars.map((pillar, pIdx) => (
                <div key={pIdx} className="flex items-center gap-8">
                  <span className="text-xs uppercase tracking-[0.3em] font-semibold text-secondary/90">
                    {pillar}
                  </span>
                  <span className="text-white/20 text-xs">•</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Core Philosophy Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-16 py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
        >
          <div className="md:col-span-5 text-left">
            <h2 className="font-serif text-3xl md:text-5xl text-white tracking-wide leading-tight">
              Discover. Create. <br className="hidden md:block" />
              Inspire.
            </h2>
          </div>
          <div className="md:col-span-7 text-left md:pl-10 md:border-l border-white/10">
            <p className="text-base text-accent-muted font-light leading-relaxed tracking-wide">
              Cinema has never been built in isolation. It is shaped by storytellers, dreamers, technicians, and audiences coming together. Viora exists to unite these voices under one platform—where ideas become collaborations, talent finds opportunity, and every contribution moves cinema forward.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Bento Grid Section ("What We Do") */}
      <section className="bg-zinc-950 border-y border-white/10 py-24 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-left mb-14">
            <h2 className="font-serif text-3xl md:text-5xl text-white tracking-wide">What We Do</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whatWeDo.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: idx * 0.04, ease: [0.23, 1, 0.32, 1] }}
                className={`p-8 border border-white/10 bg-black/60 hover:border-secondary/50 transition-[transform,border-color] duration-200 ease-out rounded-sm flex flex-col justify-between group ${item.span}`}
              >
                <div>
                  <div className="h-11 w-11 rounded-full border border-secondary/30 flex items-center justify-center bg-secondary/10 mb-6 group-hover:scale-[1.06] transition-transform duration-200 ease-out">
                    {item.icon}
                  </div>
                  <h3 className="font-serif text-xl text-white mb-3 tracking-wide group-hover:text-secondary transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="text-sm text-accent-muted font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>      {/* Platform Edge Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-16 py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        >
          <div className="lg:col-span-6 text-left">
            <h2 className="font-serif text-3xl md:text-5xl text-white tracking-wide leading-tight">
              Built for the Next Generation of Storytellers
            </h2>
            <p className="text-sm text-accent-muted font-light leading-relaxed mt-6 max-w-md">
              We design opportunities that remove traditional gatekeepers, bringing emerging directors and crew directly into the spotlight.
            </p>
            <div className="mt-8">
              <Link
                to="/aboutus"
                className="px-8 py-3.5 bg-secondary text-black hover:bg-white transition-[transform,background-color,color] duration-160 ease-out font-semibold text-xs tracking-widest uppercase rounded-sm inline-block active:scale-[0.97]"
              >
                About Us
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 text-left lg:pl-10">
            <ul className="space-y-5">
              {whyViora.map((item, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.05, ease: [0.23, 1, 0.32, 1] }}
                  className="flex items-start gap-4 group"
                >
                  <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200 ease-out" />
                  <span className="text-sm text-accent-muted group-hover:text-white transition-colors duration-200 font-light leading-relaxed">
                    {item}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </section>

      {/* Upcoming Festival Event Callout */}
      <section id="upcoming-festival" className="bg-zinc-950 border-y border-white/10 py-24 px-6 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        >
          <div className="lg:col-span-6 text-left">
            <h2 className="font-serif text-3xl md:text-5xl text-white mb-6">Upcoming Festival</h2>
            <p className="text-base text-accent-muted font-light leading-relaxed max-w-md">
              Submit your screenplays and short films to a jury of active filmmakers. Network with potential collaborators and exhibit your voice on the big screen.
            </p>
          </div>

          <div className="lg:col-span-6 flex justify-end">
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="w-full max-w-lg border border-secondary/40 bg-black p-8 rounded-sm text-left shadow-[0_0_30px_rgba(197,160,89,0.1)] hover:border-secondary/70 transition-colors duration-200 relative"
            >
              <div className="inline-block px-3 py-1 bg-secondary text-black font-bold text-[9px] tracking-widest uppercase rounded-sm mb-4">
                Submissions Open
              </div>

              <h3 className="font-serif text-2xl text-white mb-3">Viora Short Film Festival 2026</h3>
              <p className="text-sm text-accent-muted font-light leading-relaxed mb-8">
                Showcase your film, compete for recognition, and connect with producers and distributor representatives.
              </p>

              <Link
                to="/viorasfs"
                className="w-full py-4 bg-secondary text-black hover:bg-white transition-[transform,background-color,color] duration-160 ease-out font-semibold text-xs tracking-widest uppercase rounded-sm text-center inline-block active:scale-[0.97]"
              >
                Submit Your Entry
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Vision Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-16 py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="grid grid-cols-1 md:grid-cols-12 gap-12"
        >
          <div className="md:col-span-4 text-left">
            <h2 className="font-serif text-3xl md:text-5xl text-white tracking-wide">Our Vision</h2>
          </div>

          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="p-8 border border-white/10 bg-zinc-950 rounded-sm hover:border-secondary/40 transition-colors duration-200"
            >
              <span className="text-xs tracking-widest text-secondary font-semibold uppercase block mb-3">Today</span>
              <p className="text-sm text-accent-muted font-light leading-relaxed">
                Connecting creators through digital media, curated festivals, hands-on workshops, industry dialogues, and collaborative networking.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="p-8 border border-white/10 bg-zinc-950 rounded-sm hover:border-secondary/40 transition-colors duration-200"
            >
              <span className="text-xs tracking-widest text-secondary font-semibold uppercase block mb-3">Tomorrow</span>
              <p className="text-sm text-accent-muted font-light leading-relaxed">
                Building a global cinema ecosystem where independent filmmakers learn, collaborate, gain funding, showcase projects, and define the future of cinema.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
