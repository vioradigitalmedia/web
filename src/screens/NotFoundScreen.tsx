import { Link } from 'react-router-dom';
import { useSeo } from '../hooks/useSeo';

export default function NotFoundScreen() {
  useSeo({
    title: '404 - Scene Omitted | Viora Media',
    description: 'The page you are looking for has been omitted from the final cut or relocated. Return to the main stage.'
  });

  return (
    <div className="w-full min-h-[75vh] flex items-center justify-center bg-black px-6 text-center relative overflow-hidden">
      {/* Background Spotlight Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-secondary/5 rounded-full blur-[90px] pointer-events-none animate-pulse-slow"></div>

      <div className="max-w-md mx-auto z-10 flex flex-col items-center">
        {/* Animated Clapperboard/Icon placeholder or cinema theme */}
        <div className="mb-8 w-20 h-20 rounded-full border border-secondary/30 flex items-center justify-center text-secondary bg-secondary/5 shadow-[0_0_20px_rgba(197,160,89,0.1)]">
          <i className="fa-solid fa-triangle-exclamation text-3xl animate-bounce" style={{ animationDuration: '2s' }}></i>
        </div>

        {/* 404 Header */}
        <span className="text-[10px] tracking-[0.4em] text-secondary font-semibold uppercase mb-3">Error Code: 404</span>
        <h1 className="font-serif text-6xl md:text-8xl text-white tracking-tight leading-none mb-6">
          Lost in <br />
          the <span className="text-gold-gradient font-italic font-normal">Cut</span>
        </h1>

        {/* Subtext */}
        <p className="text-sm text-accent-muted font-light leading-relaxed mb-10 max-w-sm">
          The scene you are looking for has been omitted from the final edit, or the link has expired.
        </p>

        {/* Action Button */}
        <Link
          to="/"
          className="px-8 py-3 bg-black hover:bg-gold-gradient text-secondary hover:text-black font-semibold text-xs tracking-widest uppercase border border-secondary transition-all duration-300 rounded-sm font-sans flex items-center gap-2"
        >
          <i className="fa-solid fa-arrow-left text-[10px]"></i>
          Return to Main Stage
        </Link>
      </div>
    </div>
  );
}
