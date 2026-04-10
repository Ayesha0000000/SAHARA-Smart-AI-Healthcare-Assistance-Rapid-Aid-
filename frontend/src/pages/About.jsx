export default function About() {
  return (
    <div className="min-h-screen pt-20 sm:pt-28 pb-16 bg-white">
      <div className="max-w-4xl mx-auto px-8">
        <div className="text-center mb-16 animate-slide-up">
          <p className="text-primary-500 text-xs font-semibold uppercase tracking-[3px] mb-3">About the Project</p>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-slate-900 mb-5">
            Smart AI Healthcare<br/>
            <span className="gradient-text">Assistance & Rapid Aid</span>
          </h1>
          <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">
            A final-year computer science project designed to transform healthcare access across Attock District, Punjab, Pakistan — powered by machine learning and real-time GPS navigation.
          </p>
        </div>

        <div className="space-y-5">
          <div className="bg-white border border-red-100 rounded-2xl p-8 shadow-sm">
            <h2 className="text-slate-800 font-display font-bold text-xl mb-4 flex items-center gap-3">
              <span className="w-1 h-6 rounded bg-red-500 block flex-shrink-0"></span>
              The Problem
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">
              Attock is a district in Punjab, Pakistan, with a population exceeding 1.5 million. Despite having several hospitals and clinics, patients face critical barriers to access:
            </p>
            <ul className="space-y-2 text-slate-500 text-sm">
              {['No centralized platform to find the right specialist by symptom or location','Patients lose critical time during emergencies navigating to hospitals without guidance','No AI-guided preliminary health assessment for rural populations','Limited healthcare literacy compounds delays in seeking appropriate care','No online appointment or hospital navigation system exists locally'].map(p => (
                <li key={p} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0"></span>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-primary-100 rounded-2xl p-8 shadow-sm">
            <h2 className="text-slate-800 font-display font-bold text-xl mb-4 flex items-center gap-3">
              <span className="w-1 h-6 rounded bg-primary-500 block flex-shrink-0"></span>
              The Solution
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-5">
              SAHARA integrates AI diagnostics, emergency navigation, and a verified local healthcare directory into a single unified platform built specifically for Attock.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {title:'AI Symptom Checker',desc:'Random Forest and ANN models analyse symptoms across 41 disease classifications.'},
                {title:'Emergency GPS',desc:'Live location detection with routing to the nearest hospital in Attock District.'},
                {title:'Doctor Directory',desc:'Verified physician profiles with specializations, experience, and availability.'},
                {title:'Hospital Registry',desc:'Detailed hospital profiles — services, contacts, emergency availability.'},
              ].map(f => (
                <div key={f.title} className="p-4 rounded-xl bg-primary-50 border border-primary-100">
                  <p className="text-slate-800 font-semibold text-sm mb-1">{f.title}</p>
                  <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
            <h2 className="text-slate-800 font-display font-bold text-xl mb-6 flex items-center gap-3">
              <span className="w-1 h-6 rounded bg-accent-500 block flex-shrink-0"></span>
              Technology Stack
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                {cat:'Frontend',items:['React (Vite)','Tailwind CSS','React Router','Leaflet.js']},
                {cat:'Backend',items:['FastAPI (Python)','Firebase Auth','Firestore DB','Render / Railway']},
                {cat:'AI & ML',items:['Random Forest (Sklearn)','ANN (TensorFlow/Keras)','Kaggle Disease Dataset','41 Disease Classes']},
              ].map(t => (
                <div key={t.cat} className="p-5 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-primary-600 font-semibold text-xs uppercase tracking-wider mb-3">{t.cat}</p>
                  <ul className="space-y-1.5">
                    {t.items.map(item => (
                      <li key={item} className="text-slate-500 text-xs flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-primary-400 flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
            <h2 className="text-slate-800 font-display font-bold text-xl mb-6 flex items-center gap-3">
              <span className="w-1 h-6 rounded bg-primary-500 block flex-shrink-0"></span>
              Developer
            </h2>
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-primary-500 flex items-center justify-center text-white font-display font-bold text-xl flex-shrink-0">A</div>
              <div>
                <p className="text-slate-900 font-bold text-lg">Ayesha</p>
                <p className="text-primary-500 text-sm">Final Year CS Student — SAHARA Project Lead</p>
                <div className="flex gap-3 mt-2">
                  <a href="mailto:gmayesha2004@gmail.com" className="text-xs text-slate-400 hover:text-primary-500 transition-colors">gmayesha2004@gmail.com</a>
                  <a href="https://github.com/Ayesha0000000" target="_blank" rel="noreferrer" className="text-xs text-slate-400 hover:text-primary-500 transition-colors">GitHub</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
