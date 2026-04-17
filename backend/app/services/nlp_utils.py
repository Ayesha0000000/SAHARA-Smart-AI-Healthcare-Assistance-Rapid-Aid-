# SAHARA | NLP Utilities - nlp_utils.py
# Pure Python NLP layer - no spaCy required
# Runs BEFORE RF and ANN models

import re

# ── Symptom Normalization Map ─────────────────────────────
# User input → RF symptom_list format
NLP_SYMPTOM_MAP = {
    # Fever
    "fever"                    : "high_fever",
    "high fever"               : "high_fever",
    "mild fever"               : "mild_fever",
    "low fever"                : "mild_fever",
    "low grade fever"          : "mild_fever",
    "temperature"              : "high_fever",
    "body temperature"         : "high_fever",
    "bukhar"                   : "high_fever",
    "tez bukhar"               : "high_fever",
    "burning body"             : "high_fever",
    "feeling hot"              : "high_fever",
    "hot body"                 : "high_fever",

    # Head
    "headache"                 : "headache",
    "head pain"                : "headache",
    "head ache"                : "headache",
    "migraine"                 : "headache",
    "sir dard"                 : "headache",
    "head hurts"               : "headache",

    # Body Pain
    "body pain"                : "muscle_pain",
    "body ache"                : "muscle_pain",
    "body aches"               : "muscle_pain",
    "muscle pain"              : "muscle_pain",
    "muscle ache"              : "muscle_pain",
    "muscular pain"            : "muscle_pain",
    "body hurts"               : "muscle_pain",
    "pain all over"            : "muscle_pain",
    "badan dard"               : "muscle_pain",

    # Joint
    "joint pain"               : "joint_pain",
    "joint ache"               : "joint_pain",
    "joints hurt"              : "joint_pain",
    "knee pain"                : "knee_pain",
    "knee ache"                : "knee_pain",
    "hip pain"                 : "hip_joint_pain",
    "hip ache"                 : "hip_joint_pain",

    # Chest
    "chest pain"               : "chest_pain",
    "chest ache"               : "chest_pain",
    "chest tightness"          : "chest_pain",
    "chest pressure"           : "chest_pain",
    "heart pain"               : "chest_pain",

    # Back
    "back pain"                : "back_pain",
    "back ache"                : "back_pain",
    "backache"                 : "back_pain",
    "lower back pain"          : "back_pain",

    # Stomach
    "stomach pain"             : "stomach_pain",
    "abdominal pain"           : "abdominal_pain",
    "stomach ache"             : "stomach_pain",
    "tummy pain"               : "stomach_pain",
    "belly pain"               : "belly_pain",
    "belly ache"               : "belly_pain",
    "pet dard"                 : "stomach_pain",

    # Neck
    "neck pain"                : "neck_pain",
    "neck ache"                : "neck_pain",
    "stiff neck"               : "stiff_neck",
    "neck stiffness"           : "stiff_neck",

    # Respiratory
    "cough"                    : "cough",
    "coughing"                 : "cough",
    "khansi"                   : "cough",
    "dry cough"                : "cough",
    "wet cough"                : "cough",
    "cold"                     : "runny_nose",
    "common cold"              : "runny_nose",
    "runny nose"               : "runny_nose",
    "nasal discharge"          : "runny_nose",
    "breathless"               : "breathlessness",
    "breathlessness"           : "breathlessness",
    "difficulty breathing"     : "breathlessness",
    "short of breath"          : "breathlessness",
    "shortness of breath"      : "breathlessness",
    "cant breathe"             : "breathlessness",
    "saans nahi aa raha"       : "breathlessness",
    "sore throat"              : "patches_in_throat",
    "throat pain"              : "patches_in_throat",
    "throat irritation"        : "throat_irritation",
    "throat infection"         : "patches_in_throat",
    "sneezing"                 : "continuous_sneezing",
    "phlegm"                   : "phlegm",
    "mucus"                    : "phlegm",
    "sputum"                   : "phlegm",
    "wheezing"                 : "breathlessness",
    "congestion"               : "congestion",
    "nasal congestion"         : "congestion",
    "blocked nose"             : "congestion",
    "sinus"                    : "sinus_pressure",
    "sinus pressure"           : "sinus_pressure",

    # Digestive
    "nausea"                   : "nausea",
    "matli"                    : "nausea",
    "feel like vomiting"       : "nausea",
    "vomiting"                 : "vomiting",
    "ulti"                     : "vomiting",
    "throwing up"              : "vomiting",
    "diarrhea"                 : "diarrhoea",
    "diarrhoea"                : "diarrhoea",
    "loose motion"             : "diarrhoea",
    "loose motions"            : "diarrhoea",
    "loose stool"              : "diarrhoea",
    "watery stool"             : "diarrhoea",
    "constipation"             : "constipation",
    "cant pass stool"          : "constipation",
    "acidity"                  : "acidity",
    "acid reflux"              : "acidity",
    "heartburn"                : "acidity",
    "indigestion"              : "indigestion",
    "loss of appetite"         : "loss_of_appetite",
    "no appetite"              : "loss_of_appetite",
    "not eating"               : "loss_of_appetite",
    "bhook nahi"               : "loss_of_appetite",
    "bloating"                 : "distention_of_abdomen",
    "stomach bloating"         : "distention_of_abdomen",
    "gas"                      : "passage_of_gases",
    "flatulence"               : "passage_of_gases",
    "cramps"                   : "cramps",
    "stomach cramps"           : "cramps",
    "bloody stool"             : "bloody_stool",
    "blood in stool"           : "bloody_stool",

    # Urinary
    "burning urination"        : "burning_micturition",
    "burning while urinating"  : "burning_micturition",
    "painful urination"        : "burning_micturition",
    "frequent urination"       : "polyuria",
    "urinating a lot"          : "polyuria",
    "dark urine"               : "dark_urine",
    "yellow urine"             : "yellow_urine",
    "foul urine"               : "foul_smell_of urine",
    "bladder pain"             : "bladder_discomfort",

    # Skin
    "rash"                     : "skin_rash",
    "skin rash"                : "skin_rash",
    "red spots"                : "red_spots_over_body",
    "red spot"                 : "red_spots_over_body",
    "itching"                  : "itching",
    "itchy"                    : "itching",
    "khujli"                   : "itching",
    "itchy skin"               : "itching",
    "blister"                  : "blister",
    "blisters"                 : "blister",
    "acne"                     : "blackheads",
    "pimple"                   : "blackheads",
    "pimples"                  : "blackheads",
    "yellow skin"              : "yellowish_skin",
    "yellowish skin"           : "yellowish_skin",
    "yellow eyes"              : "yellowing_of_eyes",
    "jaundice"                 : "yellowing_of_eyes",
    "skin peeling"             : "skin_peeling",
    "peeling skin"             : "skin_peeling",
    "red eyes"                 : "redness_of_eyes",
    "puffy face"               : "puffy_face_and_eyes",
    "swollen face"             : "puffy_face_and_eyes",
    "watery eyes"              : "watering_from_eyes",
    "sunken eyes"              : "sunken_eyes",

    # General
    "fatigue"                  : "fatigue",
    "tired"                    : "fatigue",
    "tiredness"                : "fatigue",
    "thakan"                   : "fatigue",
    "exhausted"                : "fatigue",
    "exhaustion"               : "fatigue",
    "no energy"                : "fatigue",
    "weakness"                 : "weakness_in_limbs",
    "weak"                     : "weakness_in_limbs",
    "kamzori"                  : "weakness_in_limbs",
    "body weakness"            : "weakness_in_limbs",
    "lethargy"                 : "lethargy",
    "lethargic"                : "lethargy",
    "malaise"                  : "malaise",
    "not feeling well"         : "malaise",
    "unwell"                   : "malaise",
    "laziness"                 : "lethargy",
    "lazy"                     : "lethargy",
    "chills"                   : "chills",
    "sardi lagna"              : "chills",
    "feeling cold"             : "chills",
    "cold chills"              : "chills",
    "shivering"                : "shivering",
    "kaampna"                  : "shivering",
    "trembling"                : "shivering",
    "sweating"                 : "sweating",
    "paseena"                  : "sweating",
    "night sweats"             : "sweating",
    "excessive sweating"       : "sweating",
    "weight loss"              : "weight_loss",
    "losing weight"            : "weight_loss",
    "weight gain"              : "weight_gain",
    "gaining weight"           : "weight_gain",
    "dizziness"                : "dizziness",
    "dizzy"                    : "dizziness",
    "chakkar"                  : "dizziness",
    "lightheaded"              : "dizziness",
    "vertigo"                  : "spinning_movements",
    "spinning"                 : "spinning_movements",
    "anxiety"                  : "anxiety",
    "anxious"                  : "anxiety",
    "depression"               : "depression",
    "depressed"                : "depression",
    "mood swings"              : "mood_swings",
    "irritability"             : "irritability",
    "irritable"                : "irritability",
    "restlessness"             : "restlessness",
    "restless"                 : "restlessness",
    "dehydration"              : "dehydration",
    "thirsty"                  : "excessive_hunger",
    "increased thirst"         : "excessive_hunger",
    "pyas"                     : "excessive_hunger",
    "swelling"                 : "swollen_legs",
    "swollen legs"             : "swollen_legs",
    "leg swelling"             : "swollen_legs",
    "swollen joints"           : "swelling_joints",
    "loss of balance"          : "loss_of_balance",
    "unsteady"                 : "unsteadiness",
    "blurred vision"           : "blurred_and_distorted_vision",
    "vision problem"           : "blurred_and_distorted_vision",
    "blurry vision"            : "blurred_and_distorted_vision",
    "can't see clearly"        : "blurred_and_distorted_vision",
    "loss of smell"            : "loss_of_smell",
    "cant smell"               : "loss_of_smell",
    "bruising"                 : "bruising",
    "bruises"                  : "bruising",
    "bleeding"                 : "bloody_stool",
    "palpitation"              : "palpitations",
    "palpitations"             : "palpitations",
    "heart racing"             : "fast_heart_rate",
    "fast heartbeat"           : "fast_heart_rate",
    "rapid heart"              : "fast_heart_rate",
    "muscle weakness"          : "muscle_weakness",
    "cold hands"               : "cold_hands_and_feets",
    "cold feet"                : "cold_hands_and_feets",
    "enlarged thyroid"         : "enlarged_thyroid",
    "thyroid"                  : "enlarged_thyroid",
    "irregular sugar"          : "irregular_sugar_level",
    "high sugar"               : "irregular_sugar_level",
    "low sugar"                : "irregular_sugar_level",
    "slurred speech"           : "slurred_speech",
    "cant speak clearly"       : "slurred_speech",
    "swollen lymph nodes"      : "swelled_lymph_nodes",
    "lymph nodes"              : "swelled_lymph_nodes",
    "hair loss"                : "weight_loss",
    "lack of concentration"    : "lack_of_concentration",
    "cant concentrate"         : "lack_of_concentration",
    "memory loss"              : "lack_of_concentration",
    "obesity"                  : "obesity",
    "overweight"               : "obesity",
    "movement stiffness"       : "movement_stiffness",
    "stiffness"                : "movement_stiffness",
    "painful walking"          : "painful_walking",
    "cant walk"                : "painful_walking",
    "ulcers tongue"            : "ulcers_on_tongue",
    "mouth ulcer"              : "ulcers_on_tongue",
    "tongue ulcer"             : "ulcers_on_tongue",
}

# ── Disease Category Map ──────────────────────────────────
DISEASE_CATEGORIES = {
    "Fungal infection"                        : "Skin Infection",
    "Allergy"                                 : "Allergic Condition",
    "GERD"                                    : "Digestive Issue",
    "Chronic cholestasis"                     : "Liver Issue",
    "Drug Reaction"                           : "Allergic Condition",
    "Peptic ulcer disease"                    : "Digestive Issue",
    "AIDS"                                    : "Viral Infection",
    "Diabetes"                                : "Metabolic Issue",
    "Gastroenteritis"                         : "Digestive Issue",
    "Bronchial Asthma"                        : "Respiratory Issue",
    "Hypertension"                            : "Cardiovascular Issue",
    "Migraine"                                : "Neurological Issue",
    "Cervical spondylosis"                    : "Musculoskeletal Issue",
    "Paralysis (brain hemorrhage)"            : "Neurological Issue",
    "Jaundice"                                : "Liver Issue",
    "Malaria"                                 : "Viral/Parasitic Infection",
    "Chicken pox"                             : "Viral Infection",
    "Dengue"                                  : "Viral Infection",
    "Typhoid"                                 : "Bacterial Infection",
    "hepatitis A"                             : "Liver Issue",
    "Hepatitis B"                             : "Liver Issue",
    "Hepatitis C"                             : "Liver Issue",
    "Hepatitis D"                             : "Liver Issue",
    "Hepatitis E"                             : "Liver Issue",
    "Alcoholic hepatitis"                     : "Liver Issue",
    "Tuberculosis"                            : "Respiratory Infection",
    "Common Cold"                             : "Viral Infection",
    "Pneumonia"                               : "Respiratory Infection",
    "Dimorphic hemmorhoids(piles)"            : "Digestive Issue",
    "Heart attack"                            : "Cardiovascular Issue",
    "Varicose veins"                          : "Cardiovascular Issue",
    "Hypothyroidism"                          : "Metabolic Issue",
    "Hyperthyroidism"                         : "Metabolic Issue",
    "Hypoglycemia"                            : "Metabolic Issue",
    "Osteoarthritis"                          : "Musculoskeletal Issue",
    "Arthritis"                               : "Musculoskeletal Issue",
    "(vertigo) Paroymsal  Positional Vertigo" : "Neurological Issue",
    "Acne"                                    : "Skin Issue",
    "Urinary tract infection"                 : "Urinary Issue",
    "Psoriasis"                               : "Skin Issue",
    "Impetigo"                                : "Skin Infection",
}

# ── Disease Advice Map ────────────────────────────────────
DISEASE_ADVICE = {
    "Dengue"               : "Consult doctor immediately. Stay hydrated and avoid aspirin.",
    "Malaria"              : "Seek medical help urgently. Take prescribed antimalarials.",
    "Typhoid"              : "Visit doctor immediately. Complete the antibiotic course.",
    "Tuberculosis"         : "Consult a pulmonologist. Follow TB treatment strictly.",
    "Pneumonia"            : "Seek medical help. Rest and take prescribed antibiotics.",
    "Heart attack"         : "EMERGENCY - Call 1122 immediately. Do not delay.",
    "Paralysis (brain hemorrhage)": "EMERGENCY - Call 1122 immediately.",
    "AIDS"                 : "Consult infectious disease specialist immediately.",
    "Diabetes"             : "Monitor blood sugar. Consult endocrinologist.",
    "Hypertension"         : "Monitor blood pressure. Reduce salt intake. See cardiologist.",
    "Common Cold"          : "Take rest, drink fluids, and stay warm.",
    "Bronchial Asthma"     : "Use prescribed inhaler. Avoid triggers. See pulmonologist.",
    "Gastroenteritis"      : "Stay hydrated. ORS solution. Rest.",
    "Chicken pox"          : "Rest at home. Avoid scratching. See doctor for antivirals.",
    "GERD"                 : "Avoid spicy food. Take antacids. See gastroenterologist.",
    "Migraine"             : "Rest in dark quiet room. Take prescribed medication.",
    "Arthritis"            : "Rest joints. Anti-inflammatory medication. See orthopedic.",
    "Urinary tract infection": "Drink plenty of water. See urologist for antibiotics.",
    "Fungal infection"     : "Keep area dry. Use antifungal cream. See dermatologist.",
    "Jaundice"             : "Rest and stay hydrated. See gastroenterologist urgently.",
    "Hepatitis B"          : "Avoid alcohol. See gastroenterologist immediately.",
    "Hypothyroidism"       : "Take prescribed thyroid medication. See endocrinologist.",
    "Hyperthyroidism"      : "Avoid caffeine. See endocrinologist for treatment.",
    "Acne"                 : "Keep skin clean. Use prescribed creams. See dermatologist.",
    "Psoriasis"            : "Moisturize skin. See dermatologist for treatment.",
}

DEFAULT_ADVICE = "Consult a General Physician for proper diagnosis and treatment."


def clean_text(text: str) -> str:
    """Basic text cleaning"""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s,]', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text


def extract_symptoms_nlp(user_input: str) -> list:
    """
    NLP Layer - Pure Python implementation
    1. Clean text
    2. Split by comma or common connectors
    3. Match against NLP_SYMPTOM_MAP
    4. Return clean symptom list for RF
    """
    text = clean_text(user_input)

    # Split by comma, 'and', 'with', 'also', 'plus'
    parts = re.split(r',|\band\b|\bwith\b|\balso\b|\bplus\b|\balong with\b', text)
    parts = [p.strip() for p in parts if p.strip()]

    normalized = []
    for part in parts:
        # Direct match
        if part in NLP_SYMPTOM_MAP:
            normalized.append(NLP_SYMPTOM_MAP[part])
            continue

        # Multi-word match (try longest match first)
        matched = False
        words = part.split()
        for length in range(min(4, len(words)), 0, -1):
            for start in range(len(words) - length + 1):
                phrase = ' '.join(words[start:start+length])
                if phrase in NLP_SYMPTOM_MAP:
                    normalized.append(NLP_SYMPTOM_MAP[phrase])
                    matched = True
                    break
            if matched:
                break

        # Single word partial match
        if not matched:
            for word in words:
                if len(word) < 3:
                    continue
                if word in NLP_SYMPTOM_MAP:
                    normalized.append(NLP_SYMPTOM_MAP[word])
                    matched = True
                    break

    return list(set(normalized))


def get_confidence_label(conf: float) -> str:
    if conf >= 0.75:
        return "High"
    elif conf >= 0.50:
        return "Medium"
    else:
        return "Low"


def get_disease_advice(disease: str) -> str:
    return DISEASE_ADVICE.get(disease, DEFAULT_ADVICE)


def get_disease_category(disease: str) -> str:
    return DISEASE_CATEGORIES.get(disease, "General Health")
