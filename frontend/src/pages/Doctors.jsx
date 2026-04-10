import { useState } from 'react';
import { doctors } from '../data/data';

const specs = ['All', ...new Set(doctors.map(d => d.specialization))];
const accentColors = ['#0a7c5c','#1a5276','#7b241c','#6c3483','#1a5632','#784212'];

export default function Doctors() {
  const [filter, setFilter]   = useState('All');
  const [search, setSearch]   = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = doctors.filter(d => {
    const ms = filter === 'All' || d.specialization === filter;
    const mq = !search ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization.toLowerCase().includes(search.toLowerCase()) ||
      d.city.toLowerCase().includes(search.toLowerCase());
    return ms && mq;
  });

  // ── Doctor Detail View ────────────────────────────────────
  if (selected) {
    const doc = doctors.find(d => d.id === selected);
    const waNumber = `92${(doc.whatsapp||'03001234567').replace(/^0/, '')}`;
    const waMsg = encodeURIComponent(`Assalamu Alaikum Dr. ${doc.name.split(' ').slice(-1)[0]}, I found your profile on SAHARA Health App. I would like to book an appointment. Please let me know your availability.`);

    return (
      <div className="min-h-screen pt-20 sm:pt-28 pb-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <button onClick={() => setSelected(null)}
            className="flex items-center gap-2 text-primary-500 hover:text-primary-600 mb-8 text-sm font-medium transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
            Back to Doctors
          </button>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100 p-8 animate-slide-up">
            <div className="flex flex-col md:flex-row gap-8 items-start">

              {/* Profile Image */}
              <div className="flex-shrink-0 text-center">
                <div className="w-36 h-36 rounded-full border-4 border-primary-100 shadow-lg overflow-hidden bg-slate-100">
                  <img src={doc.image} alt={doc.name} className="w-full h-full object-cover"/>
                </div>
                <div className={`mt-3 inline-block px-4 py-1 rounded-full text-xs font-bold
                  ${doc.available ? 'bg-primary-50 text-primary-600 border border-primary-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                  {doc.available ? '🟢 Available' : '🔴 Unavailable'}
                </div>
                {doc.pmdc && (
                  <div className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200">
                    ✓ PMDC Verified
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h2 className="font-display text-2xl font-bold text-slate-900 mb-0.5">{doc.name}</h2>
                <p className="text-primary-500 font-semibold mb-0.5">{doc.specialization}</p>
                <p className="text-slate-400 text-sm mb-1">{doc.qualification}</p>
                <p className="text-slate-400 text-sm mb-5">{doc.hospital} · {doc.city}</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                  <div className="p-3 rounded-xl bg-primary-50 border border-primary-100 text-center">
                    <p className="text-primary-600 font-bold text-lg">{doc.experience}</p>
                    <p className="text-slate-400 text-xs">Experience</p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 text-center">
                    <p className="text-amber-600 font-bold text-lg">Rs. {doc.fee}</p>
                    <p className="text-slate-400 text-xs">Consultation</p>
                  </div>
                  {doc.satisfaction !== 'N/A' && (
                    <div className="p-3 rounded-xl bg-green-50 border border-green-100 text-center">
                      <p className="text-green-600 font-bold text-lg">{doc.satisfaction}</p>
                      <p className="text-slate-400 text-xs">Satisfaction</p>
                    </div>
                  )}
                </div>

                <p className="text-slate-500 text-sm leading-relaxed mb-5">{doc.about}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {doc.videoConsult && <span className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold rounded-full">📹 Video Consult</span>}
                  <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-semibold rounded-full">📍 {doc.city}</span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-semibold rounded-full">{doc.gender}</span>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 flex-wrap">
                  <a href={`https://wa.me/${waNumber}?text=${waMsg}`} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition-all shadow-md shadow-green-100">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.091.538 4.06 1.48 5.776L0 24l6.395-1.677C8.088 23.254 9.994 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.856 0-3.596-.485-5.1-1.334l-.363-.215-3.795.995.995-3.688-.24-.38A9.946 9.946 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                    </svg>
                    WhatsApp
                  </a>
                  <a href={`tel:${doc.whatsapp}`}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:border-primary-300 hover:text-primary-600 transition-all">
                    📞 Call
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Doctor List ────────────────────────────────────────────
  return (
    <div className="min-h-screen pt-20 sm:pt-28 pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-10 sm:mb-14 animate-slide-up">
          <p className="text-primary-500 text-xs font-semibold uppercase tracking-[3px] mb-3">Verified Professionals</p>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-slate-900 mb-4">
            Find the Right <span className="gradient-text">Specialist</span>
          </h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            {doctors.length} verified doctors across Attock District — filter by specialty.
          </p>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input type="text" placeholder="Search by name, specialization or city..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 outline-none focus:border-primary-400 text-sm transition-all"/>
          </div>
          <div className="flex gap-2 flex-wrap">
            {specs.slice(0, 8).map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all
                  ${filter===s ? 'bg-primary-500 border-primary-500 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-primary-300 hover:text-primary-600'}`}>
                {s === 'All' ? 'All Specialties' : s}
              </button>
            ))}
          </div>
        </div>

        {/* Doctor Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((doc, i) => {
            const waNumber = `92${(doc.whatsapp||'03001234567').replace(/^0/, '')}`;
            const waMsg = encodeURIComponent(`Assalamu Alaikum Dr. ${doc.name.split(' ').slice(-1)[0]}, I found your profile on SAHARA Health App. I would like to book an appointment.`);
            return (
              <div key={doc.id} className="animate-slide-up" style={{animationDelay:`${i*40}ms`}}>
                <div className="doctor-tag bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all">

                  {/* Image */}
                  <div className="relative bg-gradient-to-b from-slate-100 to-slate-50 h-48 flex items-center justify-center cursor-pointer" onClick={() => setSelected(doc.id)}>
                    <img src={doc.image} alt={doc.name} className="h-36 w-36 object-cover rounded-full border-4 border-white shadow-md"/>
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {doc.pmdc && <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-semibold">PMDC ✓</span>}
                      {doc.videoConsult && <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full font-semibold">Video</span>}
                    </div>
                    <div className={`absolute top-3 right-3 w-3 h-3 rounded-full border-2 border-white ${doc.available ? 'bg-primary-500' : 'bg-slate-400'}`}/>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="w-8 h-0.5 rounded mb-2" style={{background: accentColors[i % accentColors.length]}}/>
                    <h3 className="text-slate-900 font-bold text-base mb-0.5 cursor-pointer hover:text-primary-600 transition-colors" onClick={() => setSelected(doc.id)}>{doc.name}</h3>
                    <p className="text-primary-500 text-sm font-medium mb-0.5">{doc.specialization}</p>
                    <p className="text-slate-400 text-xs mb-1">{doc.hospital}</p>
                    <p className="text-slate-400 text-xs mb-3">📍 {doc.city} · {doc.experience} exp</p>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-slate-700 text-sm font-bold">Rs. {doc.fee}</span>
                      <div className="flex gap-2">
                        <button onClick={() => setSelected(doc.id)}
                          className="px-3 py-1.5 rounded-lg bg-primary-50 text-primary-600 text-xs font-semibold border border-primary-100 hover:bg-primary-100 transition-all">
                          View
                        </button>
                        <a href={`https://wa.me/${waNumber}?text=${waMsg}`} target="_blank" rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-green-500 text-white text-xs font-semibold hover:bg-green-600 transition-all flex items-center gap-1">
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.091.538 4.06 1.48 5.776L0 24l6.395-1.677C8.088 23.254 9.994 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.856 0-3.596-.485-5.1-1.334l-.363-.215-3.795.995.995-3.688-.24-.38A9.946 9.946 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                          </svg>
                          Chat
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-sm">No doctors found. Try a different search.</p>
          </div>
        )}
      </div>
    </div>
  );
}