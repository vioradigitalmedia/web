import { Link } from 'react-router-dom';

export default function FestivalsScreen() {
  const categories = [
    {
      title: 'Narrative Short',
      desc: 'Original storytelling, dramatic and comedic narrative films under 30 minutes.',
      icon: <i className="fa-solid fa-clapperboard text-secondary text-2xl mb-4"></i>,
    },
    {
      title: 'Documentary Short',
      desc: 'Non-fiction storytelling highlighting real-world issues, human stories, and unique insights under 30 minutes.',
      icon: <i className="fa-solid fa-camera text-secondary text-2xl mb-4"></i>,
    },
    {
      title: 'Animation Short',
      desc: 'All styles of animation (2D, 3D, stop-motion) showing creative visual styles under 20 minutes.',
      icon: <i className="fa-solid fa-wand-magic-sparkles text-secondary text-2xl mb-4"></i>,
    },
    {
      title: 'Student Film',
      desc: 'Dedicated category for student filmmakers currently enrolled in high school or university programs.',
      icon: <i className="fa-solid fa-graduation-cap text-secondary text-2xl mb-4"></i>,
    },
  ];

  const awards = [
    { title: 'Best Narrative Short', category: 'Grand Jury Award' },
    { title: 'Best Director', category: 'Individual Excellence' },
    { title: 'Best Cinematography', category: 'Visual Excellence' },
    { title: 'Best Original Screenplay', category: 'Narrative Excellence' },
    { title: 'Best Actor/Actress', category: 'Performance Excellence' },
    { title: 'Audience Choice Award', category: 'Popular Recognition' },
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
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-secondary/10 border border-secondary/20 text-secondary text-[10px] tracking-widest uppercase font-semibold rounded-sm">
                    Coming Soon
                  </span>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl text-white tracking-wide mb-4">
                  Viora Short Film Festival 2026
                </h2>
                <p className="text-sm text-accent-muted font-light leading-relaxed mb-6">
                  Showcase your creativity, connect with fellow filmmakers, and compete for recognition.
                </p>
              </div>
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-semibold text-secondary uppercase tracking-widest">More Details Soon</span>
                <Link
                  to="/contact"
                  className="text-xs text-white hover:text-secondary transition-colors duration-300 font-medium tracking-wider"
                >
                  Inquire &rarr;
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Film Reel Animation Section */}
      <section className="w-full overflow-hidden py-12 bg-primary-light border-y border-white/5 relative mb-24">
        {/* Film Strip Header (Sprocket Holes) */}
        <div className="absolute top-2 left-0 w-full flex justify-around opacity-20 select-none pointer-events-none">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="w-3.5 h-2 bg-white rounded-sm"></div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center mb-8">
            <span className="text-[10px] tracking-[0.4em] text-secondary font-semibold uppercase">Evolution of a Project</span>
            <h2 className="font-serif text-2xl text-white mt-2">The Cinematic Journey</h2>
          </div>
        </div>

        {/* Film Track */}
        <div className="w-full relative flex overflow-hidden py-4 border-y-2 border-dashed border-white/10 bg-black/40">
          <div className="flex animate-roll-reel">

            {/* First Set of Frames */}
            <div className="flex gap-8 px-4 flex-shrink-0">
              {reelFrames.map((frame, idx) => (
                <div key={`reel-1-${idx}`} className="w-56 h-36 bg-black border border-white/10 rounded-sm p-4 flex flex-col items-center justify-center text-center flex-shrink-0 relative group hover:border-secondary/50 transition-colors duration-300">
                  {/* Frame border lines resembling slide frame */}
                  <div className="absolute top-0 bottom-0 left-2 right-2 border-x border-white/5"></div>
                  <div className="relative z-10">
                    <div className="mb-2 text-2xl text-secondary">{frame.icon}</div>
                    <span className="block font-serif text-sm text-white font-medium tracking-wide mb-1">{frame.title}</span>
                    <span className="block text-[9px] text-accent-muted uppercase tracking-widest">{frame.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Second Set of Frames (for seamless infinite loop) */}
            <div className="flex gap-8 px-4 flex-shrink-0">
              {reelFrames.map((frame, idx) => (
                <div key={`reel-2-${idx}`} className="w-56 h-36 bg-black border border-white/10 rounded-sm p-4 flex flex-col items-center justify-center text-center flex-shrink-0 relative group hover:border-secondary/50 transition-colors duration-300">
                  {/* Frame border lines resembling slide frame */}
                  <div className="absolute top-0 bottom-0 left-2 right-2 border-x border-white/5"></div>
                  <div className="relative z-10">
                    <div className="mb-2 text-2xl text-secondary">{frame.icon}</div>
                    <span className="block font-serif text-sm text-white font-medium tracking-wide mb-1">{frame.title}</span>
                    <span className="block text-[9px] text-accent-muted uppercase tracking-widest">{frame.label}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Film Strip Footer (Sprocket Holes) */}
        <div className="absolute bottom-2 left-0 w-full flex justify-around opacity-20 select-none pointer-events-none">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="w-3.5 h-2 bg-white rounded-sm"></div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <div className="text-center mb-16">
          <span className="text-xs tracking-[0.25em] text-secondary uppercase font-semibold">Submission</span>
          <h2 className="font-serif text-3xl md:text-5xl text-white mt-2">Festival Categories</h2>
          <p className="text-xs md:text-sm text-accent-muted font-light tracking-wide max-w-xl mx-auto mt-4">
            We celebrate artistic diversity through multiple dedicated categories. Ensure your film fits one of our primary genres.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <div key={idx} className="border border-white/5 bg-primary-light p-8 rounded-sm hover:border-secondary/30 transition-all duration-300 flex flex-col justify-between">
              <div>
                {cat.icon}
                <h3 className="font-serif text-lg text-white mb-3 tracking-wide">{cat.title}</h3>
                <p className="text-xs text-accent-muted font-light leading-relaxed">{cat.desc}</p>
              </div>
            </div>
          ))}
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

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {awards.map((award, idx) => (
              <div
                key={idx}
                className="border border-white/5 bg-black p-6 rounded-sm text-center flex flex-col items-center justify-center hover:border-secondary/20 transition-all duration-300"
              >
                <i className="fa-solid fa-trophy text-secondary text-xl mb-3"></i>
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



      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-serif text-3xl md:text-5xl text-white mb-6">
          Showcase Your <span className="text-gold-gradient font-italic font-normal">Story</span>
        </h2>
        <p className="text-xs md:text-sm text-accent-muted font-light leading-relaxed max-w-xl mx-auto mb-8">
          Have an upcoming project or film you want to submit? Or want to partner with us for sponsorship and co-curating? Initiate the dialogue today.
        </p>
        <Link
          to="/contact"
          className="px-8 py-3 bg-black hover:bg-gold-gradient text-secondary hover:text-black font-semibold text-xs tracking-widest uppercase border border-secondary transition-all duration-300 rounded-sm inline-block font-sans"
        >
          Get In Touch
        </Link>
      </section>
    </div>
  );
}
