// SAHARA | Navbar — with Firebase Auth
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NAV = [
  { to: '/',          label: 'Home'      },
  { to: '/ai-check',  label: 'AI Check'  },
  { to: '/doctors',   label: 'Doctors'   },
  { to: '/hospitals', label: 'Hospitals' },
  { to: '/emergency', label: 'Emergency' },
  { to: '/about',     label: 'About'     },
];

export default function Navbar() {
  const { user, logout }    = useAuth();
  const [open, setOpen]     = useState(false);
  const [dropOpen, setDrop] = useState(false);
  const location            = useLocation();
  const navigate            = useNavigate();

  const handleLogout = async () => {
    await logout();
    setDrop(false);
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

       {/* Logo */}
    <Link to="/" className="flex items-center gap-3">
  <svg className="w-9 h-9" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 24 C8 14, 16 8, 20 14" stroke="#4ade80" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.7"/>
    <path d="M40 24 C40 14, 32 8, 28 14" stroke="#4ade80" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.7"/>
    <polyline points="6,24 14,24 17,16 20,32 23,20 26,28 29,24 42,24" stroke="#4ade80" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
  <span className="font-bold text-slate-900 text-lg tracking-widest">SAHA<span className="text-primary-500">RA</span></span>
</Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV.map(n => (
            <Link key={n.to} to={n.to}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${location.pathname === n.to
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
              {n.label}
            </Link>
          ))}
        </div>

        {/* Auth Section */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            /* Logged in — show avatar + dropdown */
            <div className="relative">
              <button
                onClick={() => setDrop(p => !p)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-slate-200 hover:border-primary-300 transition-all"
              >
                <img
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=0a7c5c&color=fff`}
                  alt={user.displayName}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <span className="text-slate-700 text-sm font-medium max-w-[100px] truncate">
                  {user.displayName?.split(' ')[0]}
                </span>
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              {dropOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-slate-800 font-semibold text-sm truncate">{user.displayName}</p>
                    <p className="text-slate-400 text-xs truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors mt-1"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Not logged in — show login button */
            <Link to="/login"
              className="px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold shadow-sm shadow-primary-200 transition-all">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(p => !p)} className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
          {NAV.map(n => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${location.pathname === n.to
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-slate-600 hover:bg-slate-50'}`}>
              {n.label}
            </Link>
          ))}

          <div className="pt-2 border-t border-slate-100 mt-2">
            {user ? (
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-2">
                  <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full"/>
                  <span className="text-slate-700 text-sm font-medium">{user.displayName?.split(' ')[0]}</span>
                </div>
                <button onClick={handleLogout} className="text-red-500 text-sm font-medium">Sign out</button>
              </div>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)}
                className="block text-center py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold">
                Sign In with Google
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
