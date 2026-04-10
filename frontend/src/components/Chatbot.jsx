import { useState, useRef, useEffect } from 'react';
import { doctors, hospitals } from '../data/data';

// ── SAHARA Chatbot Knowledge Base ──────────────────────────────
function getSAHARAResponse(msg) {
  const q = msg.toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|salam|assalam|hey|heyy|aoa|whats up|wassup|good morning|good evening)/.test(q))
    return `Assalamu Alaikum! 👋 Welcome to SAHARA — Smart AI Healthcare Assistance & Rapid Aid for Attock District.\n\nI can help you with:\n• 🔬 AI Symptom Checker\n• 🏥 Hospital information\n• 👨‍⚕️ Doctor search\n• 🚨 Emergency contacts\n• 📅 Appointment guidance\n\nHow can I assist you today?`;

  // SAHARA info
  if (/what is sahara|about sahara|sahara kya|project/.test(q))
    return `SAHARA stands for **Smart AI Healthcare Assistance & Rapid Aid**.\n\nIt's an AI-powered healthcare platform built for Attock District, Pakistan. It offers:\n• Two-step AI symptom checker (Random Forest + ANN)\n• Local hospital & doctor registry\n• Emergency GPS navigation\n• WhatsApp appointment booking\n\nBuilt by Ayesha for Buildables AI Fellowship 2025 🎓`;

  // Symptom / AI Check
  if (/symptom|ai check|check|bimari|disease|diagnosis|check karo|feel/.test(q))
    return `Our AI Symptom Checker has **2 modes**:\n\n⚡ **Quick Check** (Random Forest ML)\n→ Enter symptoms as keywords\n→ Get instant disease prediction\n→ See matching Attock doctors\n\n🧠 **Advanced AI Check** (Deep Learning ANN)\n→ Describe symptoms in detail\n→ Get confidence score + precautions\n→ Home treatment tips included\n\nGo to **AI Check** page to start! 🔬`;

  // Emergency
  if (/emergency|ambulance|accident|urgent|1122|help|rescue/.test(q))
    return `🚨 **EMERGENCY CONTACTS — ATTOCK**\n\n📞 Rescue 1122: **1122**\n📞 Police: **15**\n📞 Edhi Foundation: **115**\n📞 DHQ Hospital Attock: **057-2615511**\n📞 Marham Helpline: **0311-1222398**\n\nGo to the **Emergency** page to find the nearest hospital with GPS navigation and Google Maps directions! 🗺️`;

  // Doctors search
  if (/doctor|physician|specialist|surgeon|gynae|neuro|dent|psych|pulmon/.test(q)) {
    const spec = q.includes('gynae') || q.includes('gynecol') ? 'Gynecologist'
      : q.includes('neuro') ? 'Neuro Surgeon'
      : q.includes('dent') ? 'Dentist'
      : q.includes('psych') ? 'Psychologist'
      : q.includes('pulmon') ? 'Pulmonologist'
      : q.includes('ortho') ? 'Orthopedic Surgeon'
      : q.includes('surgeon') ? 'General Surgeon'
      : null;

    if (spec) {
      const found = doctors.filter(d => d.specialization.toLowerCase().includes(spec.toLowerCase())).slice(0, 3);
      if (found.length > 0) {
        let resp = `👨‍⚕️ **${spec}s in Attock:**\n\n`;
        found.forEach(d => {
          resp += `• **${d.name}** — ${d.hospital}, ${d.city} | Rs. ${d.fee}\n`;
        });
        resp += `\nVisit **Doctors** page for full list & WhatsApp booking! 📱`;
        return resp;
      }
    }
    return `We have **${doctors.length} verified doctors** in Attock across specializations:\n\nGeneral Physician, Dentist, Gynecologist, Neuro Surgeon, Orthopedic Surgeon, Pulmonologist, Psychologist, Dermatologist, General Surgeon, and more!\n\nVisit the **Doctors** page to filter by specialization or search by name. Each doctor has a WhatsApp button for direct appointment booking! 📱`;
  }

  // Hospitals
  if (/hospital|clinic|center|centre|hopital/.test(q)) {
    const emerHosp = hospitals.filter(h => h.emergency).slice(0, 4);
    let resp = `🏥 **Attock District has ${hospitals.length} registered hospitals.**\n\n🚨 **Emergency Hospitals:**\n`;
    emerHosp.forEach(h => {
      resp += `• **${h.name}** — ${h.city} | ${h.phone}\n`;
    });
    resp += `\nVisit the **Hospitals** page for full details, maps, and doctor listings!`;
    return resp;
  }

  // Specific hospital search
  if (/dhq|district headquarters/.test(q)) {
    const h = hospitals.find(x => x.id === 'HOS027');
    return h ? `🏥 **${h.name}**\n📍 ${h.address}\n📞 ${h.phone}\n🚨 Emergency: Yes\n🛏️ Beds: ${h.beds}\n\n**Specialists:** ${h.specializations.join(', ')}\n\n[View Directions on Google Maps](https://www.google.com/maps/search/${encodeURIComponent(h.name + ' Attock')})` : "DHQ Hospital Attock is on Kamra Road. Call 042-32380080.";
  }

  if (/cmh|army|military/.test(q))
    return `🏥 **CMH Attock Hospital** (Military)\n📍 Near Army Public School, Cantt, Attock\n📞 057-2615511\n🚨 Emergency: Yes | 🛏️ 200 beds\n\nSpecialties: Surgery, Pediatrics, Gynae, ENT, Eye, ICU\n\nNote: Primarily for military personnel and families.`;

  // Appointment booking
  if (/appointment|book|booking|milna|milein|contact/.test(q))
    return `📅 **How to Book Appointments in SAHARA:**\n\n1. Go to **Doctors** page\n2. Find your required specialist\n3. Click the **WhatsApp** button\n4. A pre-written message will open — send it!\n5. The doctor's clinic will confirm your appointment\n\nAlternatively, call **Marham Helpline: 0311-1222398** for assistance. 📞`;

  // Fee / cost
  if (/fee|fees|cost|charges|paisa|kitna|price/.test(q))
    return `💰 **Doctor Consultation Fees in Attock:**\n\n• General Physician: Rs. 400–950\n• Dentist: Rs. 500–1,500\n• Gynecologist: Rs. 1,000\n• Neuro Surgeon: Rs. 1,000–2,000\n• Orthopedic Surgeon: Rs. 500–1,200\n• Psychologist: Rs. 1,000–5,000\n• Pulmonologist: Rs. 1,000\n\nFees may vary. Check the **Doctors** page for exact fees per doctor.`;

  // WhatsApp
  if (/whatsapp|watsapp|message|msg/.test(q))
    return `📱 **WhatsApp Booking:**\n\nEvery doctor on SAHARA has a **WhatsApp** button on their profile.\n\nJust:\n1. Click **WhatsApp** on any doctor card\n2. A pre-filled message opens automatically\n3. Send the message to connect with the clinic\n\nVisit the **Doctors** page to start! 👍`;

  // Map / directions
  if (/map|direction|rasta|navigate|location|kahan/.test(q))
    return `🗺️ **Navigation on SAHARA:**\n\n• **Hospitals page**: Shows all 34 hospitals on an interactive map\n• **Emergency page**: GPS-based nearest hospital finder with Google Maps directions\n• Each hospital has a **"View Directions"** button that opens Google Maps with turn-by-turn routing!\n\nGo to **Emergency** page for real-time navigation. 🚗`;

  // Video consult
  if (/video|online|consult|virtual/.test(q)) {
    const vidDocs = doctors.filter(d => d.videoConsult).slice(0, 4);
    let resp = `📹 **Video Consultation Available:**\n\n`;
    vidDocs.forEach(d => { resp += `• **${d.name}** (${d.specialization}) — Rs. ${d.fee}\n`; });
    resp += `\n...and more! Visit **Doctors** page and look for the 📹 Video badge.`;
    return resp;
  }

  // PMDC verified
  if (/pmdc|verified/.test(q)) {
    const count = doctors.filter(d => d.pmdc).length;
    return `✅ **PMDC Verified Doctors:**\n\n${count} out of ${doctors.length} doctors on SAHARA are PMDC (Pakistan Medical & Dental Council) verified.\n\nLook for the **"PMDC ✓"** badge on doctor cards. These doctors are officially registered with Pakistan's medical regulatory authority.`;
  }

  // How it works
  if (/how|kaise|explain|work|steps/.test(q))
    return `⚙️ **How SAHARA Works:**\n\n1. 🔬 **Describe your symptoms** on the AI Check page\n2. 🤖 **AI analyzes** using Random Forest (quick) or ANN (advanced)\n3. 📋 **Get diagnosis** with home treatment & precautions\n4. 👨‍⚕️ **See matching Attock doctors** automatically\n5. 📱 **Book via WhatsApp** directly from the app\n6. 🚨 **Emergency?** Use GPS navigation to nearest hospital\n\nAll completely free! Built for Attock community 🇵🇰`;

  // Thanks / bye
  if (/thank|shukriya|shukria|bye|khuda hafiz|allah hafiz/.test(q))
    return `You're welcome! 😊 Stay healthy and safe.\n\nIf you ever need healthcare assistance in Attock, SAHARA is here for you 24/7. Allah Hafiz! 🤲`;

  // Default
  return `I'm SAHARA's AI assistant — I can help you with:\n\n🔬 **AI Symptom Checker** — Describe your symptoms\n🏥 **Hospitals** — Find hospitals in Attock (${hospitals.length} listed)\n👨‍⚕️ **Doctors** — Find specialists (${doctors.length} doctors)\n🚨 **Emergency** — Nearest hospital + directions\n📅 **Appointments** — WhatsApp booking\n\nTry asking: *"Find me a gynecologist"* or *"Emergency contacts"* or *"How to book appointment"*`;
}

export default function Chatbot() {
  const [open, setOpen]     = useState(false);
  const [msgs, setMsgs]     = useState([
    { from:'bot', text:`Assalamu Alaikum! 👋 I'm SAHARA's AI assistant.\n\nI can help you find doctors, hospitals, book appointments, and navigate emergencies in Attock District.\n\nHow can I help you today?` }
  ]);
  const [input, setInput]   = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({behavior:'smooth'}); }, [msgs, open]);

  const send = () => {
    const txt = input.trim();
    if (!txt) return;
    setMsgs(m => [...m, {from:'user', text:txt}]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setMsgs(m => [...m, {from:'bot', text: getSAHARAResponse(txt)}]);
      setTyping(false);
    }, 800);
  };

  const quickReplies = ['Find a doctor', 'Emergency contacts', 'Book appointment', 'Nearest hospital'];

  return (
    <>
      {/* Toggle Button */}
      <button onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary-500 hover:bg-primary-600 text-white shadow-xl shadow-primary-200/50 flex items-center justify-center transition-all hover:scale-110 active:scale-95">
        {open
          ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl shadow-slate-300/40 border border-slate-100 overflow-hidden flex flex-col" style={{maxHeight:'480px'}}>

          {/* Header */}
          <div className="bg-primary-500 px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/>
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-sm">SAHARA Assistant</p>
              <p className="text-white/70 text-xs">Attock Healthcare Guide</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/>
              <span className="text-white/70 text-xs">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-slate-50">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line
                  ${m.from === 'user'
                    ? 'bg-primary-500 text-white rounded-br-sm'
                    : 'bg-white text-slate-700 border border-slate-100 rounded-bl-sm shadow-sm'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    {[0,1,2].map(i => <span key={i} className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay:`${i*0.15}s`}}/>)}
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef}/>
          </div>

          {/* Quick replies */}
          {msgs.length <= 2 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5 bg-slate-50">
              {quickReplies.map(q => (
                <button key={q} onClick={() => { setInput(q); setTimeout(send, 50); }}
                  className="text-xs px-3 py-1.5 rounded-full bg-white border border-primary-200 text-primary-600 font-medium hover:bg-primary-50 transition-all">
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-slate-100 bg-white flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask about doctors, hospitals..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 placeholder-slate-400 outline-none focus:border-primary-300 transition-all"/>
            <button onClick={send} disabled={!input.trim()}
              className="w-9 h-9 bg-primary-500 hover:bg-primary-600 disabled:opacity-40 rounded-xl flex items-center justify-center transition-all flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
