import { Link } from 'react-router-dom';
import { useSeo } from '../hooks/useSeo';

export default function FestivalsScreen() {
  useSeo({
    title: 'Short Film Festivals 2026 | Submit Your Film to Viora',
    description: 'Compete for digital laurels, handcrafted trophies, and cash prizes. Submit your narrative, documentary, or animation short film to Viora today.'
  });


  const awards = [
    { title: 'Best Director', category: 'Individual Excellence', icon: 'fa-clapperboard' },
    { title: 'Best Actor', category: 'Performance Excellence', icon: 'fa-masks-theater' },
    { title: 'Best Actress', category: 'Performance Excellence', icon: 'fa-masks-theater' },
    { title: 'Best Editing', category: 'Post-Production Excellence', icon: 'fa-scissors' },
    { title: 'Best Cinematography', category: 'Visual Excellence', icon: 'fa-video' },
    { title: 'Best Composer', category: 'Auditory Excellence', icon: 'fa-music' },
    { title: 'Best Sound Design', category: 'Auditory Excellence', icon: 'fa-volume-high' },
    { title: 'Special Jury Award', category: 'Honorary Excellence', icon: 'fa-award' },
    { title: 'Audience Choice', category: 'Popular Choice', icon: 'fa-users' },
  ];

  const reelFrames = [
    { title: 'Camera', label: 'Frame 01', icon: <i className="fa-solid fa-camera"></i> },
    { title: 'Script', label: 'Frame 02', icon: <i className="fa-solid fa-scroll"></i> },
    { title: 'Director', label: 'Frame 03', icon: <i className="fa-solid fa-clapperboard"></i> },
    { title: 'Actor', label: 'Frame 04', icon: <i className="fa-solid fa-masks-theater"></i> },
    { title: 'Editing', label: 'Frame 05', icon: <i className="fa-solid fa-scissors"></i> },
    { title: 'Audience', label: 'Frame 06', icon: <i className="fa-solid fa-users"></i> },
    { title: 'Trophy', label: 'Frame 07', icon: <i className="fa-solid fa-trophy"></i> },
  ];



  return (
    <div className="w-full bg-black min-h-screen pb-24">
      {/* Hero & Featured Card Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative overflow-hidden mb-16">
        {/* Glow effect */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] animate-pulse-slow" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Hero Text */}
          <div className="lg:col-span-6 text-left space-y-6">
            <div>
              <span className="text-xs tracking-[0.35em] text-secondary font-semibold uppercase">Exhibition</span>
              <h1 className="font-serif text-4xl md:text-6xl text-white tracking-wide mt-4 mb-6 leading-tight">
                Short Film <span className="text-gold-gradient font-italic font-normal">Festivals</span>
              </h1>
              <p className="text-sm md:text-base text-accent-muted font-light leading-relaxed tracking-wide max-w-xl">
                Discover exceptional films, celebrate emerging talent, and experience cinema through curated festivals. We provide a premium stage for independent filmmakers to share their vision.
              </p>
            </div>
          </div>

          {/* Right Column: Card */}
          <div className="lg:col-span-6">
            {/* Card: Viora Short Film Festival 2026 */}
            <div className="border border-white/5 bg-primary-light p-8 md:p-10 rounded-sm border-gold-glow relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 h-32 w-32 bg-secondary/5 rounded-full blur-2xl pointer-events-none"></div>
              <div>
                <h2 className="font-serif text-2xl md:text-3xl text-white tracking-wide mb-4">
                  Viora Short Film Festival 2026
                </h2>
                <p className="text-sm text-accent-muted font-light leading-relaxed mb-6">
                  Showcase your creativity, connect with fellow filmmakers, and compete for recognition.
                </p>
              </div>
              <div className="pt-6 border-t border-white/5">
                <Link
                  to="/viorasfs"
                  className="relative px-6 py-2.5 text-xs font-semibold tracking-widest uppercase border border-secondary bg-secondary text-black hover:bg-white hover:text-black hover:border-white transition-all duration-300 rounded-sm hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] inline-block text-center w-full"
                >
                  View
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Film Reel Header */}
      <div className="max-w-7xl mx-auto px-6 text-center mb-10">
        <span className="text-[10px] tracking-[0.4em] text-secondary font-semibold uppercase">Evolution of a Project</span>
        <h2 className="font-serif text-2xl md:text-3xl text-white mt-2">The Cinematic Journey</h2>
      </div>

      {/* Film Reel Animation Section */}
      <section className="w-full py-12 bg-primary-light border-y border-white/5 relative mb-24">
        
        {/* Film Strip Section Container (Full width) */}
        <div className="w-full overflow-hidden relative flex py-4 border-y-2 border-dashed border-white/10 bg-black/40 z-10">
          <div className="flex animate-roll-reel">

            {/* First Set of Frames */}
            <div className="flex gap-8 px-4 flex-shrink-0">
              {reelFrames.map((frame, idx) => (
                <div key={`reel-1-${idx}`} className="flex flex-col items-center gap-3 w-56 relative">
                  {/* Sprocket Top */}
                  <div className="w-full h-3.5 relative opacity-25">
                    <div className="absolute left-0 w-7 h-3.5 bg-white rounded-[3px]"></div>
                    <div className="absolute left-16 w-7 h-3.5 bg-white rounded-[3px]"></div>
                    <div className="absolute left-32 w-7 h-3.5 bg-white rounded-[3px]"></div>
                    <div className="absolute left-48 w-7 h-3.5 bg-white rounded-[3px]"></div>
                  </div>

                  {/* Film Frame Card */}
                  <div className="w-56 h-36 bg-black border border-white/10 rounded-sm p-4 flex flex-col items-center justify-center text-center relative group hover:border-secondary/50 transition-colors duration-300">
                    {/* Frame border lines resembling slide frame */}
                    <div className="absolute top-0 bottom-0 left-2 right-2 border-x border-white/5"></div>
                    <div className="relative z-10">
                      <div className="mb-2 text-2xl text-secondary">{frame.icon}</div>
                      <span className="block font-serif text-sm text-white font-medium tracking-wide mb-1">{frame.title}</span>
                    </div>
                  </div>

                  {/* Sprocket Bottom */}
                  <div className="w-full h-3.5 relative opacity-25">
                    <div className="absolute left-0 w-7 h-3.5 bg-white rounded-[3px]"></div>
                    <div className="absolute left-16 w-7 h-3.5 bg-white rounded-[3px]"></div>
                    <div className="absolute left-32 w-7 h-3.5 bg-white rounded-[3px]"></div>
                    <div className="absolute left-48 w-7 h-3.5 bg-white rounded-[3px]"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Second Set of Frames (for seamless infinite loop) */}
            <div className="flex gap-8 px-4 flex-shrink-0">
              {reelFrames.map((frame, idx) => (
                <div key={`reel-2-${idx}`} className="flex flex-col items-center gap-3 w-56 relative">
                  {/* Sprocket Top */}
                  <div className="w-full h-3.5 relative opacity-25">
                    <div className="absolute left-0 w-7 h-3.5 bg-white rounded-[3px]"></div>
                    <div className="absolute left-16 w-7 h-3.5 bg-white rounded-[3px]"></div>
                    <div className="absolute left-32 w-7 h-3.5 bg-white rounded-[3px]"></div>
                    <div className="absolute left-48 w-7 h-3.5 bg-white rounded-[3px]"></div>
                  </div>

                  {/* Film Frame Card */}
                  <div className="w-56 h-36 bg-black border border-white/10 rounded-sm p-4 flex flex-col items-center justify-center text-center relative group hover:border-secondary/50 transition-colors duration-300">
                    {/* Frame border lines resembling slide frame */}
                    <div className="absolute top-0 bottom-0 left-2 right-2 border-x border-white/5"></div>
                    <div className="relative z-10">
                      <div className="mb-2 text-2xl text-secondary">{frame.icon}</div>
                      <span className="block font-serif text-sm text-white font-medium tracking-wide mb-1">{frame.title}</span>
                    </div>
                  </div>

                  {/* Sprocket Bottom */}
                  <div className="w-full h-3.5 relative opacity-25">
                    <div className="absolute left-0 w-7 h-3.5 bg-white rounded-[3px]"></div>
                    <div className="absolute left-16 w-7 h-3.5 bg-white rounded-[3px]"></div>
                    <div className="absolute left-32 w-7 h-3.5 bg-white rounded-[3px]"></div>
                    <div className="absolute left-48 w-7 h-3.5 bg-white rounded-[3px]"></div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Acquisition Partner Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 mb-24">
        <div className="text-center">
          <span className="text-[10px] tracking-[0.4em] text-secondary font-semibold uppercase">Acquisition Partner</span>
          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="border border-white/10 bg-primary-light rounded-sm p-8 inline-flex items-center justify-center hover:border-secondary/30 transition-all duration-300">
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

      {/* Awards Section */}

      <section className="bg-primary-light border-y border-white/5 py-24 px-6 mb-24 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs tracking-[0.25em] text-secondary uppercase font-semibold">Trophies & Recognition</span>
            <h2 className="font-serif text-3xl md:text-5xl text-white mt-2">Accolades & Laurels</h2>
            <p className="text-xs md:text-sm text-accent-muted font-light tracking-wide max-w-xl mx-auto mt-4">
              Winners receive custom handcrafted trophies, digital laurels, and certification of recognition to highlight their achievement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {awards.map((award, idx) => (
              <div
                key={idx}
                className="group border border-white/5 bg-black p-6 rounded-sm text-center flex flex-col items-center justify-center hover:border-secondary/35 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(197,160,89,0.15)] transition-all duration-300 cursor-default"
              >
                <i className={`fa-solid ${award.icon} text-secondary text-xl mb-3 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6`}></i>
                <span className="text-xs font-semibold text-white tracking-wider uppercase mb-1">
                  {award.title}
                </span>
                <span className="text-[10px] text-accent-muted tracking-widest uppercase font-light">
                  {award.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>



    </div>
  );
}
