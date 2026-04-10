import { useState } from 'react';
import { hospitals, doctors } from '../data/data';

// Professional hospital images from Unsplash (real hospital photos)
const HOSP_IMAGES = [
  'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&h=400&fit=crop',
];

const getHospImg = (index) => HOSP_IMAGES[index % HOSP_IMAGES.length];

const TYPE_COLORS = {
  Public:   'bg-blue-600',
  Private:  'bg-primary-600',
  Military: 'bg-slate-700',
};

// Google Maps embed URL for a single hospital pin
const googleEmbedUrl = (h) =>
  `https://maps.google.com/maps?q=${h.lat},${h.lng}&z=15&output=embed`;

// Google Maps embed URL showing all hospitals (overview)
const googleOverviewEmbedUrl = () =>
  `https://maps.google.com/maps?q=hospitals+in+Attock+District+Pakistan&z=11&output=embed`;

// Google Maps directions/search URL
const googleDirUrl = (h) =>
  `https://www.google.com/maps/search/${encodeURIComponent(h.name + ' ' + h.city + ' Pakistan')}`;

export default function Hospitals() {
  const [selected, setSelected]     = useState(null);
  const [search, setSearch]         = useState('');
  const [filterEmerg, setFilterEmerg] = useState(false);

  const filtered = hospitals.filter(h => {
    const ms = !search ||
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.city.toLowerCase().includes(search.toLowerCase()) ||
      h.specializations.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const me = !filterEmerg || h.emergency;
    return ms && me;
  });

  // ── Hospital Detail ───────────────────────────────────────
  if (selected) {
    const h = hospitals.find(h => h.id === selected);
    const idx = hospitals.indexOf(h);
    const hDocs = doctors.filter(d => h.doctorIds.includes(d.id));

    return (
      <div className="min-h-screen pt-20 sm:pt-28 pb-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setSelected(null)}
            className="flex items-center gap-2 text-primary-500 hover:text-primary-600 mb-8 text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
            Back to Hospitals
          </button>

          <div className="space-y-5 animate-slide-up">

            {/* Hero */}
            <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
              <div className="relative h-64">
                <img src={getHospImg(idx)} alt={h.name} className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/>
                <div className="absolute bottom-6 left-7">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold text-white ${TYPE_COLORS[h.type] || 'bg-primary-600'}`}>
                      {h.type}
                    </span>
                    {h.emergency && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white">🚨 Emergency 24/7</span>
                    )}
                  </div>
                  <h2 className="text-white font-display text-3xl font-bold mb-1">{h.name}</h2>
                  <p className="text-slate-300 text-sm">📍 {h.address}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-100 bg-white">
                {[
                  { val: h.beds,       label: 'Total Beds' },
                  { val: h.feeRange ? `Rs. ${h.feeRange}` : 'N/A', label: 'Fee Range' },
                  { val: hDocs.length, label: 'Doctors' },
                  { val: h.phone,      label: 'Contact', small: true },
                ].map((m, i) => (
                  <div key={i} className="p-5 text-center">
                    <p className={`font-bold text-primary-600 ${m.small ? 'text-sm' : 'text-2xl'}`}>{m.val}</p>
                    <p className="text-slate-400 text-xs mt-1">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Specializations */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6">
              <h3 className="text-slate-700 font-semibold mb-4 text-sm uppercase tracking-wider">Specializations</h3>
              <div className="flex flex-wrap gap-2">
                {h.specializations.map(s => (
                  <span key={s} className="px-4 py-1.5 rounded-full text-sm bg-primary-50 border border-primary-100 text-primary-600 font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Doctors */}
            {hDocs.length > 0 && (
              <div className="bg-white border border-slate-100 rounded-2xl p-6">
                <h3 className="text-slate-700 font-semibold mb-4 text-sm uppercase tracking-wider">Available Doctors</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {hDocs.map(doc => {
                    const waNumber = `92${(doc.whatsapp || '03001234567').replace(/^0/, '')}`;
                    const waMsg = encodeURIComponent(
                      `Assalamu Alaikum Dr. ${doc.name.split(' ').slice(-1)[0]}, I found your profile on SAHARA. I would like to book an appointment.`
                    );
                    return (
                      <div key={doc.id} className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <img
                          src={doc.image} alt={doc.name}
                          className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-white shadow"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-800 font-semibold text-sm truncate">{doc.name}</p>
                          <p className="text-primary-500 text-xs">{doc.specialization}</p>
                          <p className="text-slate-400 text-xs">Rs. {doc.fee}</p>
                        </div>
                        <div className="flex flex-col gap-1.5 flex-shrink-0">
                          <div className={`w-2 h-2 rounded-full mx-auto ${doc.available ? 'bg-primary-500' : 'bg-slate-300'}`}/>
                          <a
                            href={`https://wa.me/${waNumber}?text=${waMsg}`}
                            target="_blank" rel="noreferrer"
                            className="text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-lg font-semibold"
                          >
                            WA
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Google Map — Detail View ── */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-700 font-semibold text-sm uppercase tracking-wider">Location</h3>
                <a
                  href={googleDirUrl(h)}
                  target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold rounded-xl transition-all"
                >
                  🗺️ Get Directions
                </a>
              </div>

              {/* Google Maps iframe — single hospital pin */}
              <div className="h-56 rounded-xl overflow-hidden border border-slate-100">
                <iframe
                  title={`map-${h.id}`}
                  src={googleEmbedUrl(h)}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                />
              </div>

              <p className="text-slate-400 text-xs mt-2 text-center">📍 {h.address}</p>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ── Hospital List ─────────────────────────────────────────
  return (
    <div className="min-h-screen pt-20 sm:pt-28 pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10 animate-slide-up">
          <p className="text-primary-500 text-xs font-semibold uppercase tracking-[3px] mb-3">Attock District</p>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-slate-900 mb-4">
            Hospitals & <span className="gradient-text">Medical Centres</span>
          </h1>
          <p className="text-slate-400 text-base">{hospitals.length} registered facilities across Attock District.</p>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              placeholder="Search by name, city or specialization..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 outline-none focus:border-primary-400 text-sm transition-all"
            />
          </div>
          <button
            onClick={() => setFilterEmerg(f => !f)}
            className={`px-5 py-3 rounded-xl text-sm font-semibold border transition-all flex items-center gap-2
              ${filterEmerg
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-red-300 hover:text-red-600'}`}
          >
            🚨 Emergency Only
          </button>
        </div>

        {/* ── Google Map — Overview (all hospitals area) ── */}
        <div className="rounded-2xl overflow-hidden border border-slate-100 mb-8 shadow-sm" style={{ height: 280 }}>
          <iframe
            title="hospitals-overview-map"
            src={googleOverviewEmbedUrl()}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
          />
        </div>

        {/* Hospital Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((h, i) => (
            <div
              key={h.id}
              className="card-hover bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm animate-slide-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={getHospImg(hospitals.indexOf(h))}
                  alt={h.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  {h.emergency && (
                    <span className="px-2.5 py-1 rounded-full bg-red-600 text-white text-xs font-bold">🚨 Emergency</span>
                  )}
                  <span className={`px-2.5 py-1 rounded-full text-white text-xs font-bold ${TYPE_COLORS[h.type] || 'bg-primary-600'}`}>
                    {h.type}
                  </span>
                </div>

                {/* City */}
                <div className="absolute bottom-3 left-4">
                  <p className="text-white font-bold text-sm">📍 {h.city}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-slate-900 font-bold text-base mb-1 leading-tight">{h.name}</h3>
                <p className="text-slate-400 text-xs mb-3 truncate">{h.address}</p>

                <div className="flex gap-3 text-xs text-slate-500 mb-3">
                  <span>🛏️ {h.beds} beds</span>
                  <span>📞 {h.phone !== 'N/A' ? h.phone : 'N/A'}</span>
                </div>

                {/* Specializations */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {h.specializations.slice(0, 3).map(s => (
                    <span key={s} className="px-2.5 py-1 rounded-full text-xs bg-primary-50 text-primary-600 border border-primary-100">
                      {s}
                    </span>
                  ))}
                  {h.specializations.length > 3 && (
                    <span className="px-2.5 py-1 rounded-full text-xs bg-slate-100 text-slate-500">
                      +{h.specializations.length - 3}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setSelected(h.id)}
                  className="w-full btn-primary py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-all"
                >
                  View Details & Doctors
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-sm">No hospitals found. Try a different search.</p>
          </div>
        )}

      </div>
    </div>
  );
}