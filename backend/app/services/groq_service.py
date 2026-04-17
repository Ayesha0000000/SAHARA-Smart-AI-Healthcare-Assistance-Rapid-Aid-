# SAHARA | Groq AI Service - groq_service.py
# Groq LLaMA for NLP + Smart Analysis

from groq import Groq

GROQ_API_KEY = "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"
client = Groq(api_key=GROQ_API_KEY)
MODEL = "llama-3.3-70b-versatile"


def groq_extract_symptoms(user_input: str) -> list:
    """NLP - Groq se symptoms extract karo (Urdu/English dono)"""
    prompt = f"""You are a medical NLP assistant. Extract symptoms from the user input and return ONLY a comma-separated list of medical symptoms in English.

Rules:
- Convert Urdu/informal words: "bukhar"=fever, "sar dard"=headache, "ultiyaan"=vomiting, "kamzori"=weakness, "thakan"=fatigue, "chakkar"=dizziness
- Return ONLY symptoms, no explanation
- Example: fever, headache, body pain, chills

User input: "{user_input}"
Symptoms:"""

    try:
        r = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=100, temperature=0.1,
        )
        text = r.choices[0].message.content.strip()
        return [s.strip().lower() for s in text.split(',') if s.strip()]
    except Exception as e:
        print(f"Groq NLP error: {e}")
        return [s.strip().lower() for s in user_input.split(',') if s.strip()]


def groq_quick_analysis(symptoms: list, rf_category: str, ann_disease: str, ann_confidence: float) -> dict:
    """Quick Check - RF category + ANN disease + Groq simple advice"""
    prompt = f"""You are SAHARA, a medical AI assistant for Attock District Pakistan.

Patient symptoms: {', '.join(symptoms)}
AI detected category: {rf_category}
AI model prediction: {ann_disease} ({round(ann_confidence*100,1)}% confidence)

IMPORTANT: Based on the symptoms listed, determine the most medically accurate disease.
If the AI prediction does not match the symptoms well, correct it with a better diagnosis.

Reply in EXACT format (no extra text):
DISEASE: [most accurate disease name based on symptoms]
SPECIALIST: [appropriate specialist]
ADVICE: [2-3 practical sentences of medical advice]
WARNING: [urgent warning if needed, or None]"""

    try:
        r = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200, temperature=0.2,
        )
        return _parse_quick(r.choices[0].message.content.strip(), ann_disease)
    except Exception as e:
        print(f"Groq quick error: {e}")
        return {"disease": ann_disease, "specialist": "General Physician",
                "advice": "Please consult a General Physician.", "warning": None}


def groq_advanced_analysis(symptom_text: str, rf_category: str, ann_disease: str, ann_top3: list, ann_confidence: float) -> dict:
    """Advanced Check - Full detailed Groq analysis"""
    top3_str = "\n".join([f"- {d['disease']} ({round(d['confidence']*100,1)}%)" for d in ann_top3])

    prompt = f"""You are SAHARA, a medical AI assistant for Attock District Pakistan.

Patient describes: "{symptom_text}"
AI detected category: {rf_category}
AI model top predictions:
{top3_str}

IMPORTANT RULES:
1. Carefully analyze the patient symptoms
2. If AI predictions do not match the symptoms, provide the most medically accurate diagnosis
3. Be specific and practical for Pakistani patients
4. Do not suggest rare diseases without strong symptom evidence

Reply in EXACT format (no extra text, no asterisks):
DISEASE: [most accurate disease based on symptoms]
SPECIALIST: [appropriate specialist type]
SEVERITY: [Low/Medium/High]
ADVICE: [3-4 sentences of practical medical advice]
HOME_TREATMENT: [2-3 safe and practical home remedies]
PRECAUTIONS: [precaution 1, precaution 2, precaution 3]
WARNING: [urgent warning if symptoms are severe, or None]"""

    try:
        r = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=400, temperature=0.2,
        )
        return _parse_advanced(r.choices[0].message.content.strip(), ann_disease, rf_category)
    except Exception as e:
        print(f"Groq advanced error: {e}")
        return {"disease": ann_disease, "category": rf_category, "specialist": "General Physician",
                "severity": "Medium", "advice": "Please consult a General Physician.",
                "home_treatment": "Rest and stay hydrated.",
                "precautions": ["Consult a doctor", "Take rest", "Stay hydrated"],
                "warning": None}


def _parse_quick(content: str, fallback: str) -> dict:
    result = {"disease": fallback, "specialist": "General Physician",
              "advice": "Please consult a General Physician.", "warning": None}
    for line in content.split('\n'):
        line = line.strip()
        if line.startswith('DISEASE:'):
            result["disease"] = line.replace('DISEASE:', '').strip()
        elif line.startswith('SPECIALIST:'):
            result["specialist"] = line.replace('SPECIALIST:', '').strip()
        elif line.startswith('ADVICE:'):
            result["advice"] = line.replace('ADVICE:', '').strip()
        elif line.startswith('WARNING:'):
            w = line.replace('WARNING:', '').strip()
            result["warning"] = None if w.lower() == 'none' else w
    return result


def _parse_advanced(content: str, fallback: str, fallback_cat: str) -> dict:
    result = {"disease": fallback, "category": fallback_cat, "specialist": "General Physician",
              "severity": "Medium", "advice": "Please consult a General Physician.",
              "home_treatment": "Rest and stay hydrated.",
              "precautions": ["Consult a doctor", "Take rest", "Stay hydrated"],
              "warning": None}
    for line in content.split('\n'):
        line = line.strip()
        if line.startswith('DISEASE:'):
            result["disease"] = line.replace('DISEASE:', '').strip()
        elif line.startswith('SPECIALIST:'):
            result["specialist"] = line.replace('SPECIALIST:', '').strip()
        elif line.startswith('SEVERITY:'):
            result["severity"] = line.replace('SEVERITY:', '').strip()
        elif line.startswith('ADVICE:'):
            result["advice"] = line.replace('ADVICE:', '').strip()
        elif line.startswith('HOME_TREATMENT:'):
            result["home_treatment"] = line.replace('HOME_TREATMENT:', '').strip()
        elif line.startswith('PRECAUTIONS:'):
            p = line.replace('PRECAUTIONS:', '').strip()
            if p:
                result["precautions"] = [x.strip() for x in p.split(',') if x.strip()]
        elif line.startswith('WARNING:'):
            w = line.replace('WARNING:', '').strip()
            result["warning"] = None if w.lower() == 'none' else w
    return result