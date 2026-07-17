import { useState, useEffect } from 'react';
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
    {
      title: 'Digital Media',
      icon: <i className="fa-solid fa-newspaper text-secondary text-lg"></i>
    },
    {
      title: 'Short Film Festivals',
      icon: <i className="fa-solid fa-film text-secondary text-lg"></i>
    },
    {
      title: 'Academy',
      icon: <i className="fa-solid fa-graduation-cap text-secondary text-lg"></i>
    },
    {
      title: 'Community',
      icon: <i className="fa-solid fa-users text-secondary text-lg"></i>
    },
    {
      title: 'Awards & Recognition',
      icon: <i className="fa-solid fa-trophy text-secondary text-lg"></i>
    },
    {
      title: 'Opportunities',
      icon: <i className="fa-solid fa-briefcase text-secondary text-lg"></i>
    },
    {
      title: 'Viora Originals',
      icon: <i className="fa-solid fa-clapperboard text-secondary text-lg"></i>
    },
    {
      title: 'Events',
      icon: <i className="fa-solid fa-calendar-days text-secondary text-lg"></i>
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

  const [scene, setScene] = useState<number>(0);
  const [isIntroActive, setIsIntroActive] = useState<boolean>(true);
  const [miniScene, setMiniScene] = useState<number>(0);

  useEffect(() => {
    if (scene >= 7) {
      setIsIntroActive(false);
      return;
    }

    const durations = [2000, 2500, 2500, 2500, 2500, 3000, 2000];
    const timer = setTimeout(() => {
      setScene(prev => prev + 1);
    }, durations[scene]);

    return () => clearTimeout(timer);
  }, [scene]);

  useEffect(() => {
    if (isIntroActive) return;

    const interval = setInterval(() => {
      setMiniScene(prev => (prev + 1) % 7);
    }, 2500);

    return () => clearInterval(interval);
  }, [isIntroActive]);

  useEffect(() => {
    if (!isIntroActive) return;

    const audioPath = '/remo--sivakarthikeyan-keerthi-suresh--anirudh-ravichander (1).mp3';
    const audio = new Audio(audioPath);
    audio.volume = 0.55;

    audio.play().catch(err => {
      console.warn("Autoplay block: Interaction needed to trigger audio.", err);
    });

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [isIntroActive]);

  if (isIntroActive) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden font-sans select-none">

        {/* Skip Intro Button */}
        <button
          onClick={() => setIsIntroActive(false)}
          className="absolute top-8 right-8 px-5 py-2.5 border border-secondary/20 text-secondary hover:text-black hover:bg-gold-gradient transition-all duration-300 rounded-sm text-[10px] tracking-widest uppercase cursor-pointer"
        >
          Skip Intro ✕
        </button>

        {/* Visual Scene Container */}
        <div className="relative w-full max-w-lg h-96 flex flex-col items-center justify-center text-center px-6">

          {/* Scene 1: Darkness (Glowing dot) */}
          {scene === 0 && (
            <div className="flex flex-col items-center justify-center animate-[fade-in_1s_ease-out_forwards]">
              <div className="h-3 w-3 rounded-full bg-secondary shadow-[0_0_20px_#C5A059] animate-pulse mb-8" />
              <p className="font-serif italic text-white/90 text-lg md:text-xl tracking-wide">
                Every story begins with a vision.
              </p>
            </div>
          )}

          {/* Scene 2: Vision (Eye Outline + slowly zooming camera) */}
          {scene === 1 && (
            <div className="flex flex-col items-center justify-center animate-[scale-up_2.5s_linear_forwards]">
              <svg className="h-24 w-24 text-secondary/80 mb-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="text-xs tracking-[0.35em] text-secondary/40 uppercase font-semibold block mb-2">Vizhi</span>
              <h2 className="font-serif text-3xl md:text-4xl text-white tracking-widest font-light">
                Vision.
              </h2>
            </div>
          )}

          {/* Scene 3: Innovation (Interconnected Lines / Frames) */}
          {scene === 2 && (
            <div className="flex flex-col items-center justify-center animate-[fade-in_0.5s_ease-out_forwards]">
              <div className="relative h-28 w-28 mb-8 flex items-center justify-center">
                <div className="absolute inset-0 border border-secondary/20 rounded-md rotate-45 scale-90 animate-pulse" />
                <div className="absolute inset-2 border border-secondary/20 rounded-md -rotate-12 scale-95" />
                <svg className="h-10 w-10 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl text-white tracking-widest font-light">
                Innovation.
              </h2>
            </div>
          )}

          {/* Scene 4: Oli / Light (Spotlight + Dust Particles) */}
          {scene === 3 && (
            <div className="flex flex-col items-center justify-center w-full h-full animate-[fade-in_0.5s_ease-out_forwards]">
              <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 w-48 h-56 bg-gradient-to-b from-secondary/15 to-transparent rounded-b-[100px] blur-sm" />
              <div className="absolute top-20 left-1/3 h-1 w-1 rounded-full bg-secondary/80 animate-ping" />
              <div className="absolute top-32 right-1/4 h-1 w-1 rounded-full bg-secondary/60 animate-ping" style={{ animationDelay: '1s' }} />
              <div className="absolute top-16 right-1/3 h-1 w-1 rounded-full bg-secondary/40 animate-ping" style={{ animationDelay: '0.5s' }} />

              <div className="relative z-10 mt-24">
                <h2 className="font-serif text-3xl md:text-4xl text-white tracking-widest font-light animate-[scale-up_2s_linear_forwards]">
                  Oli.
                </h2>
              </div>
            </div>
          )}

          {/* Scene 5: Rhythm (Audio Waves / film cuts in sync) */}
          {scene === 4 && (
            <div className="flex flex-col items-center justify-center animate-[fade-in_0.5s_ease-out_forwards]">
              <div className="flex gap-2 items-end h-16 mb-10">
                <span className="w-1 bg-secondary rounded-full h-4 animate-[pulse_0.4s_infinite_alternate]" />
                <span className="w-1 bg-secondary rounded-full h-12 animate-[pulse_0.6s_infinite_alternate]" style={{ animationDelay: '0.1s' }} />
                <span className="w-1 bg-secondary rounded-full h-6 animate-[pulse_0.5s_infinite_alternate]" style={{ animationDelay: '0.2s' }} />
                <span className="w-1 bg-secondary rounded-full h-16 animate-[pulse_0.7s_infinite_alternate]" style={{ animationDelay: '0.3s' }} />
                <span className="w-1 bg-secondary rounded-full h-8 animate-[pulse_0.4s_infinite_alternate]" style={{ animationDelay: '0.4s' }} />
                <span className="w-1 bg-secondary rounded-full h-12 animate-[pulse_0.6s_infinite_alternate]" style={{ animationDelay: '0.2s' }} />
                <span className="w-1 bg-secondary rounded-full h-4 animate-[pulse_0.5s_infinite_alternate]" style={{ animationDelay: '0.1s' }} />
              </div>
              <h2 className="font-serif text-3xl md:text-4xl text-white tracking-widest font-light">
                Rhythm.
              </h2>
            </div>
          )}

          {/* Scene 6: Art (VIORA Logo emerges) */}
          {scene === 5 && (
            <div className="flex flex-col items-center justify-center animate-[scale-up_3s_ease-out_forwards]">
              <img
                src="/logo.jpg"
                alt="Viora Logo"
                className="h-40 w-40 md:h-48 md:w-48 object-contain rounded-md border border-secondary/30 shadow-[0_0_35px_rgba(197,160,89,0.4)] mb-8"
              />
              <h2 className="font-serif text-3xl md:text-4xl text-white tracking-widest font-light mb-2">
                Art.
              </h2>
            </div>
          )}

          {/* Scene 7: Ending (Text + Subtitle tagline) */}
          {scene === 6 && (
            <div className="flex flex-col items-center justify-center animate-[fade-in_0.5s_ease-out_forwards]">
              <span className="font-serif tracking-[0.3em] text-5xl md:text-6xl font-semibold text-white mb-4">
                VIORA
              </span>
              <span className="text-secondary tracking-[0.25em] text-xs md:text-sm uppercase font-light">
                Where Every Story Finds Its Stage.
              </span>
            </div>
          )}

        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-black min-h-screen pt-12 pb-24 text-white">

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">

          {/* Left Column - Miniature About Us Loop Animation */}
          <div className="md:col-span-5 flex justify-center items-center select-none">
            <div className="relative w-56 h-56 flex items-center justify-center border border-secondary/15 bg-primary-light rounded-sm overflow-hidden border-gold-glow p-4">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />

              <div className="relative w-full h-full flex flex-col items-center justify-center text-center px-4">

                {/* Mini Scene 0: Darkness (Glowing dot) */}
                {miniScene === 0 && (
                  <div className="flex flex-col items-center justify-center animate-[fade-in_0.5s_ease-out_forwards]">
                    <div className="h-2 w-2 rounded-full bg-secondary shadow-[0_0_12px_#C5A059] animate-pulse mb-3" />
                    <span className="text-[9px] tracking-widest text-white/80 italic font-serif leading-tight">"Every story begins..."</span>
                  </div>
                )}

                {/* Mini Scene 1: Vision (Eye Outline) */}
                {miniScene === 1 && (
                  <div className="flex flex-col items-center justify-center animate-[scale-up_2s_linear_forwards]">
                    <svg className="h-10 w-10 text-secondary/80 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span className="text-[9px] tracking-[0.25em] text-secondary uppercase font-semibold">Vision</span>
                  </div>
                )}

                {/* Mini Scene 2: Innovation (Interconnected Lines) */}
                {miniScene === 2 && (
                  <div className="flex flex-col items-center justify-center animate-[fade-in_0.5s_ease-out_forwards]">
                    <div className="relative h-10 w-10 mb-2 flex items-center justify-center">
                      <div className="absolute inset-0 border border-secondary/20 rounded-md rotate-45 scale-90 animate-pulse" />
                      <div className="absolute inset-1 border border-secondary/20 rounded-md -rotate-12 scale-95" />
                      <svg className="h-4 w-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className="text-[9px] tracking-[0.25em] text-secondary uppercase font-semibold">Innovation</span>
                  </div>
                )}

                {/* Mini Scene 3: Oli / Light (Spotlight) */}
                {miniScene === 3 && (
                  <div className="flex flex-col items-center justify-center w-full h-full animate-[fade-in_0.5s_ease-out_forwards] relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-24 bg-gradient-to-b from-secondary/15 to-transparent rounded-b-[40px] blur-[2px]" />
                    <div className="relative z-10 mt-6 flex flex-col items-center">
                      <span className="text-[10px] tracking-[0.25em] text-secondary uppercase font-semibold">Oli</span>
                    </div>
                  </div>
                )}

                {/* Mini Scene 4: Rhythm (Audio Waves) */}
                {miniScene === 4 && (
                  <div className="flex flex-col items-center justify-center animate-[fade-in_0.5s_ease-out_forwards]">
                    <div className="flex gap-1 items-end h-6 mb-3">
                      <span className="w-0.5 bg-secondary rounded-full h-2 animate-[pulse_0.4s_infinite_alternate]" />
                      <span className="w-0.5 bg-secondary rounded-full h-5 animate-[pulse_0.6s_infinite_alternate]" style={{ animationDelay: '0.1s' }} />
                      <span className="w-0.5 bg-secondary rounded-full h-3 animate-[pulse_0.5s_infinite_alternate]" style={{ animationDelay: '0.2s' }} />
                      <span className="w-0.5 bg-secondary rounded-full h-6 animate-[pulse_0.7s_infinite_alternate]" style={{ animationDelay: '0.3s' }} />
                      <span className="w-0.5 bg-secondary rounded-full h-3 animate-[pulse_0.4s_infinite_alternate]" style={{ animationDelay: '0.4s' }} />
                    </div>
                    <span className="text-[9px] tracking-[0.25em] text-secondary uppercase font-semibold">Rhythm</span>
                  </div>
                )}

                {/* Mini Scene 5: Art (Logo) */}
                {miniScene === 5 && (
                  <div className="flex flex-col items-center justify-center animate-[scale-up_2s_ease-out_forwards]">
                    <img
                      src="/logo.jpg"
                      alt="Viora Logo"
                      className="h-8 w-8 object-contain rounded-md border border-secondary/35 shadow-[0_0_10px_rgba(197,160,89,0.3)] mb-2"
                    />
                    <span className="text-[9px] tracking-[0.25em] text-secondary uppercase font-semibold">Art</span>
                  </div>
                )}

                {/* Mini Scene 6: Ending (Tagline) */}
                {miniScene === 6 && (
                  <div className="flex flex-col items-center justify-center animate-[fade-in_0.5s_ease-out_forwards] px-1">
                    <span className="font-serif tracking-[0.2em] text-sm font-semibold text-white mb-1">
                      VIORA
                    </span>
                    <span className="text-secondary tracking-widest text-[7px] uppercase font-light leading-tight">
                      Where Every Story Finds Its Stage.
                    </span>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* Right Column - Text Content */}
          <div className="md:col-span-7 text-left flex flex-col items-start">
            <span className="text-xs tracking-[0.35em] text-secondary font-semibold uppercase">Platform</span>
            <h1 className="font-serif text-4xl md:text-6xl text-white tracking-wide mt-2 mb-4 leading-tight">
              About Viora
            </h1>

            <p className="text-gold-gradient font-serif italic text-lg md:text-xl tracking-wide mb-6">
              "Where Vision Becomes Art."
            </p>

            <p className="text-sm md:text-base text-accent-muted font-light leading-relaxed tracking-wide">
              Viora is a premium cinema ecosystem dedicated to bringing together creators, industry professionals, and audiences under one unified platform. Through digital media, film festivals, workshops, networking, awards, original content, and creative collaborations, we create meaningful opportunities that inspire growth, celebrate excellence, and strengthen the creative community.
              Built on the values of innovation, integrity, and artistic excellence, Viora is committed to supporting storytellers at every stage of their journey. Our mission is to foster a trusted ecosystem where talent is discovered, ideas become collaborations, and every voice in cinema has the opportunity to thrive.

            </p>
          </div>

        </div>
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
            Viora was founded with a clear vision: to create a platform that brings every aspect of cinema together under one ecosystem. We recognized that while the industry is filled with exceptional talent and countless opportunities, they often exist in separate spaces. Creators seek guidance, professionals seek meaningful collaborations, emerging voices seek recognition, and audiences seek authentic stories. Viora was established to bridge these gaps and create a connected environment where everyone can learn, collaborate, grow, and contribute to the future of cinema.
            Our journey is driven by a long-term commitment to supporting the creative community through digital media, film festivals, workshops, industry conversations, networking initiatives, awards, and original content. Every initiative we undertake is designed with purpose—to create opportunities, encourage collaboration, celebrate excellence, and make the world of cinema more accessible to aspiring and established creators alike.
            We believe lasting impact is built through trust, consistency, and meaningful relationships. As Viora continues to grow, our mission remains unchanged: to build a platform where creators are empowered, talent is recognized, and the entire cinema community can come together to shape the future of storytelling.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <div className="p-6 border border-secondary/20 bg-primary-light rounded-sm">
              <span className="text-xs tracking-widest text-secondary uppercase font-bold block mb-2">Today</span>
              <p className="text-sm text-white">We are bringing creators together through digital media, film festivals, workshops, industry conversations, networking events, and meaningful opportunities that celebrate creativity and spark collaboration.</p>
            </div>
            <div className="p-6 border border-secondary/20 bg-primary-light rounded-sm">
              <span className="text-xs tracking-widest text-secondary uppercase font-bold block mb-2">Tomorrow</span>
              <p className="text-sm text-white">Our vision is to build the world's most connected cinema ecosystem—a platform where creators learn, collaborate, showcase their work, gain recognition, discover opportunities, and shape the future of storytelling together.</p>
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
            Our mission is to build a thriving cinema ecosystem where creativity meets opportunity. We are committed to empowering storytellers by connecting creators, industry professionals, and audiences through meaningful experiences, education, collaboration, recognition, and innovative digital media. By fostering a culture of excellence, inclusivity, and integrity, Viora aims to inspire the next generation of creators while shaping the future of cinema.</p>
        </div>

        <div className="p-8 border border-white/5 bg-primary-light hover:border-secondary/35 transition-colors duration-500 rounded-sm relative group">
          <div className="absolute top-0 left-0 w-[2px] h-0 bg-secondary group-hover:h-full transition-all duration-500" />
          <span className="text-xs tracking-[0.25em] text-secondary uppercase font-semibold block mb-4">Future</span>
          <h3 className="font-serif text-2xl md:text-3xl text-white mb-4">Our Vision</h3>
          <p className="text-xs md:text-sm text-accent-muted font-light leading-relaxed">
            Our vision is to build one of the world's most trusted and influential cinema ecosystems, where creativity, collaboration, and opportunity come together. We aspire to create a future where every storyteller has access to the platform, knowledge, recognition, and community they need to inspire audiences and shape the future of cinema.</p>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="bg-primary-light border-y border-white/5 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs tracking-[0.25em] text-secondary uppercase font-semibold">Capabilities</span>
            <h2 className="font-serif text-3xl md:text-5xl text-white mt-2">What We Do</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
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
          Be part of a community that's shaping the future of cinema—where creativity connects, opportunities grow, and every story matters.</p>
        <div className="font-serif text-2xl md:text-3xl text-gold-gradient font-bold tracking-wide">
          Welcome to Viora.
        </div>
      </section>

    </div>
  );
}
