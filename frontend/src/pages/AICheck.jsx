import { useState } from 'react';
import { Link } from 'react-router-dom';
import { doctors } from '../data/data';

const API = import.meta.env.VITE_API_URL || 'https://ayesh104-sahara-backend.hf.space';
const RELATED_SYMPTOMS = {
  fever: ['headache', 'chills', 'body pain', 'fatigue', 'sweating', 'nausea', 'vomiting', 'loss of appetite'],
  headache: ['nausea', 'vomiting', 'dizziness', 'blurred vision', 'neck pain', 'fatigue', 'fever', 'chills'],
  cough: ['breathlessness', 'chest pain', 'phlegm', 'fever', 'sore throat', 'runny nose', 'fatigue', 'chills'],
  nausea: ['vomiting', 'stomach pain', 'diarrhea', 'loss of appetite', 'fever', 'dizziness', 'fatigue', 'acidity'],
  vomiting: ['nausea', 'stomach pain', 'diarrhea', 'fever', 'dehydration', 'loss of appetite', 'fatigue', 'dizziness'],
  diarrhea: ['stomach pain', 'nausea', 'vomiting', 'fever', 'dehydration', 'fatigue', 'loss of appetite', 'cramps'],
  fatigue: ['weakness', 'dizziness', 'fever', 'loss of appetite', 'headache', 'body pain', 'sweating', 'weight loss'],
  dizziness: ['headache', 'nausea', 'blurred vision', 'loss of balance', 'fatigue', 'vomiting', 'weakness', 'sweating'],
  rash: ['itching', 'fever', 'body pain', 'blister', 'red spots', 'swelling', 'fatigue', 'joint pain'],
  itching: ['rash', 'skin rash', 'blister', 'red spots', 'fever', 'joint pain', 'fatigue', 'skin peeling'],
  'chest pain': ['breathlessness', 'sweating', 'palpitations', 'fatigue', 'dizziness', 'nausea', 'cough', 'fever'],
  'body pain': ['fever', 'fatigue', 'chills', 'headache', 'weakness', 'joint pain', 'muscle pain', 'sweating'],
  'joint pain': ['body pain', 'swelling', 'fatigue', 'fever', 'stiffness', 'muscle pain', 'weakness', 'rash'],
  weakness: ['fatigue', 'dizziness', 'body pain', 'fever', 'loss of appetite', 'weight loss', 'headache', 'nausea'],
  'stomach pain': ['nausea', 'vomiting', 'diarrhea', 'constipation', 'acidity', 'fever', 'loss of appetite', 'bloating'],
  breathlessness: ['chest pain', 'cough', 'fatigue', 'fever', 'sweating', 'palpitations', 'dizziness', 'phlegm'],
  'back pain': ['neck pain', 'joint pain', 'body pain', 'weakness', 'fatigue', 'muscle pain', 'stiffness', 'dizziness'],
  swelling: ['joint pain', 'body pain', 'fatigue', 'fever', 'breathlessness', 'weakness', 'itching', 'rash'],
};

const DEFAULT_RELATED = ['fever', 'headache', 'body pain', 'fatigue', 'nausea', 'chills', 'dizziness', 'weakness'];

function getRelatedSymptoms(inputText) {
  const words = inputText.toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
  const firstSym = words[0];
  if (RELATED_SYMPTOMS[firstSym]) return RELATED_SYMPTOMS[firstSym].filter(s => !words.includes(s));
  for (const key of Object.keys(RELATED_SYMPTOMS)) {
    if (firstSym.includes(key) || key.includes(firstSym))
      return RELATED_SYMPTOMS[key].filter(s => !words.includes(s));
  }
  return DEFAULT_RELATED.filter(s => !words.includes(s));
}

function getLocalDoctors(specialist) {
  if (!specialist) return [];
  return doctors.filter(d =>
    d.specialization.toLowerCase().includes(specialist.toLowerCase()) ||
    specialist.toLowerCase().includes(d.specialization.split(' ')[0].toLowerCase())
  ).slice(0, 4);
}

export default function AICheck() {
  const [step, setStep]                 = useState(1);
  const [checkType, setCheckType]       = useState(null);
  const [text, setText]                 = useState('');
  const [selectedSymptoms, setSelected] = useState([]);
  const [showSuggestions, setShowSug]   = useState(false);
  const [suggestions, setSuggestions]   = useState([]);
  const [result, setResult]             = useState(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');

  const handleNextFromInput = () => {
    const syms = text.split(',').map(s => s.trim()).filter(Boolean);
    if (syms.length === 0) { setError('Please enter at least one symptom.'); return; }
    if (checkType === 'advanced') { analyse(text, []); return; }
    setSelected(syms);
    setSuggestions(getRelatedSymptoms(text).slice(0, 8));
    setShowSug(true);
    setError('');
  };

  const toggleSuggestion = (sym) => {
    setSelected(prev => prev.includes(sym) ? prev.filter(s => s !== sym) : [...prev, sym]);
  };

  const analyse = async (inputText, extraSymptoms) => {
    setLoading(true); setError('');
    try {
      let endpoint, body;
      if (checkType === 'advanced') {
        endpoint = '/predict/step2';
        body = { symptom_text: inputText };
      } else {
        endpoint = '/predict/step1';
        const allSymptoms = [
          ...inputText.split(',').map(s => s.trim().toLowerCase()).filter(Boolean),
          ...extraSymptoms.map(s => s.toLowerCase()),
        ];
        body = { symptoms: [...new Set(allSymptoms)] };
      }

      const res = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();

      setResult({
        type: checkType,
        disease: data.disease,
        specialist: data.specialist,
        confidence: Math.round(data.confidence * 100),
        confidenceLabel: data.confidence_level,
        top3: data.possible_conditions || [],
        category: data.category,
        advice: data.advice,
        note: data.note,
        homeTreatment: data.home_treatment || '',
        precautionsList: data.precautions_list || [],
        warning: data.warning || '',
        severity: data.severity || '',
        model: data.model,
        localDocs: getLocalDoctors(data.specialist),
      });
      setStep(3);
      setShowSug(false);
    } catch {
      setError('Backend not reachable.\nRun: cd backend && uvicorn app.main:app --reload');
    } finally { setLoading(false); }
  };

  const reset = () => {
    setStep(1); setCheckType(null); setText('');
    setSelected([]); setShowSug(false); setSuggestions([]);
    setResult(null); setError('');
  };

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

  const confBg = result?.confidenceLabel === 'High' ? 'bg-green-500'
    : result?.confidenceLabel === 'Medium' ? 'bg-amber-400' : 'bg-red-400';
  const confText = result?.confidenceLabel === 'High' ? 'text-green-600'
    : result?.confidenceLabel === 'Medium' ? 'text-amber-600' : 'text-red-500';
  const confBadge = result?.confidenceLabel === 'High' ? 'bg-green-100 text-green-700'
    : result?.confidenceLabel === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700';

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
                <p className="text-slate-400 text-sm mb-3">Enter your main symptom for a quick result.</p>
                {['Smart symptom detection','Disease + category','Attock doctors','Quick AI advice'].map(t => (
                  <div key={t} className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0"></span>{t}
                  </div>
                ))}
                <span className="mt-3 inline-block text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-200">RF </span>
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
                {['Top 3 conditions','Detailed advice','Home treatment','Warning signs'].map(t => (
                  <div key={t} className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></span>{t}
                  </div>
                ))}
                <span className="mt-3 inline-block text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">ANN</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="animate-slide-up space-y-4">
            {!showSuggestions && (
              <div className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-2.5 h-2.5 rounded-full ${checkType === 'quick' ? 'bg-primary-500' : 'bg-blue-500'}`}/>
                  <span className="text-slate-600 text-sm font-medium">
                    {checkType === 'quick' ? 'Quick Check — RF ' : 'Advanced AI Check — ANN'}
                  </span>
                </div>
                <h2 className="text-slate-800 font-semibold mb-1">
                  {checkType === 'quick' ? 'Enter your symptoms' : 'Describe symptoms in detail'}
                </h2>
                <p className="text-slate-400 text-sm mb-4">
                  {checkType === 'quick'
                    ? 'Separate with commas — e.g. fever, headache, body pain, chills'
                    : 'Describe how you feel — mention duration, location and severity.'}
                </p>
                <textarea
                  value={text}
                  onChange={e => { setText(e.target.value); setError(''); }}
                  rows={checkType === 'quick' ? 3 : 5}
                  placeholder={checkType === 'quick'
                    ? 'e.g. fever\nor: fever, headache, body pain, chills'
                    : 'e.g. I have high fever for 2 days, severe headache, body aches and chills. Feeling very weak...'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 placeholder-slate-400 outline-none focus:border-primary-300 text-sm leading-relaxed resize-none"
                />
                {checkType === 'quick' && (
                  <p className="text-slate-400 text-xs mt-2">Even one symptom works — AI will suggest related ones.</p>
                )}
              </div>
            )}

            {showSuggestions && checkType === 'quick' && (
              <div className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 shadow-sm">
                <h2 className="text-slate-800 font-semibold mb-1">Do you also have any of these?</h2>
                <p className="text-slate-400 text-sm mb-4">Tap to select — more symptoms = better accuracy</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedSymptoms.map(sym => (
                    <span key={sym} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-primary-500 text-white">{sym}</span>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mb-3">Related symptoms — tap to add:</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {suggestions.map(sym => {
                    const isSel = selectedSymptoms.includes(sym);
                    return (
                      <button key={sym} onClick={() => toggleSuggestion(sym)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          isSel ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-slate-600 border-slate-200 hover:border-primary-400'}`}>
                        {isSel ? '✓ ' : '+ '}{sym}
                      </button>
                    );
                  })}
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500">
                    Selected: <span className="font-semibold text-slate-700">{selectedSymptoms.join(', ')}</span>
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-xs whitespace-pre-line">{error}</div>
            )}

            <div className="flex gap-3">
              <button onClick={() => { if (showSuggestions) setShowSug(false); else { setStep(1); setError(''); } }}
                className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:border-slate-300 transition-all">
                Back
              </button>
              {!showSuggestions ? (
                <button onClick={handleNextFromInput} disabled={loading || text.trim().length < 1}
                  className="flex-1 py-3.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm shadow-lg shadow-primary-200 disabled:opacity-50 flex items-center justify-center gap-2 transition-all">
                  {checkType === 'quick' ? 'Next →'
                    : loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> Analysing...</>
                    : 'Run AI Analysis'}
                </button>
              ) : (
                <button
                  onClick={() => analyse(text, selectedSymptoms.filter(s => !text.toLowerCase().split(',').map(x => x.trim()).includes(s)))}
                  disabled={loading}
                  className="flex-1 py-3.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm shadow-lg shadow-primary-200 disabled:opacity-50 flex items-center justify-center gap-2 transition-all">
                  {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> Analysing...</> : 'Run AI Analysis'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 3 - Results */}
        {step === 3 && result && (
          <div className="animate-slide-up space-y-4">

            {/* Main Result Card */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-2 h-2 rounded-full ${result.type === 'quick' ? 'bg-primary-500' : 'bg-blue-500'}`}/>
                <span className={`text-xs font-semibold uppercase tracking-wider ${result.type === 'quick' ? 'text-primary-600' : 'text-blue-600'}`}>
                  {result.type === 'quick' ? 'Quick Check Result' : 'Advanced AI Analysis'}
                </span>
                <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-semibold ${confBadge}`}>
                  {result.confidenceLabel} Confidence
                </span>
              </div>

              {/* Category */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-medium">{result.category}</span>
                {result.severity && (
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    result.severity === 'High' ? 'bg-red-100 text-red-700' :
                    result.severity === 'Medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-green-100 text-green-700'}`}>
                    {result.severity} Severity
                  </span>
                )}
              </div>

              {/* Disease */}
              <p className="text-xs text-slate-400 mb-1">
                {result.confidenceLabel === 'High' ? 'Likely Condition' : 'Possible Condition'}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mb-4">{result.disease}</h2>

              {/* Confidence Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                  <span>AI Confidence</span>
                  <span className={`font-bold ${confText}`}>{result.confidenceLabel} ({result.confidence}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all duration-700 ${confBg}`} style={{width:`${result.confidence}%`}}/>
                </div>
              </div>

              {/* Note */}
              <div className={`rounded-xl p-3 mb-4 text-xs ${
                result.confidenceLabel === 'High' ? 'bg-green-50 border border-green-200 text-green-700' :
                result.confidenceLabel === 'Medium' ? 'bg-amber-50 border border-amber-200 text-amber-700' :
                'bg-red-50 border border-red-200 text-red-700'}`}>
                {result.note}
              </div>

              {/* Specialist */}
              <div className={`flex items-center gap-3 p-3.5 border rounded-xl ${result.type === 'quick' ? 'bg-primary-50 border-primary-100' : 'bg-blue-50 border-blue-100'}`}>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${result.type === 'quick' ? 'bg-primary-100' : 'bg-blue-100'}`}>
                  <svg className={`w-4 h-4 ${result.type === 'quick' ? 'text-primary-600' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <div>
                  <p className={`text-xs ${result.type === 'quick' ? 'text-primary-400' : 'text-blue-400'}`}>Recommended Specialist</p>
                  <p className={`font-bold text-sm ${result.type === 'quick' ? 'text-primary-800' : 'text-blue-800'}`}>{result.specialist}</p>
                </div>
              </div>
            </div>

            {/* Top 3 - Advanced only */}
            {result.type === 'advanced' && result.top3 && result.top3.length > 0 && (
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                <p className="text-slate-700 font-semibold text-sm mb-3">Top 3 Possible Conditions</p>
                <div className="space-y-2">
                  {result.top3.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">{i+1}</span>
                        <div>
                          <p className="text-slate-700 text-sm font-medium">{item.disease}</p>
                          <p className="text-slate-400 text-xs">{item.specialist}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        item.confidence >= 0.75 ? 'bg-green-100 text-green-700' :
                        item.confidence >= 0.50 ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-600'}`}>
                        {Math.round(item.confidence * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Groq AI Advice */}
            {result.advice && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                <p className="font-semibold text-blue-800 mb-2 text-sm">AI Advice</p>
                <p className="text-blue-700 text-sm leading-relaxed">{result.advice}</p>
              </div>
            )}

            {/* Home Treatment - Advanced Groq */}
            {result.homeTreatment && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                <p className="font-semibold text-green-800 mb-2 text-sm">Home Treatment</p>
                <p className="text-green-700 text-sm leading-relaxed">{result.homeTreatment}</p>
              </div>
            )}

            {/* Precautions - Advanced Groq */}
            {result.precautionsList && result.precautionsList.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <p className="font-semibold text-amber-800 mb-3 text-sm">Precautions</p>
                <div className="space-y-2">
                  {result.precautionsList.map((p, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</span>
                      <p className="text-amber-700 text-sm">{p}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warning Signs */}
            {result.warning && result.warning !== 'None' && result.warning !== 'none' && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                <p className="font-semibold text-red-800 mb-2 text-sm">Warning — Seek Emergency Care If:</p>
                <p className="text-red-700 text-sm leading-relaxed">{result.warning}</p>
              </div>
            )}

            {/* Local Doctors */}
            {result.localDocs && result.localDocs.length > 0 && (
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-slate-700 font-semibold text-sm">Available Doctors in Attock</p>
                  <span className="text-xs text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full border border-primary-100">Near You</span>
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
              AI analysis is for guidance only. Always consult a qualified doctor for proper diagnosis.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <Link to="/doctors" className="py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm text-center transition-all shadow-md shadow-primary-200">Find Doctors</Link>
              <Link to="/emergency" className="py-3 rounded-xl border-2 border-red-200 text-red-600 font-semibold text-sm text-center hover:bg-red-50 transition-all">Emergency</Link>
            </div>
            <button onClick={reset} className="w-full py-3 rounded-xl border border-slate-200 text-slate-500 text-sm font-medium hover:border-slate-300 transition-all">
              Start Over
            </button>
          </div>
        )}
      </div>
    </div>
  );
}