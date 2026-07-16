import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="w-full bg-black border-t border-white/5">

      {/* Above Footer Quote Section */}
      <div className="w-full py-16 text-center bg-black border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <p className="font-serif italic text-lg md:text-xl text-gold-gradient tracking-wide leading-relaxed">
            “Every frame begins with a vision. Every story deserves to be seen.”
          </p>
        </div>
      </div>

      {/* Main Footer Container */}
      <footer className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-8 text-accent-muted">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-16">

          {/* Left Column (Brand) - Spans 1 column on tablet/desktop */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-3 cursor-pointer group">
              <img
                src="/logo.jpg"
                alt="Viora Logo"
                className="h-10 w-10 object-contain rounded-md border border-secondary/20 group-hover:border-secondary transition-colors duration-300"
              />
              <div className="flex flex-col">
                <span className="font-serif tracking-[0.25em] text-md font-semibold text-white">
                  VIORA
                </span>
                <span className="text-[8px] tracking-[0.4em] text-secondary font-medium -mt-1 uppercase">
                  Media
                </span>
              </div>
            </Link>

            <p className="text-secondary text-[10px] tracking-widest uppercase font-semibold font-serif mt-2">
              Where Every Story Finds Its Stage.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="text-left">
            <h4 className="text-white font-serif tracking-widest text-xs uppercase mb-4 border-b border-secondary/20 pb-2">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2 text-xs font-light">
              <li>
                <Link to="/" className="hover:text-secondary transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/aboutus" className="hover:text-secondary transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li className="relative group">
                <span className="text-accent-muted/40 cursor-not-allowed flex items-center justify-between">
                  <span>Festivals</span>
                  <span className="text-[7px] bg-zinc-900 border border-secondary/20 text-secondary px-1 py-0.5 rounded-sm">Soon</span>
                </span>
              </li>
              <li className="relative group">
                <span className="text-accent-muted/40 cursor-not-allowed flex items-center justify-between">
                  <span>Workshops</span>
                  <span className="text-[7px] bg-zinc-900 border border-secondary/20 text-secondary px-1 py-0.5 rounded-sm">Soon</span>
                </span>
              </li>
              <li className="relative group">
                <span className="text-accent-muted/40 cursor-not-allowed flex items-center justify-between">
                  <span>Gallery</span>
                  <span className="text-[7px] bg-zinc-900 border border-secondary/20 text-secondary px-1 py-0.5 rounded-sm">Soon</span>
                </span>
              </li>
              <li className="relative group">
                <span className="text-accent-muted/40 cursor-not-allowed flex items-center justify-between">
                  <span>Blog / News</span>
                  <span className="text-[7px] bg-zinc-900 border border-secondary/20 text-secondary px-1 py-0.5 rounded-sm">Soon</span>
                </span>
              </li>
              <li>
                <Link to="/contact" className="hover:text-secondary transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Community Column */}
          <div className="text-left">
            <h4 className="text-white font-serif tracking-widest text-xs uppercase mb-4 border-b border-secondary/20 pb-2">
              Community
            </h4>
            <ul className="flex flex-col gap-2 text-xs font-light text-accent-muted/40 cursor-not-allowed">
              <li className="flex items-center justify-between">
                <span>Become a Volunteer</span>
                <span className="text-[7px] bg-zinc-900 border border-secondary/20 text-secondary px-1 py-0.5 rounded-sm">Soon</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Partner With Us</span>
                <span className="text-[7px] bg-zinc-900 border border-secondary/20 text-secondary px-1 py-0.5 rounded-sm">Soon</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Sponsor a Festival</span>
                <span className="text-[7px] bg-zinc-900 border border-secondary/20 text-secondary px-1 py-0.5 rounded-sm">Soon</span>
              </li>
              <li className="flex items-center justify-between">
                <span>FAQs</span>
                <span className="text-[7px] bg-zinc-900 border border-secondary/20 text-secondary px-1 py-0.5 rounded-sm">Soon</span>
              </li>
            </ul>
          </div>

          {/* Contact & Follow Us */}
          <div className="text-left flex flex-col justify-between h-full">
            <div>
              <h4 className="text-white font-serif tracking-widest text-xs uppercase mb-4 border-b border-secondary/20 pb-2">
                Contact
              </h4>
              <p className="text-xs font-light leading-relaxed mb-3 flex items-center gap-2.5">
                <i className="fa-solid fa-location-dot text-secondary w-4 text-center"></i> <span>Chennai, Tamil Nadu, India</span>
              </p>
              <p className="text-xs font-light leading-relaxed mb-3 flex items-center gap-2.5">
                <i className="fa-solid fa-envelope text-secondary w-4 text-center"></i> <a href="mailto:vioradigitalmedia@gmail.com" className="hover:text-secondary transition-colors duration-200 break-all">vioradigitalmedia@gmail.com</a>
              </p>
            </div>

            {/* Follow Us */}
            <div className="mt-4">
              <span className="block text-white text-[10px] tracking-widest uppercase font-semibold mb-3">
                Follow Us
              </span>
              <div className="flex gap-4">
                <a href="#instagram" className="hover:text-secondary text-base transition-colors duration-200" aria-label="Instagram">
                  <i className="fa-brands fa-instagram"></i>
                </a>
                <a href="#youtube" className="hover:text-secondary text-base transition-colors duration-200" aria-label="YouTube">
                  <i className="fa-brands fa-youtube"></i>
                </a>
                <a href="#linkedin" className="hover:text-secondary text-base transition-colors duration-200" aria-label="LinkedIn">
                  <i className="fa-brands fa-linkedin-in"></i>
                </a>
                <a href="#x" className="hover:text-secondary text-base transition-colors duration-200" aria-label="X (Twitter)">
                  <i className="fa-brands fa-x-twitter"></i>
                </a>
                <a href="#facebook" className="hover:text-secondary text-base transition-colors duration-200" aria-label="Facebook">
                  <i className="fa-brands fa-facebook-f"></i>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] tracking-widest uppercase">
          <p className="text-accent-muted/50 text-center sm:text-left">
            &copy; {currentYear} Viora. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/privacy-policy" className="hover:text-secondary transition-colors duration-200">Privacy Policy</Link>
            <a href="#terms" className="hover:text-secondary transition-colors duration-200">Terms & Conditions</a>
            <a href="#cookies" className="hover:text-secondary transition-colors duration-200">Cookie Policy</a>
          </div>
        </div>

      </footer>

    </div>
  );
}
