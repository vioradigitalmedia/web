import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const [isLightMode, setIsLightMode] = useState(() => {
    return document.documentElement.classList.contains('light-mode');
  });

  const toggleLightMode = () => {
    const nextMode = !isLightMode;
    setIsLightMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add('light-mode');
      document.body.classList.add('light-mode');
      localStorage.setItem('viora-theme', 'light');
    } else {
      document.documentElement.classList.remove('light-mode');
      document.body.classList.remove('light-mode');
      localStorage.setItem('viora-theme', 'dark');
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('viora-theme');
    if (savedTheme === 'light') {
      setIsLightMode(true);
      document.documentElement.classList.add('light-mode');
      document.body.classList.add('light-mode');
    }
  }, []);

  const navItems: { path: string; label: string; isComingSoon?: boolean }[] = [
    { path: '/', label: 'Home' },
    { path: '/aboutus', label: 'About Us' },
    { path: '/festivals', label: 'Festivals' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-secondary/20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo and Brand */}
        <Link 
          to="/"
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setIsMenuOpen(false)}
        >
          <img 
            src="/logo.jpg" 
            alt="Viora Media Logo" 
            className="h-12 w-12 object-contain rounded-md border border-secondary/35 group-hover:border-secondary transition-colors duration-300"
          />
          <div className="flex flex-col">
            <span className="font-serif tracking-[0.25em] text-lg font-semibold text-white group-hover:text-secondary transition-colors duration-300">
              VIORA
            </span>
            <span className="text-[9px] tracking-[0.4em] text-secondary font-medium -mt-1 uppercase">
              Media
            </span>
          </div>
        </Link>

        {/* Desktop Navigation & CTA Button grouped together on the right */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              if (item.isComingSoon) {
                return (
                  <div key={item.label} className="relative flex flex-col items-center select-none cursor-not-allowed gap-0.5">
                    <span className="text-sm font-medium tracking-widest uppercase text-accent-muted/40">
                      {item.label}
                    </span>
                    <span className="text-[8px] tracking-[0.2em] uppercase font-semibold text-secondary">
                      Coming Soon
                    </span>
                  </div>
                );
              }
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative py-2 text-sm font-medium tracking-widest uppercase transition-colors duration-300 ${
                    isActive 
                      ? 'text-secondary' 
                      : 'text-accent-muted hover:text-white'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-secondary shadow-[0_0_8px_#C5A059]" />
                  )}
                </Link>
              );
            })}
          </nav>

          <button 
            onClick={toggleLightMode}
            title={isLightMode ? "Switch to Dark Mode" : "Switch to Light Mode"}
            aria-label="Toggle Theme"
            className="p-1 text-secondary hover:text-secondary-light transition-all duration-300 transform hover:scale-110 focus:outline-none cursor-pointer flex items-center justify-center"
          >
            <i className={`${isLightMode ? 'fa-regular' : 'fa-solid'} fa-circle-play text-xl`}></i>
          </button>

          <Link 
            to="/contact"
            className="relative px-6 py-2.5 text-xs font-semibold tracking-widest uppercase border border-secondary text-secondary hover:text-black hover:bg-gold-gradient transition-all duration-300 rounded-sm hover:shadow-[0_0_15px_rgba(197,160,89,0.4)] inline-block text-center"
          >
            Get In Touch
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white hover:text-secondary focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-black/95 border-b border-secondary/20 py-6 px-6 flex flex-col gap-4 animate-fade-in">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            if (item.isComingSoon) {
              return (
                <div key={item.label} className="flex flex-col items-start py-2 select-none cursor-not-allowed gap-0.5">
                  <span className="text-sm font-medium tracking-widest uppercase text-accent-muted/40">
                    {item.label}
                  </span>
                  <span className="text-[8px] tracking-[0.2em] uppercase font-semibold text-secondary">
                    Coming Soon
                  </span>
                </div>
              );
            }
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`text-left py-2 text-sm font-medium tracking-widest uppercase transition-colors duration-300 ${
                  isActive ? 'text-secondary' : 'text-accent-muted hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="flex items-center justify-between py-2 border-t border-secondary/10 mt-1">
            <span className="text-xs uppercase tracking-widest text-accent-muted">Switch Theme</span>
            <button 
              onClick={toggleLightMode}
              aria-label="Toggle Theme"
              className="p-2 text-secondary hover:text-secondary-light transition-all duration-300 focus:outline-none flex items-center gap-2 cursor-pointer"
            >
              <i className={`${isLightMode ? 'fa-regular' : 'fa-solid'} fa-circle-play text-xl`}></i>
              <span className="text-xs font-semibold uppercase tracking-wider">{isLightMode ? 'Dark' : 'Light'}</span>
            </button>
          </div>
          <Link 
            to="/contact"
            onClick={() => setIsMenuOpen(false)}
            className="mt-2 w-full py-3 text-xs font-semibold tracking-widest uppercase text-center border border-secondary text-secondary hover:bg-secondary hover:text-black transition-all duration-300 inline-block"
          >
            Get In Touch
          </Link>
        </div>
      )}
    </header>
  );
}
