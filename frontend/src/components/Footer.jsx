import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-10 sm:mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <svg className="sahara-logo-icon w-9 h-9" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 24 C8 14, 16 8, 20 14" stroke="#4ade80" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.7"/>
                <path d="M40 24 C40 14, 32 8, 28 14" stroke="#4ade80" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.7"/>
                <polyline points="6,24 14,24 17,16 20,32 23,20 26,28 29,24 42,24" stroke="#4ade80" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" className="sahara-pulse-line"/>
              </svg>
              <span className="font-display font-bold text-base text-white tracking-widest">SAHA<span className="text-primary-400">RA</span></span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Smart AI Healthcare Assistance & Rapid Aid — serving Attock District, Punjab, Pakistan.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Navigation</h4>
            <div className="space-y-2.5">
              {[['Home','/'],['AI Health Check','/ai-check'],['Doctors','/doctors'],['Hospitals','/hospitals']].map(([n,p]) => (
                <Link key={p} to={p} className="block text-slate-400 text-sm hover:text-primary-400 transition-colors">{n}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Emergency</h4>
            <div className="space-y-2.5 text-sm text-slate-400">
              <p>Rescue: <span className="text-white font-medium">1122</span></p>
              <p>DHQ Attock: <span className="text-white font-medium">057-2615511</span></p>
              <p>Fire Brigade: <span className="text-white font-medium">16</span></p>
              <p>Police: <span className="text-white font-medium">15</span></p>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Contact</h4>
            <div className="space-y-2.5 text-sm text-slate-400">
              <p className="break-all">gmayesha2004@gmail.com</p>
              <p>Attock, Punjab, Pakistan</p>
              <a href="https://github.com/Ayesha0000000/SAHARA-Smart-AI-Healthcare-Assistance-Rapid-Aid"
                target="_blank" rel="noreferrer"
                className="inline-block mt-3 text-primary-400 hover:text-primary-300 transition-colors">
                GitHub Repository
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-slate-500 text-xs text-center sm:text-left">© 2024 SAHARA. Built for Attock Healthcare Access.</p>
          <p className="text-slate-600 text-xs">React · Tailwind CSS · Leaflet.js · AI/ML</p>
        </div>
      </div>
    </footer>
  );
}
