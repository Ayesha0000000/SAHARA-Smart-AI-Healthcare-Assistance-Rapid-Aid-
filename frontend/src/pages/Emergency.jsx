import { useState } from 'react';
import { hospitals } from '../data/data';

const getDist = (a, b, c, d) => {
  const R = 6371, dLat = (c - a) * Math.PI / 180, dLng = (d - b) * Math.PI / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(a * Math.PI / 180) * Math.cos(c * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
};

const HOTLINES = [
  { label: 'Rescue 1122', num: '1122',         icon: '🚑', style: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'     },
  { label: 'Police 15',   num: '15',           icon: '👮', style: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'   },
  { label: 'Edhi 115',    num: '115',          icon: '🚐', style: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' },
  { label: 'DHQ Attock',  num: '057-2615511',  icon: '🏥', style: 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'  },
  { label: 'Marham',      num: '0311-1222398', icon: '📞', style: 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'  },
];

const INCIDENTS = [
  { icon: '🚗', label: 'Accident' },
  { icon: '💔', label: 'Heart Pain' },
  { icon: '😮', label: 'Breathing' },
  { icon: '🤕', label: 'Injury' },
  { icon: '🧠', label: 'Stroke' },
  { icon: '🤒', label: 'Other' },
];

export default function Emergency() {
  const [loc, setLoc]               = useState(null);
  const [incident, setIncident]     = useState('');
  const [results, setResults]       = useState([]);
  const [searching, setSearching]   = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [locMsg, setLocMsg]         = useState('');
  const [locMsgType, setLocMsgType] = useState('');
  const [activeMap, setActiveMap]   = useState(null);

  const detectLoc = () => {
    setGpsLoading(true); setLocMsg('');
    if (!navigator.geolocation) {
      setLoc({ lat: 33.7665, lng: 72.3601, label: 'Attock City (Default)', gps: false });
      setLocMsg('GPS not supported — using Attock City center.');
      setLocMsgType('warn');
      setGpsLoading(false); return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude, label: 'Your GPS Location', gps: true });
        setLocMsg('GPS location detected successfully!');
        setLocMsgType('success');
        setGpsLoading(false);
      },
      () => {
        setLoc({ lat: 33.7665, lng: 72.3601, label: 'Attock City (Default)', gps: false });
        setLocMsg('GPS unavailable — using Attock City center.');
        setLocMsgType('warn');
        setGpsLoading(false);
      }
    );
  };

  const findHospitals = () => {
    if (!loc) return;
    setSearching(true); setResults([]); setActiveMap(null);
    setTimeout(() => {
      const sorted = hospitals
        .map(h => ({ ...h, distance: getDist(loc.lat, loc.lng, h.lat, h.lng) }))
        .sort((a, b) => a.distance - b.distance);
      setResults(sorted);
      setActiveMap(sorted[0]?.id || null);
      setSearching(false);
    }, 1000);
  };

  const nearest = results[0];
  const uLat = loc?.lat || 33.7665;
  const uLng = loc?.lng || 72.3601;

  const googleDirUrl   = (h) => `https://www.google.com/maps/dir/${uLat},${uLng}/${h.lat},${h.lng}`;
  const googleEmbedUrl = (h) => `https://maps.google.com/maps?q=${h.lat},${h.lng}&z=15&output=embed`;

  return (
    <div className="min-h-screen bg-white">

      {/* ─── PAGE HEADER — matches website style ─── */}
      <div className="pt-20 pb-8 px-4 border-b border-slate-100">
        <div className="max-w-6xl mx-auto">

          {/* Top label */}
          <p className="text-center text-xs font-bold tracking-[0.15em] text-emerald-600 uppercase mb-3">
            Emergency Services
          </p>

          {/* Title */}
          <h1 className="text-center text-4xl sm:text-5xl font-bold text-slate-900 mb-2">
            Emergency{' '}
            <span className="text-emerald-600">Navigation</span>
          </h1>
          <p className="text-center text-slate-400 text-sm mb-8">
            Find the nearest hospital instantly — call emergency hotlines below.
          </p>

          {/* Live indicator + hotline pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {/* Pulse badge */}
            <span className="flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-3 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Live
            </span>

            {HOTLINES.map(h => (
              <a
                key={h.num}
                href={`tel:${h.num}`}
                className={`flex items-center gap-1.5 border text-xs font-semibold px-3 py-2 rounded-full transition-all ${h.style}`}
              >
                <span>{h.icon}</span>
                {h.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ─── BODY ─── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-8">

          {/* ══════════ LEFT COLUMN ══════════ */}
          <div className="space-y-5">

            {/* STEP 1 — Incident */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">1</span>
                <h3 className="text-slate-800 font-semibold text-sm">What is the emergency?</h3>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                {INCIDENTS.map(opt => (
                  <button
                    key={opt.label}
                    onClick={() => setIncident(opt.label)}
                    className={`py-3 px-2 rounded-xl text-xs font-semibold border transition-all text-center
                      ${incident === opt.label
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-emerald-200 hover:text-emerald-600'}`}
                  >
                    <span className="block text-base mb-1">{opt.icon}</span>
                    {opt.label}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={incident}
                onChange={e => setIncident(e.target.value)}
                placeholder="Or describe the situation..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 placeholder-slate-400 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 text-sm transition-all"
              />
            </div>

            {/* STEP 2 — Location */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">2</span>
                <h3 className="text-slate-800 font-semibold text-sm">Detect your location</h3>
              </div>

              <button
                onClick={detectLoc}
                disabled={gpsLoading}
                className="w-full py-3 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50 text-emerald-700 font-semibold text-sm hover:bg-emerald-100 transition-all flex items-center justify-center gap-2 disabled:opacity-60 mb-3"
              >
                {gpsLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    Detecting GPS...
                  </>
                ) : (
                  '📍 Use my current location (GPS)'
                )}
              </button>

              {locMsg && (
                <p className={`text-xs text-center font-medium mb-3 ${locMsgType === 'success' ? 'text-emerald-600' : 'text-amber-500'}`}>
                  {locMsgType === 'success' ? '✓' : '⚠'} {locMsg}
                </p>
              )}

              {loc && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
                  <span className="text-emerald-600 text-sm">📍</span>
                  <span className="text-emerald-800 text-sm font-medium flex-1">{loc.label}</span>
                  {loc.gps && (
                    <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">GPS ✓</span>
                  )}
                </div>
              )}
            </div>

            {/* FIND BUTTON */}
            <button
              onClick={findHospitals}
              disabled={searching || !loc}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-100 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {searching ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Finding nearest hospitals...
                </>
              ) : (
                '🏥 Find Nearest Hospital Now'
              )}
            </button>

            {/* RESULTS */}
            {results.length > 0 && (
              <div className="space-y-3">
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  {results.length} hospitals — sorted by distance
                </p>

                {results.slice(0, 8).map((h, i) => (
                  <div
                    key={h.id}
                    className={`bg-white border rounded-2xl p-4 shadow-sm transition-all
                      ${activeMap === h.id ? 'border-emerald-300 ring-2 ring-emerald-50' : 'border-slate-100'}
                      ${i === 0 ? 'border-l-4 border-l-red-400' : ''}`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-xl
                        ${i === 0 ? 'bg-red-50' : 'bg-slate-50'}`}>
                        🏥
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="text-slate-800 font-bold text-sm">{h.name}</p>
                          {i === 0 && (
                            <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">Nearest</span>
                          )}
                          {h.emergency && (
                            <span className="text-xs bg-orange-50 text-orange-600 border border-orange-200 px-2 py-0.5 rounded-full font-semibold">Emergency</span>
                          )}
                        </div>
                        <p className="text-slate-400 text-xs mb-1 truncate">📍 {h.address}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-emerald-600 text-xs font-bold">📏 {h.distance.toFixed(1)} km</span>
                          <span className="text-slate-400 text-xs">🚗 ~{Math.ceil(h.distance / 0.5)} min</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <a
                        href={googleDirUrl(h)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5"
                      >
                        🗺️ View Directions
                      </a>
                      <button
                        onClick={() => setActiveMap(activeMap === h.id ? null : h.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all
                          ${activeMap === h.id
                            ? 'bg-slate-100 text-slate-600 border-slate-200'
                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-emerald-300 hover:text-emerald-600'}`}
                      >
                        {activeMap === h.id ? 'Hide Map' : 'Show Map'}
                      </button>
                      {h.phone && h.phone !== 'N/A' && (
                        <a
                          href={`tel:${h.phone}`}
                          className="px-3 py-2 rounded-xl border border-red-200 text-red-500 text-xs font-bold hover:bg-red-50 transition-all"
                        >
                          📞
                        </a>
                      )}
                    </div>

                    {activeMap === h.id && (
                      <div className="mt-3 rounded-xl overflow-hidden border border-slate-200" style={{ height: 200 }}>
                        <iframe
                          title={h.name}
                          width="100%" height="100%"
                          style={{ border: 0 }}
                          loading="lazy"
                          allowFullScreen
                          src={googleEmbedUrl(h)}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ══════════ RIGHT COLUMN ══════════ */}
          <div className="space-y-5">

            {/* ── Before search: How it works + Emergency hospitals ── */}
            {results.length === 0 && (
              <>
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                  <p className="text-xs font-bold tracking-[0.12em] text-emerald-600 uppercase mb-5">How It Works</p>
                  {[
                    { num: '01', icon: '📍', title: 'Detect location', desc: 'Click GPS button to get your exact current location automatically.' },
                    { num: '02', icon: '🏥', title: 'Find nearest hospital', desc: 'Calculates distance to all Attock hospitals and sorts by proximity.' },
                    { num: '03', icon: '🗺️', title: 'Get directions', desc: 'Open Google Maps with turn-by-turn navigation instantly.' },
                    { num: '04', icon: '📞', title: 'Call ahead', desc: 'Call the hospital before arriving so they can prepare for you.' },
                  ].map(s => (
                    <div key={s.num} className="flex items-start gap-4 mb-5 last:mb-0">
                      <span className="text-3xl font-black text-slate-100 leading-none flex-shrink-0 select-none">{s.num}</span>
                      <div>
                        <p className="text-slate-800 font-semibold text-sm mb-0.5">{s.icon} {s.title}</p>
                        <p className="text-slate-400 text-xs leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                  <p className="text-xs font-bold tracking-[0.12em] text-emerald-600 uppercase mb-4">Emergency Hospitals in Attock</p>
                  <div className="space-y-2">
                    {hospitals.filter(h => h.emergency).map(h => (
                      <div key={h.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-lg flex-shrink-0">🏥</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-800 font-semibold text-xs truncate">{h.name}</p>
                          <p className="text-slate-400 text-xs">📍 {h.city}</p>
                        </div>
                        {h.phone && h.phone !== 'N/A' && (
                          <a
                            href={`tel:${h.phone}`}
                            className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg font-bold flex-shrink-0 transition-all"
                          >
                            📞 Call
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── After search: Nearest hero + map ── */}
            {nearest && (
              <>
                {/* Nearest hero card */}
                <div className="bg-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-100">
                  <p className="text-emerald-200 text-xs font-bold uppercase tracking-wider mb-3">Nearest Hospital</p>
                  <h3 className="text-white font-bold text-xl mb-1">{nearest.name}</h3>
                  <p className="text-emerald-100 text-sm mb-5">📍 {nearest.address}</p>

                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                      <p className="text-white font-bold text-lg">{nearest.distance.toFixed(1)}</p>
                      <p className="text-emerald-200 text-xs">km away</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                      <p className="text-white font-bold text-lg">{Math.ceil(nearest.distance / 0.5)}</p>
                      <p className="text-emerald-200 text-xs">min drive</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                      <p className="text-white font-bold text-lg">{nearest.emergency ? '✅' : '❌'}</p>
                      <p className="text-emerald-200 text-xs">Emergency</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <a
                      href={googleDirUrl(nearest)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-3 rounded-xl bg-white text-emerald-700 font-bold text-sm text-center hover:bg-emerald-50 transition-all"
                    >
                      🗺️ Open Google Maps
                    </a>
                    {nearest.phone && nearest.phone !== 'N/A' && (
                      <a
                        href={`tel:${nearest.phone}`}
                        className="px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm transition-all"
                      >
                        📞 Call
                      </a>
                    )}
                  </div>
                </div>

                {/* Google Map embed */}
                <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <p className="text-slate-700 font-semibold text-sm truncate">📍 {nearest.name}</p>
                    <a
                      href={googleDirUrl(nearest)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-emerald-600 font-bold hover:underline flex-shrink-0 ml-2"
                    >
                      Full Map →
                    </a>
                  </div>
                  <iframe
                    title="nearest-map"
                    width="100%" height="280"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={googleEmbedUrl(nearest)}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}