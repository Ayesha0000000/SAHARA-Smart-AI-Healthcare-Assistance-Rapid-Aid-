import { useState } from 'react';
import { Link } from 'react-router-dom';
import { doctors, specialistMap, homeTreatment, precautions } from '../data/data';

const API = 'http://localhost:8000';

const SEV_STYLE = {
  High:   'bg-red-50 text-red-700 border-red-300',
  Medium: 'bg-amber-50 text-amber-700 border-amber-300',
  Low:    'bg-green-50 text-green-700 border-green-300',
};
const SEV_BAR = { High:'#dc2626', Medium:'#f59e0b', Low:'#0a7c5c' };

function getSeverity(disease) {
  const high   = ['heart attack','paralysis','stroke','pneumonia','tuberculosis','aids','hepatitis','meningitis'];
  const medium = ['dengue','typhoid','malaria','diabetes','hypertension','asthma','jaundice','peptic'];
  const d = (disease||'').toLowerCase();
  if (high.some(h => d.includes(h)))   return 'High';
  if (medium.some(m => d.includes(m))) return 'Medium';
  return 'Low';
}

function getLocalDoctors(specialist) {
  if (!specialist) return [];
  return doctors.filter(d =>
    d.specialization.toLowerCase().includes(specialist.toLowerCase()) ||
    specialist.toLowerCase().includes(d.specialization.split(' ')[0].toLowerCase())
  ).slice(0, 4);
}

function getHomeTreatment(disease) {
  if (!disease) return null;
  const d = disease.trim();
  return homeTreatment[d] || homeTreatment[Object.keys(homeTreatment).find(k => d.toLowerCase().includes(k.toLowerCase()))] || null;
}

function getPrecautions(disease) {
  if (!disease) return precautions.default;
  const d = disease.trim();
  return precautions[d] || precautions[Object.keys(precautions).find(k => d.toLowerCase().includes(k.toLowerCase()))] || precautions.default;
}

export default function AICheck() {
  const [step, setStep]           = useState(1);
  const [checkType, setCheckType] = useState(null);
  const [text, setText]           = useState('');
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  const analyse = async () => {
    if (!text.trim()) return;
    setLoading(true); setError('');
    try {
      const endpoint = checkType === 'quick' ? '/predict/step1' : '/predict/step2';
      const body = checkType === 'quick'
        ? { symptoms: text.split(',').map(s => s.trim().toLowerCase()).filter(Boolean) }
        : { symptom_text: text };

      const res = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();

      const severity    = getSeverity(data.disease);
      const localDocs   = getLocalDoctors(data.specialist);
      const homeAdvice  = getHomeTreatment(data.disease);
      const precaution  = getPrecautions(data.disease);

      setResult({ type:checkType, disease:data.disease, specialist:data.specialist,
        confidence:Math.round(data.confidence * 100), severity, model:data.model,
        localDocs, homeAdvice, precaution });
      setStep(3);
    } catch {
      setError('⚠️ Backend not reachable.\nRun: cd backend && uvicorn app.main:app --reload');
    } finally { setLoading(false); }
  };

  const reset = () => { setStep(1); setCheckType(null); setText(''); setResult(null); setError(''); };

  const StepDots = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1,2,3].map(s => (
        <div key={s} className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
            ${step >= s ? 'bg-primary-500 text-white shadow-md shadow-primary-200' : 'bg-slate-100 text-slate-400'}`}>{s}</div>
          {s < 3 && <div className={`w-10 h-px ${step > s ? 'bg-primary-400' : 'bg-slate-200'}`}/>}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen pt-20 sm:pt-28 pb-20 bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        <div className="text-center mb-8 animate-slide-up">
          <p className="text-primary-500 text-xs font-semibold uppercase tracking-[3px] mb-3">AI-Powered Analysis</p>
          <h1 className="font-display text-2xl sm:text-4xl font-bold text-slate-900 mb-3">
            Health <span className="gradient-text">Symptom Checker</span>
          </h1>
          <p className="text-slate-400 text-sm">Describe how you feel — our AI will analyse and guide you.</p>
        </div>

        <StepDots />

        {/* STEP 1 */}
        {step === 1 && (
          <div className="animate-slide-up">
            <h2 className="text-slate-700 font-semibold text-center mb-6 text-sm">Choose Analysis Type</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <button onClick={() => { setCheckType('quick'); setStep(2); }}
                className="group border-2 border-slate-200 hover:border-primary-400 rounded-2xl p-6 text-left transition-all hover:shadow-lg">
                <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center mb-4 group-hover:bg-primary-500 transition-colors">
                  <svg className="w-5 h-5 text-primary-500 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <h3 className="font-bold text-slate-800 text-base mb-1">Quick Check</h3>
                <p className="text-slate-400 text-sm mb-3">Enter comma-separated symptoms for instant prediction.</p>
                {['Instant result','Disease + specialist','Local Attock doctors','Home treatment tips'].map(t => (
                  <div key={t} className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0"></span> {t}
                  </div>
                ))}
                <span className="mt-3 inline-block text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-200">Random Forest ML</span>
              </button>

              <button onClick={() => { setCheckType('advanced'); setStep(2); }}
                className="group border-2 border-slate-200 hover:border-blue-400 rounded-2xl p-6 text-left transition-all hover:shadow-lg">
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                  <svg className="w-5 h-5 text-blue-500 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                  </svg>
                </div>
                <h3 className="font-bold text-slate-800 text-base mb-1">Advanced AI Check</h3>
                <p className="text-slate-400 text-sm mb-3">Describe in full detail for deep neural analysis.</p>
                {['Full symptom text','Confidence score','Precautions listed','Matching specialists'].map(t => (
                  <div key={t} className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></span> {t}
                  </div>
                ))}
                <span className="mt-3 inline-block text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">ANN Deep Learning</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="animate-slide-up space-y-4">
            <div className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-2.5 h-2.5 rounded-full ${checkType === 'quick' ? 'bg-primary-500' : 'bg-blue-500'}`}/>
                <span className="text-slate-600 text-sm font-medium">
                  {checkType === 'quick' ? 'Quick Check — Random Forest' : 'Advanced AI Check — Deep Learning'}
                </span>
              </div>
              <h2 className="text-slate-800 font-semibold mb-1">
                {checkType === 'quick' ? 'Enter your symptoms' : 'Describe symptoms in detail'}
              </h2>
              <p className="text-slate-400 text-sm mb-4">
                {checkType === 'quick'
                  ? 'Separate symptoms with commas.  e.g: fever, cough, headache, body pain'
                  : 'Describe how you feel — mention duration, location of pain, fever level etc.'}
              </p>
              <textarea value={text} onChange={e => setText(e.target.value)} rows={5}
                placeholder={checkType === 'quick'
                  ? 'fever, headache, body pain, cough, fatigue, nausea...'
                  : 'e.g. I have high fever for 2 days, severe headache, body aches and chills. Feeling very weak...'}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 placeholder-slate-400 outline-none focus:border-primary-300 text-sm leading-relaxed resize-none"/>
              <div className="flex justify-between mt-2">
                <p className="text-slate-400 text-xs">{checkType === 'quick' ? 'Separate with commas' : 'More detail = better accuracy'}</p>
                <span className={`text-xs font-medium ${text.length > 10 ? 'text-primary-500' : 'text-slate-300'}`}>{text.length} chars</span>
              </div>
            </div>

            {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-xs whitespace-pre-line">{error}</div>}

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:border-slate-300 transition-all">← Back</button>
              <button onClick={analyse} disabled={loading || text.trim().length < 3}
                className="flex-1 py-3.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm shadow-lg shadow-primary-200 disabled:opacity-50 flex items-center justify-center gap-2 transition-all">
                {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> Analysing...</> : '🔬 Run AI Analysis'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Result */}
        {step === 3 && result && (
          <div className="animate-slide-up space-y-4">

            {/* Main prediction */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-2 h-2 rounded-full ${result.type === 'quick' ? 'bg-primary-500' : 'bg-blue-500'}`}/>
                <span className={`text-xs font-semibold uppercase tracking-wider ${result.type === 'quick' ? 'text-primary-600' : 'text-blue-600'}`}>
                  {result.type === 'quick' ? 'Quick Check Result' : 'Advanced AI Analysis'}
                </span>
                <span className="ml-auto text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{result.model}</span>
              </div>

              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-slate-400 text-xs mb-1">Predicted Condition</p>
                  <h2 className="font-display text-2xl font-bold text-slate-900">{result.disease}</h2>
                </div>
                <span className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border ${SEV_STYLE[result.severity]}`}>
                  {result.severity} Severity
                </span>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                  <span>AI Confidence</span>
                  <span className="font-bold" style={{color: SEV_BAR[result.severity]}}>{result.confidence}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="h-2 rounded-full transition-all duration-700"
                    style={{width:`${result.confidence}%`, backgroundColor: SEV_BAR[result.severity]}}/>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 bg-primary-50 border border-primary-100 rounded-xl">
                <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-primary-400 text-xs">Recommended Specialist</p>
                  <p className="text-primary-800 font-bold text-sm">{result.specialist}</p>
                </div>
              </div>
            </div>

            {/* Home Treatment */}
            {result.homeAdvice && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                <p className="font-semibold text-green-800 mb-2 flex items-center gap-2 text-sm">
                  🏠 Home Treatment
                </p>
                <p className="text-green-700 text-sm leading-relaxed">{result.homeAdvice}</p>
              </div>
            )}

            {/* Precautions */}
            {result.precaution && result.precaution.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <p className="font-semibold text-amber-800 mb-3 flex items-center gap-2 text-sm">
                  🛡️ Precautions
                </p>
                <div className="space-y-2">
                  {result.precaution.map((p, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</span>
                      <p className="text-amber-700 text-sm">{p}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Local Attock Doctors */}
            {result.localDocs && result.localDocs.length > 0 && (
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-slate-700 font-semibold text-sm">Available Doctors in Attock</p>
                  <span className="text-xs text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full border border-primary-100">📍 Near You</span>
                </div>
                <div className="space-y-3">
                  {result.localDocs.map(doc => (
                    <div key={doc.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <img src={doc.image} alt={doc.name} className="w-11 h-11 rounded-xl object-cover flex-shrink-0 bg-slate-100"/>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-800 font-semibold text-sm truncate">{doc.name}</p>
                        <p className="text-primary-500 text-xs">{doc.specialization}</p>
                        <p className="text-slate-400 text-xs">{doc.hospital} · {doc.city}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <p className="text-slate-700 text-xs font-bold">Rs. {doc.fee}</p>
                        <a href={`https://wa.me/92${doc.whatsapp?.replace(/^0/, '')}`} target="_blank" rel="noreferrer"
                          className="text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-lg font-semibold transition-all">
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-slate-400 text-xs text-center px-4 leading-relaxed">
              ⚠️ AI analysis is for guidance only. Always consult a qualified doctor for proper diagnosis.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <Link to="/doctors" className="py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm text-center transition-all shadow-md shadow-primary-200">Find Doctors</Link>
              <Link to="/emergency" className="py-3 rounded-xl border-2 border-red-200 text-red-600 font-semibold text-sm text-center hover:bg-red-50 transition-all">Emergency</Link>
            </div>
            <button onClick={reset} className="w-full py-3 rounded-xl border border-slate-200 text-slate-500 text-sm font-medium hover:border-slate-300 transition-all">← Start Over</button>
          </div>
        )}
      </div>
    </div>
  );
}
