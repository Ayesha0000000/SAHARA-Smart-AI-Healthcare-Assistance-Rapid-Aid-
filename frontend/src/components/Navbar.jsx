import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'AI Health Check', path: '/ai-check' },
    { name: 'Doctors', path: '/doctors' },
    { name: 'Hospitals', path: '/hospitals' },
    { name: 'Emergency', path: '/emergency' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl shadow-sm border-b border-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center">
            <svg className="sahara-logo-icon w-9 h-9 sm:w-10 sm:h-10" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 24 C8 14, 16 8, 20 14" stroke="#0a7c5c" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.7"/>
              <path d="M40 24 C40 14, 32 8, 28 14" stroke="#0a7c5c" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.7"/>
              <polyline points="6,24 14,24 17,16 20,32 23,20 26,28 29,24 42,24" stroke="#0a7c5c" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" className="sahara-pulse-line"/>
            </svg>
          </div>
          <span className="font-display font-bold text-lg sm:text-xl tracking-widest text-slate-800">
            SAHA<span className="text-primary-500">RA</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-7">
          {links.map((l) => (
            <Link key={l.path} to={l.path}
              className={`nav-link text-sm font-medium tracking-wide transition-colors duration-200 ${
                location.pathname === l.path ? 'text-primary-500' : 'text-slate-600 hover:text-primary-500'
              }`}>{l.name}</Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link to="/emergency"
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-200 text-red-600 text-sm font-semibold bg-red-50 hover:bg-red-100 transition-all">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            Emergency
          </Link>
          <Link to="/ai-check"
            className="btn-primary px-4 py-2 rounded-full text-white text-sm font-semibold shadow-lg shadow-primary-500/25">
            Check Symptoms
          </Link>
        </div>

        {/* Mobile right side */}
        <div className="flex lg:hidden items-center gap-2">
          <Link to="/emergency"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red-200 text-red-600 text-xs font-semibold bg-red-50">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            SOS
          </Link>
          <button
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className={`w-5 h-0.5 bg-slate-700 mb-1.5 transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
            <div className={`w-5 h-0.5 bg-slate-700 mb-1.5 transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-5 h-0.5 bg-slate-700 transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-primary-100 px-4 py-3 shadow-lg">
          {links.map((l) => (
            <Link key={l.path} to={l.path}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center py-3 font-medium border-b border-slate-100 text-sm transition-colors ${
                location.pathname === l.path ? 'text-primary-500' : 'text-slate-600'
              }`}>
              {l.name}
            </Link>
          ))}
          <div className="pt-3 pb-1">
            <Link to="/ai-check" onClick={() => setMenuOpen(false)}
              className="block w-full btn-primary py-3 rounded-xl text-white font-semibold text-sm text-center">
              Check Symptoms
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
