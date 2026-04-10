import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const slides = [
  { img:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1400&h=600&fit=crop', tag:'Attock District Healthcare', title:'DHQ Hospital Attock', desc:'Primary referral hospital serving Attock region' },
  { img:'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=1400&h=600&fit=crop', tag:'Emergency Services', title:'24-Hour Emergency Care', desc:'Round-the-clock critical care and trauma services' },
  { img:'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1400&h=600&fit=crop', tag:'Expert Consultations', title:'Specialist Doctor Network', desc:'Verified physicians across all medical disciplines' },
  { img:'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=1400&h=600&fit=crop', tag:'Patient Care', title:'Compassionate Treatment', desc:'Patient-first approach at every stage of care' },
  { img:'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=1400&h=600&fit=crop', tag:'Modern Facilities', title:'Advanced Medical Equipment', desc:'State-of-the-art diagnostic and treatment infrastructure' },
];

const services = [
  { title:'AI Symptom Analysis', desc:'Describe symptoms in natural language. AI predicts conditions with confidence scoring across 41 disease classifications.', link:'/ai-check' },
  { title:'Emergency Navigation', desc:'Real-time GPS routing to the nearest hospital in Attock with live directions and contact details.', link:'/emergency' },
  { title:'Doctor Directory', desc:'Browse verified Attock physicians filtered by specialization, experience, and current availability.', link:'/doctors' },
  { title:'Hospital Registry', desc:'Comprehensive hospital profiles including services, emergency availability, and contact information.', link:'/hospitals' },
];



export default function Home() {
  const [slide, setSlide] = useState(0);
  const [visible, setVisible] = useState({});
  const refs = useRef({});

  useEffect(() => {
    const t = setInterval(() => setSlide(p => (p+1) % slides.length), 4500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(entries =>
      entries.forEach(e => { if(e.isIntersecting) setVisible(v => ({...v,[e.target.id]:true})); }),
      { threshold:0.12 }
    );
    Object.values(refs.current).forEach(r => r && obs.observe(r));
    return () => obs.disconnect();
  }, []);

  const reg = id => el => { refs.current[id] = el; };

  return (
    <div className="min-h-screen bg-white">

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16 sm:pt-20">
        {slides.map((s,i) => (
          <div key={i} className="absolute inset-0 transition-opacity duration-1500" style={{opacity:i===slide?1:0,zIndex:0}}>
            <img src={s.img} alt={s.title} className="w-full h-full object-cover" style={{transform:i===slide?'scale(1.06)':'scale(1)',transition:'transform 8s ease'}}/>
            <div className="absolute inset-0" style={{backdropFilter:'blur(3px)',background:'rgba(6,30,20,0.52)'}}></div>
          </div>
        ))}
        <div className="absolute inset-0 z-1" style={{background:'linear-gradient(135deg, rgba(6,30,20,0.60) 0%, rgba(10,80,60,0.30) 60%, rgba(6,50,35,0.50) 100%)'}}></div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 pb-28 sm:pb-16 flex flex-col items-start justify-center w-full">
          <div className="animate-slide-left w-full">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-green-200 text-xs font-semibold uppercase tracking-wider mb-6 sm:mb-8 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              AI-Powered Healthcare · Attock, Pakistan
            </div>
            <h1 className="font-display font-bold leading-tight mb-5 sm:mb-6 text-white">
              <span className="block text-4xl sm:text-5xl md:text-6xl">Smart AI</span>
              <span className="block text-4xl sm:text-5xl md:text-6xl" style={{background:'linear-gradient(135deg,#4ade80,#06b6d4)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Healthcare</span>
              <span className="block text-4xl sm:text-5xl md:text-6xl">Assistance</span>
            </h1>
            <p className="text-green-100/80 text-sm sm:text-base leading-relaxed mb-8 sm:mb-10 max-w-md">
              Find the right specialist, navigate to hospitals during emergencies, and receive AI-guided health analysis — built for <span className="text-green-300 font-medium">Attock District</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link to="/ai-check" className="btn-primary px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-white font-semibold text-sm tracking-wide shadow-xl shadow-primary-500/20 text-center">
                Analyse Symptoms
              </Link>
              <Link to="/emergency" className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-full border border-red-300/60 text-red-300 font-semibold text-sm bg-red-900/20 hover:bg-red-800/30 backdrop-blur-sm transition-all text-center">
                Emergency Mode
              </Link>
            </div>
          </div>
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_,i) => (
            <button key={i} onClick={() => setSlide(i)}
              className={`rounded-full transition-all duration-300 ${i===slide?'w-7 h-2 bg-green-400':'w-2 h-2 bg-white/30 hover:bg-white/50'}`}/>
          ))}
        </div>


      </section>

      {/* SERVICES */}
      <section id="services" ref={reg('services')} className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
        <div className={`text-center mb-10 sm:mb-16 transition-all duration-700 ${visible.services?'opacity-100 translate-y-0':'opacity-0 translate-y-6'}`}>
          <p className="text-primary-500 text-xs font-semibold uppercase tracking-[3px] mb-3">Platform Capabilities</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Integrated <span className="gradient-text">Healthcare Services</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed px-4">
            AI diagnostics, emergency navigation, and a verified local directory — unified for Attock.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {services.map((s,i) => (
            <Link key={s.title} to={s.link}
              className={`card-hover group bg-white border border-slate-100 rounded-2xl p-6 sm:p-7 transition-all duration-700 ${visible.services?'opacity-100 translate-y-0':'opacity-0 translate-y-8'}`}
              style={{transitionDelay:`${i*80}ms`}}>
              <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center mb-4 sm:mb-5 group-hover:bg-primary-500 transition-colors">
                <svg className="w-4 h-4 text-primary-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
              </div>
              <h3 className="text-slate-800 font-semibold text-base mb-2">{s.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              <p className="mt-4 text-primary-500 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                Learn more
                <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* AI TECHNOLOGY SECTION */}
      <section id="video" ref={reg('video')} className="relative overflow-hidden" style={{minHeight:400}}>
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1400&h=600&fit=crop" alt="bg" className="w-full h-full object-cover scale-105"/>
          <div className="absolute inset-0 bg-primary-900/82 backdrop-blur-sm"></div>
        </div>
        <div className={`relative max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-20 grid md:grid-cols-2 gap-10 sm:gap-16 items-center transition-all duration-1000 ${visible.video?'opacity-100 translate-y-0':'opacity-0 translate-y-10'}`}>
          <div>
            <p className="text-primary-300 text-xs font-semibold uppercase tracking-[3px] mb-4">AI Technology</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-5 leading-tight">
              Describe Symptoms.<br/>
              <span className="text-primary-300">Receive AI Guidance.</span>
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-8 max-w-md">
              No medical terminology required. Type how you feel in plain language — our models analyse your input against 41 disease classifications and recommend the right specialist within seconds.
            </p>
            <Link to="/ai-check" className="inline-block btn-primary px-7 sm:px-8 py-3 sm:py-3.5 rounded-full text-white font-semibold text-sm tracking-wide">
              Run AI Health Check
            </Link>
          </div>
          <div className={`transition-all duration-1000 delay-300 ${visible.video?'opacity-100 translate-x-0':'opacity-0 translate-x-10'}`}>
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
              <img src="https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=700&h=400&fit=crop" alt="AI Healthcare Technology" className="w-full h-48 sm:h-56 object-cover"/>
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/85 via-primary-900/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 grid grid-cols-2 gap-2">
                {[
                  { icon:'🧬', label:'Disease Classifications' },
                  { icon:'⚡', label:'Instant AI Analysis' },
                  { icon:'👨‍⚕️', label:'Specialist Matching' },
                  { icon:'📍', label:'Hospital Navigation' },
                ].map((f) => (
                  <div key={f.label} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-2.5 sm:px-3 py-2 border border-white/10">
                    <span className="text-sm">{f.icon}</span>
                    <span className="text-white text-xs font-medium leading-tight">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" ref={reg('how')} className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
        <div className={`text-center mb-10 sm:mb-16 transition-all duration-700 ${visible.how?'opacity-100 translate-y-0':'opacity-0 translate-y-6'}`}>
          <p className="text-primary-500 text-xs font-semibold uppercase tracking-[3px] mb-3">Process</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">Three Steps to <span className="gradient-text">Better Care</span></h2>
        </div>
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          {[
            { step:'01', title:'Describe Your Symptoms', desc:'Enter your symptoms in plain language. The more detail you provide, the more accurate the analysis.' },
            { step:'02', title:'AI Analyses Your Input', desc:'Random Forest and ANN models cross-reference symptoms against 41 disease categories to generate a confidence-scored prediction.' },
            { step:'03', title:'Get Directed to Care', desc:'Receive a specialist recommendation, browse matching Attock doctors, and navigate to the right hospital — all in one flow.' },
          ].map((s,i) => (
            <div key={s.step} className={`flex items-start gap-4 sm:gap-5 transition-all duration-700 ${visible.how?'opacity-100 translate-y-0':'opacity-0 translate-y-8'}`} style={{transitionDelay:`${i*120}ms`}}>
              <span className="font-display text-5xl sm:text-6xl font-bold text-primary-100 leading-none flex-shrink-0 select-none">{s.step}</span>
              <div className="pt-2 sm:pt-3">
                <h3 className="text-slate-800 font-semibold text-base sm:text-lg mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-16 sm:pb-24">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-primary-600 px-6 sm:px-12 py-10 sm:py-14">
          <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(circle at 1px 1px,white 1px,transparent 0)',backgroundSize:'24px 24px'}}></div>
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="text-center md:text-left">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">Need urgent medical help?</h2>
              <p className="text-primary-200 text-sm">Activate Emergency Mode — find the nearest hospital with live GPS routing.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-shrink-0 w-full sm:w-auto">
              <Link to="/emergency" className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-white text-primary-700 font-semibold text-sm hover:bg-primary-50 transition-all shadow-lg text-center">Emergency Mode</Link>
              <Link to="/ai-check" className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-full border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-all text-center">Check Symptoms</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
