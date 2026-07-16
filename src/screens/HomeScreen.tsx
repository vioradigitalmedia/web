import { Link } from 'react-router-dom';

export default function HomeScreen() {
  const whatWeDo = [
    {
      title: 'Digital Media',
      desc: 'Stay informed through original interviews, industry news, podcasts, reviews, and exclusive storytelling.',
      icon: <i className="fa-solid fa-newspaper text-secondary text-2xl"></i>
    },
    {
      title: 'Short Film Festivals',
      desc: 'Discover exceptional films, celebrate emerging talent, and experience cinema through curated festivals.',
      icon: <i className="fa-solid fa-film text-secondary text-2xl"></i>
    },
    {
      title: 'Academy',
      desc: 'Learn from filmmakers and industry experts through workshops, masterclasses, and practical training.',
      icon: <i className="fa-solid fa-graduation-cap text-secondary text-2xl"></i>
    },
    {
      title: 'Community',
      desc: 'Join a thriving network of filmmakers, actors, writers, technicians, students, and cinema enthusiasts.',
      icon: <i className="fa-solid fa-users text-secondary text-2xl"></i>
    },
    {
      title: 'Awards & Recognition',
      desc: 'Recognize creative excellence and celebrate the people shaping the future of cinema.',
      icon: <i className="fa-solid fa-trophy text-secondary text-2xl"></i>
    },
    {
      title: 'Opportunities',
      desc: 'Access casting calls, crew opportunities, internships, collaborations, competitions, and career resources.',
      icon: <i className="fa-solid fa-briefcase text-secondary text-2xl"></i>
    },
    {
      title: 'Viora Originals',
      desc: 'Watch exclusive films, documentaries, conversations, and premium Viora productions.',
      icon: <i className="fa-solid fa-clapperboard text-secondary text-2xl"></i>
    },
    {
      title: 'Events',
      desc: 'Experience meetups, screenings, networking sessions, conferences, and live industry experiences.',
      icon: <i className="fa-solid fa-calendar-days text-secondary text-2xl"></i>
    }
  ];

  const whyViora = [
    'Open to creators at every stage',
    'Industry-led workshops and mentorship',
    'Meaningful networking and collaboration',
    'Recognition through festivals and awards',
    'A thriving community built around cinema'
  ];

  return (
    <div className="w-full bg-black min-h-screen">

      {/* Hero Section - Left aligned content / Right graphic */}
      <section className="relative min-h-[90vh] flex items-center px-6 md:px-16 pt-24 pb-20 overflow-hidden">
        {/* Background glowing effects with slow pulsing and floating animations */}
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[110px] pointer-events-none animate-pulse-slow" />
        <div className="absolute right-10 bottom-10 w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[90px] pointer-events-none animate-float-slow" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Text Column */}
          <div className="lg:col-span-7 text-left flex flex-col items-start z-10 order-2 lg:order-1 mt-8 lg:mt-0">

            <h1 className="font-serif text-4xl md:text-7xl tracking-tight text-white mb-6 leading-tight">
              Where Every Story <br />
              Finds Its <span className="text-gold-gradient font-italic font-normal">Stage.</span>
            </h1>

            <p className="text-sm md:text-base text-accent-muted max-w-xl font-light tracking-wide leading-relaxed mb-10">
              Viora is a premium cinema ecosystem that brings together creators, audiences, industry professionals, and aspiring talent through media, festivals, education, networking, awards, and original storytelling. We exist to connect every corner of cinema under one vision.            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button
                disabled
                className="px-8 py-3.5 bg-transparent border border-secondary/20 text-secondary/40 font-semibold text-xs tracking-widest uppercase rounded-sm cursor-not-allowed text-center"
              >
                Submit Film (Coming Soon)
              </button>
              <Link
                to="/aboutus"
                className="px-8 py-3.5 border border-white/20 text-white hover:text-secondary hover:border-secondary transition-all duration-300 text-xs tracking-widest uppercase rounded-sm text-center inline-block"
              >
                About Us
              </Link>
            </div>
          </div>

          {/* Right Graphic Column - Revolving Cinematic Elements around V */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end items-center relative z-10 select-none order-1 lg:order-2 w-full">
            <div className="relative w-[500px] h-[500px] flex items-center justify-center scale-[0.65] sm:scale-[0.85] lg:scale-100 origin-center my-[-90px] sm:my-[-30px] lg:my-0">

              {/* Center V Symbol */}
              <div className="relative z-10 flex flex-col items-center">
                <span className="font-serif font-bold text-[180px] text-gold-gradient leading-none select-none">
                  V
                </span>
                <span className="text-[12px] tracking-[0.45em] text-secondary font-semibold uppercase -mt-4">
                  Viora
                </span>
              </div>


              {/* Axis 2 (Innermost - Radius 110px / Diameter 220px) */}
              <div className="absolute w-[220px] h-[220px] rounded-full border border-secondary/20 flex items-center justify-center">
                {/* Film Reel Icon */}
                <div className="absolute" style={{ animation: 'spin-orbit 26s linear infinite', animationDelay: '-6.5s' }}>
                  <div className="absolute" style={{ transform: 'translate(-50%, -50%) translateY(-110px)' }}>
                    <div className="h-9 w-9 rounded-full bg-black border border-secondary/40 flex items-center justify-center shadow-[0_0_8px_rgba(197,160,89,0.2)]" style={{ animation: 'spin-reverse 26s linear infinite', animationDelay: '-6.5s' }}>
                      <i className="fa-solid fa-film text-secondary text-xs"></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* Axis 3 (Inner-Mid - Radius 150px / Diameter 300px) */}
              <div className="absolute w-[300px] h-[300px] rounded-full border border-secondary/20 flex items-center justify-center">
                {/* Clapboard Icon */}
                <div className="absolute" style={{ animation: 'spin-orbit 34s linear infinite', animationDelay: '-17s' }}>
                  <div className="absolute" style={{ transform: 'translate(-50%, -50%) translateY(-150px)' }}>
                    <div className="h-10 w-10 rounded-full bg-black border border-secondary/40 flex items-center justify-center shadow-[0_0_10px_rgba(197,160,89,0.25)]" style={{ animation: 'spin-reverse 34s linear infinite', animationDelay: '-17s' }}>
                      <i className="fa-solid fa-clapperboard text-secondary text-sm"></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* Axis 4 (Outer-Mid - Radius 190px / Diameter 380px) */}
              <div className="absolute w-[380px] h-[380px] rounded-full border border-secondary/20 flex items-center justify-center">
                {/* Camera Icon */}
                <div className="absolute" style={{ animation: 'spin-orbit 42s linear infinite', animationDelay: '-31.5s' }}>
                  <div className="absolute" style={{ transform: 'translate(-50%, -50%) translateY(-190px)' }}>
                    <div className="h-11 w-11 rounded-full bg-black border border-secondary/40 flex items-center justify-center shadow-[0_0_10px_rgba(197,160,89,0.25)]" style={{ animation: 'spin-reverse 42s linear infinite', animationDelay: '-31.5s' }}>
                      <i className="fa-solid fa-video text-secondary text-sm"></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* Axis 5 (Outermost - Radius 230px / Diameter 460px with Music Icon) */}
              <div className="absolute w-[460px] h-[460px] rounded-full border border-secondary/20 flex items-center justify-center">
                
                {/* Music Note Icon */}
                <div className="absolute" style={{ animation: 'spin-orbit 50s linear infinite' }}>
                  <div className="absolute" style={{ transform: 'translate(-50%, -50%) translateY(-230px)' }}>
                    <div className="h-12 w-12 rounded-full bg-black border border-secondary/40 flex items-center justify-center shadow-[0_0_12px_rgba(197,160,89,0.3)]" style={{ animation: 'spin-reverse 50s linear infinite' }}>
                      <i className="fa-solid fa-music text-secondary text-base"></i>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Signature Branding Pillars Strip */}
      <section className="bg-primary-light border-y border-white/5 py-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-8 items-center text-xs tracking-[0.3em] font-semibold text-secondary uppercase">
            <span>Vision</span>
            <span className="text-white/20">•</span>
            <span>Innovation</span>
            <span className="text-white/20">•</span>
            <span>Light</span>
            <span className="text-white/20">•</span>
            <span>Rhythm</span>
            <span className="text-white/20">•</span>
            <span>Art</span>
          </div>
          <p className="text-[10px] tracking-widest text-accent-muted/80 uppercase font-light text-center md:text-right">
            The five pillars that shape every story.
          </p>
        </div>
      </section>

      {/* Featured Section - Left Header / Right Text */}
      <section className="max-w-7xl mx-auto px-6 md:px-16 py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5 text-left">
            <span className="text-xs tracking-[0.25em] text-secondary uppercase font-semibold">Core Philosophy</span>
            <h2 className="font-serif text-3xl md:text-5xl text-white tracking-wide mt-2">Discover. Create. Inspire.</h2>
          </div>
          <div className="md:col-span-7 text-left md:pl-8 border-l-0 md:border-l border-secondary/20 pl-0 md:pl-8 mt-4 md:mt-0">
            <p className="text-sm md:text-base text-accent-muted font-light leading-relaxed tracking-wide">
              Cinema has never been built by one person. It is shaped by storytellers, dreamers, technicians, artists, innovators, and audiences who come together to create something greater than themselves. Viora exists to unite these voices under one platform—where ideas become collaborations, talent finds opportunity, and every contribution moves cinema forward.            </p>
          </div>
        </div>
      </section>

      {/* What We Do Section - Alternating Left/Right Grid Items */}
      <section className="bg-primary-light border-y border-white/5 py-24 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-left mb-16">
            <span className="text-xs tracking-[0.25em] text-secondary uppercase font-semibold">Capabilities</span>
            <h2 className="font-serif text-3xl md:text-5xl text-white tracking-wide mt-2">What We Do</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl">
            {whatWeDo.map((item, idx) => (
              <div
                key={idx}
                className={`p-8 border border-white/5 bg-black hover:border-secondary/30 transition-all duration-300 rounded-sm flex items-start gap-5 border-gold-glow ${idx % 2 === 0 ? 'text-left lg:translate-y-0' : 'text-left lg:translate-y-4'
                  }`}
              >
                <div className="h-12 w-12 rounded-full border border-secondary/20 flex items-center justify-center bg-secondary/5 flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-serif text-lg text-white mb-2 tracking-wide">{item.title}</h3>
                  <p className="text-xs text-accent-muted font-light leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Viora Section - Left Text / Right Checkbox List */}
      <section className="max-w-7xl mx-auto px-6 md:px-16 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Text */}
          <div className="lg:col-span-6 text-left">
            <span className="text-xs tracking-[0.25em] text-secondary uppercase font-semibold">Platform Edge</span>
            <h2 className="font-serif text-3xl md:text-5xl text-white tracking-wide mt-2 leading-tight">
              Built for the Next Generation of Storytellers
            </h2>
            <p className="text-xs text-accent-muted font-light leading-relaxed mt-6 max-w-md">
              We design opportunities that remove gatekeepers, bringing emerging directors directly to the center stage.
            </p>
          </div>

          {/* Right Checklist */}
          <div className="lg:col-span-6 text-left lg:pl-12">
            <ul className="space-y-4">
              {whyViora.map((item, idx) => (
                <li key={idx} className="flex items-center gap-4 group">
                  <i className="fa-solid fa-circle-check text-secondary text-base group-hover:scale-110 transition-transform duration-200"></i>
                  <span className="text-xs md:text-sm text-accent-muted group-hover:text-white transition-colors duration-200 font-light">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* Upcoming Festival Section - Asymmetric Right Box */}
      <section id="upcoming-festival" className="bg-primary-light border-y border-white/5 py-24 px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Description */}
          <div className="lg:col-span-6 text-left">
            <span className="text-xs tracking-[0.25em] text-secondary uppercase font-semibold">Seasonal Event</span>
            <h2 className="font-serif text-3xl md:text-5xl text-white mt-2 mb-6">Upcoming Festival</h2>
            <p className="text-sm text-accent-muted font-light leading-relaxed max-w-md">
              Submit and exhibit your screenplays or short features to a jury of active filmmakers. Meet collaborators and make your voice heard.
            </p>
          </div>

          {/* Right Showcase Box */}
          <div className="lg:col-span-6 flex justify-end">
            <div className="w-full max-w-lg border border-secondary/30 bg-black p-8 rounded-sm text-left border-gold-glow flex flex-col gap-6 relative">
              <span className="absolute -top-3 -right-3 px-4 py-1.5 bg-zinc-900 border border-secondary/35 text-secondary font-semibold text-[8px] tracking-widest uppercase rounded-sm">
                Coming Soon
              </span>

              <div>
                <h3 className="font-serif text-xl md:text-2xl text-white">Viora Short Film Festival 2026</h3>
                <p className="text-xs text-accent-muted font-light leading-relaxed mt-3">
                  Showcase your creativity, connect with fellow filmmakers, and compete for recognition.
                </p>
              </div>

              <button
                disabled
                className="w-full py-3.5 bg-transparent border border-secondary/20 text-secondary/40 font-semibold text-xs tracking-widest uppercase rounded-sm cursor-not-allowed text-center"
              >
                Coming Soon
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Our Vision Section - Alternating Left/Right layout boxes */}
      <section className="max-w-7xl mx-auto px-6 md:px-16 py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

          <div className="md:col-span-4 text-left">
            <span className="text-xs tracking-[0.25em] text-secondary uppercase font-semibold">Roadmap</span>
            <h2 className="font-serif text-3xl md:text-5xl text-white tracking-wide mt-2">Our Vision</h2>
          </div>

          {/* Left/Right Split of Today & Tomorrow */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
            <div className="p-6 border border-white/5 bg-primary-light hover:border-secondary/20 transition-all duration-300 rounded-sm">
              <span className="text-[10px] tracking-widest text-secondary font-bold uppercase block mb-3">Today</span>
              <p className="text-xs text-accent-muted font-light leading-relaxed">
                We are bringing creators together through digital media, film festivals, workshops, industry conversations, networking events, and meaningful opportunities that celebrate creativity and spark collaboration.              </p>
            </div>

            <div className="p-6 border border-white/5 bg-primary-light hover:border-secondary/20 transition-all duration-300 rounded-sm">
              <span className="text-[10px] tracking-widest text-secondary font-bold uppercase block mb-3">Tomorrow</span>
              <p className="text-xs text-accent-muted font-light leading-relaxed">
                Our vision is to build the world's most connected cinema ecosystem—a platform where creators learn, collaborate, showcase their work, gain recognition, discover opportunities, and shape the future of storytelling together.              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
