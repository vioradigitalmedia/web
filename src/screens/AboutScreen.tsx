
export default function AboutScreen() {
  const vioraMeaning = [
    { letter: 'V', word: 'Vizhi', detail: 'Vision', desc: 'The initial spark of imagination.' },
    { letter: 'I', word: 'Innovation', detail: 'Innovation', desc: 'Pushing boundaries and new perspectives.' },
    { letter: 'O', word: 'Oli', detail: 'Light', desc: 'The fundamental canvas of cinema.' },
    { letter: 'R', word: 'Rhythm', detail: 'Rhythm', desc: 'The emotional pulse of the cut.' },
    { letter: 'A', word: 'Art', detail: 'Art', desc: 'The final integration of craftsmanship.' },
  ];

  const activities = [
    {
      title: 'Short Film Festivals',
      icon: (
        <svg className="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {/* Vintage Video Camera */}
          <rect x="2" y="7" width="11" height="9" rx="1" strokeWidth={1.5} />
          <circle cx="5" cy="4.5" r="2" strokeWidth={1.5} />
          <circle cx="10" cy="4.5" r="2" strokeWidth={1.5} />
          <path d="M13 10.5l5-3.5v9l-5-3.5" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      title: 'Film Competitions',
      icon: (
        <svg className="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {/* Cinematic Clapboard */}
          <rect x="3" y="9" width="18" height="11" rx="1.5" strokeWidth={1.5} />
          <path d="M3 9l18-3" strokeWidth={1.5} strokeLinecap="round" />
          <path d="M6 8.5L8 6.5M11 7.5l2-2M16 6.5l2-2" strokeWidth={1.5} strokeLinecap="round" />
        </svg>
      )
    },
    {
      title: 'Creator Community',
      icon: (
        <svg className="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {/* Film Strip */}
          <rect x="4" y="3" width="16" height="18" rx="2" strokeWidth={1.5} />
          <path d="M7 5v.01M7 9v.01M7 13v.01M7 17v.01" strokeWidth={2} strokeLinecap="round" />
          <path d="M17 5v.01M17 9v.01M17 13v.01M17 17v.01" strokeWidth={2} strokeLinecap="round" />
          <path d="M10 3v18M14 3v18" strokeWidth={1} strokeDasharray="2 2" />
        </svg>
      )
    },
    {
      title: 'Workshops & Networking',
      icon: (
        <svg className="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {/* Spotlight / Studio Light */}
          <circle cx="12" cy="7" r="4.5" strokeWidth={1.5} />
          <path d="M12 11.5v6.5M7 21h10M12 18l-3.5 3M12 18l3.5 3" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 7.5L5 6M18 7.5l1-1.5" strokeWidth={1.5} strokeLinecap="round" />
        </svg>
      )
    },
    {
      title: 'Film Screenings',
      icon: (
        <svg className="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {/* Theater Curtain / Stage Screen */}
          <path d="M3 4h18v16H3V4z" strokeWidth={1.5} strokeLinecap="round" />
          <path d="M3 4c3.5 3.5 2 11 0 16" strokeWidth={1.5} strokeLinecap="round" />
          <path d="M21 4c-3.5 3.5-2 11 0 16" strokeWidth={1.5} strokeLinecap="round" />
          <path d="M2 17.5h20" strokeWidth={1.5} strokeLinecap="round" />
        </svg>
      )
    },
    {
      title: 'Industry Collaborations',
      icon: (
        <svg className="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {/* Director Megaphone */}
          <path d="M3 17.5l3-3h4l5.5 4.5V5l-5.5 4.5h-4l-3-3v11z" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M19 8c1.5 1.5 1.5 6.5 0 8" strokeWidth={1.5} strokeLinecap="round" />
        </svg>
      )
    },
    {
      title: 'Viora Originals (coming in the future)',
      icon: (
        <svg className="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {/* Cinema Ticket */}
          <rect x="3" y="6" width="18" height="12" rx="2" strokeWidth={1.5} />
          <path d="M3 12c1.2 0 1.2-2 0-2M21 12c-1.2 0-1.2-2 0-2" strokeWidth={1.5} strokeLinejoin="round" />
          <path d="M8 9h8M8 13h5" strokeWidth={1.5} strokeLinecap="round" />
        </svg>
      )
    }
  ];

  const values = [
    { 
      title: 'Creativity', 
      desc: 'Every story deserves a chance.',
      icon: (
        <svg className="h-8 w-8 text-secondary mb-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    { 
      title: 'Innovation', 
      desc: 'We embrace new ideas and new voices.',
      icon: (
        <svg className="h-8 w-8 text-secondary mb-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    { 
      title: 'Community', 
      desc: 'Great cinema grows through collaboration.',
      icon: (
        <svg className="h-8 w-8 text-secondary mb-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    { 
      title: 'Quality', 
      desc: 'We value thoughtful storytelling and craftsmanship.',
      icon: (
        <svg className="h-8 w-8 text-secondary mb-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.243.577 1.832l-3.978 2.889a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.977-2.888a1 1 0 00-1.176 0l-3.977 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.98 10.123c-.783-.589-.38-1.832.577-1.832h4.907a1 1 0 00.95-.69L11.049 2.927z" />
        </svg>
      )
    },
    { 
      title: 'Inclusivity', 
      desc: 'Creators from every background are welcome.',
      icon: (
        <svg className="h-8 w-8 text-secondary mb-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.6 9h16.8M3.6 15h16.8M12 3a15.3 15.3 0 014 9 15.3 15.3 0 01-4 9 15.3 15.3 0 01-4-9 15.3 15.3 0 014-9z" />
        </svg>
      )
    }
  ];

  return (
    <div className="w-full bg-black min-h-screen pt-12 pb-24 text-white">
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
        
        <span className="text-xs tracking-[0.35em] text-secondary font-semibold uppercase">Platform</span>
        <h1 className="font-serif text-5xl md:text-8xl text-white tracking-wide mt-4 mb-6">
          About Viora
        </h1>
        
        <p className="text-gold-gradient font-serif italic text-lg md:text-2xl tracking-wide mb-10">
          "Where Vision Becomes Art."
        </p>

        <p className="text-sm md:text-base text-accent-muted max-w-3xl mx-auto font-light leading-relaxed tracking-wide">
          Viora is a creative media platform dedicated to discovering, celebrating, and empowering storytellers. 
          We believe every great filmmaker deserves a stage, and every meaningful story deserves an audience.
        </p>
      </section>

      {/* Our Story Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="text-center mb-12">
          <span className="text-xs tracking-[0.25em] text-secondary uppercase font-semibold">Origin</span>
          <h2 className="font-serif text-3xl md:text-5xl text-white mt-2">Our Story</h2>
        </div>

        <div className="space-y-8 font-light text-accent-muted text-sm md:text-base leading-relaxed">
          <p className="font-serif italic text-white text-lg md:text-xl text-center mb-8">
            Every filmmaker starts with an idea. <br />
            <span className="text-secondary">A single vision. A single frame. A single story waiting to be told.</span>
          </p>

          <p>
            Viora was founded to create opportunities for emerging creators through short film festivals, 
            creative collaborations, and a growing community that celebrates independent cinema. We want to 
            bridge the gap between aspiring filmmakers and the audiences, mentors, and opportunities they need to grow.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <div className="p-6 border border-secondary/20 bg-primary-light rounded-sm">
              <span className="text-xs tracking-widest text-secondary uppercase font-bold block mb-2">Today</span>
              <p className="text-sm text-white">We organize film festivals.</p>
            </div>
            <div className="p-6 border border-secondary/20 bg-primary-light rounded-sm">
              <span className="text-xs tracking-widest text-secondary uppercase font-bold block mb-2">Tomorrow</span>
              <p className="text-sm text-white">We aim to build a creative ecosystem where stories are developed, produced, and shared with the world.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What Viora Means Section */}
      <section className="bg-primary-light border-y border-white/5 py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs tracking-[0.25em] text-secondary uppercase font-semibold">Decoded</span>
            <h2 className="font-serif text-3xl md:text-5xl text-white mt-2">What Viora Means</h2>
          </div>

          {/* Golden Letter Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
            {vioraMeaning.map((item, idx) => (
              <div 
                key={idx} 
                className="border border-white/5 bg-black p-6 rounded-sm text-center flex flex-col items-center justify-center border-gold-glow transition-all duration-300"
              >
                <span className="font-serif text-5xl md:text-6xl text-gold-gradient font-bold mb-4">
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
              </div>
            ))}
          </div>

          <p className="text-center text-xs md:text-sm text-accent-muted font-light tracking-wide max-w-xl mx-auto italic mt-8">
            These five ideas represent every stage of storytelling—from imagination to the final frame.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="p-8 border border-white/5 bg-primary-light hover:border-secondary/35 transition-colors duration-500 rounded-sm relative group">
          <div className="absolute top-0 left-0 w-[2px] h-0 bg-secondary group-hover:h-full transition-all duration-500" />
          <span className="text-xs tracking-[0.25em] text-secondary uppercase font-semibold block mb-4">Focus</span>
          <h3 className="font-serif text-2xl md:text-3xl text-white mb-4">Our Mission</h3>
          <p className="text-xs md:text-sm text-accent-muted font-light leading-relaxed">
            To empower the next generation of filmmakers by providing platforms to showcase their work, 
            connect with audiences, and transform creative ideas into impactful stories.
          </p>
        </div>

        <div className="p-8 border border-white/5 bg-primary-light hover:border-secondary/35 transition-colors duration-500 rounded-sm relative group">
          <div className="absolute top-0 left-0 w-[2px] h-0 bg-secondary group-hover:h-full transition-all duration-500" />
          <span className="text-xs tracking-[0.25em] text-secondary uppercase font-semibold block mb-4">Future</span>
          <h3 className="font-serif text-2xl md:text-3xl text-white mb-4">Our Vision</h3>
          <p className="text-xs md:text-sm text-accent-muted font-light leading-relaxed">
            To become one of India’s leading independent media platforms, nurturing creators through 
            festivals, production, education, and original storytelling that inspires audiences worldwide.
          </p>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="bg-primary-light border-y border-white/5 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs tracking-[0.25em] text-secondary uppercase font-semibold">Capabilities</span>
            <h2 className="font-serif text-3xl md:text-5xl text-white mt-2">What We Do</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {activities.map((item, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-4 p-5 bg-black border border-white/5 rounded-sm hover:border-secondary/30 transition-all duration-300 group"
              >
                <div className="h-10 w-10 rounded-full border border-secondary/20 flex items-center justify-center flex-shrink-0 bg-secondary/5 group-hover:border-secondary transition-colors duration-300">
                  {item.icon}
                </div>
                <span className="text-xs md:text-sm font-medium text-white tracking-wide">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <span className="text-xs tracking-[0.25em] text-secondary uppercase font-semibold">Pillars</span>
          <h2 className="font-serif text-3xl md:text-5xl text-white mt-2">Our Values</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {values.map((item, idx) => (
            <div 
              key={idx} 
              className="p-6 border border-white/5 bg-primary-light hover:border-secondary/30 transition-all duration-300 rounded-sm text-center flex flex-col justify-start border-gold-glow"
            >
              <div className="flex justify-center">
                {item.icon}
              </div>
              <h3 className="font-serif text-lg text-white mb-2 pb-2 border-b border-white/5">
                {item.title}
              </h3>
              <p className="text-xs text-accent-muted font-light leading-relaxed pt-2">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Join the Journey Section */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[80px] pointer-events-none" />
        
        <h2 className="font-serif text-3xl md:text-5xl text-white tracking-wide mb-6">
          Join the Journey
        </h2>
        
        <p className="text-xs md:text-sm text-accent-muted leading-relaxed mb-10 max-w-xl mx-auto font-light">
          Whether you’re a filmmaker, writer, actor, cinematographer, editor, musician, 
          or simply someone who loves cinema, Viora is a place to create, collaborate, and celebrate stories.
        </p>
        
        <div className="font-serif text-2xl md:text-3xl text-gold-gradient font-bold tracking-wide">
          Welcome to Viora.
        </div>
      </section>

    </div>
  );
}
