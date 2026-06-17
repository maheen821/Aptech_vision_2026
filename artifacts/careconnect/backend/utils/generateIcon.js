/**
 * Generates a highly detailed real body part / medical condition icon identifier.
 * Fully synchronized with your frontend React components and backend Express API keywords.
 * 
 * @param {string} name - Specialty name, Category name, or Symptom string
 * @returns {string} Highly realistic medical icon identifier string matching iconMap
 */
export function generateIcon(name = "") {
  const lower = name.toLowerCase().trim();

  // ❤️ CARDIOLOGY / CARDIOVASCULAR (Anatomical Heart)
  if (
    lower.includes("cardio") || 
    lower.includes("heart") || 
    lower.includes("chest pain") || 
    lower.includes("blood pressure") || 
    lower.includes("bp") || 
    lower.includes("hypertension") || 
    lower.includes("palpitations") || 
    lower.includes("heart failure") || 
    lower.includes("cholesterol") || 
    lower.includes("heartbeat") || 
    lower.includes("angina") || 
    lower.includes("shortness of breath on walking") || 
    lower.includes("uneasiness in chest") || 
    lower.includes("heart attack") || 
    lower.includes("vascular") || 
    lower.includes("ischemic") || 
    lower.includes("chest")
  ) {
    return "GiHeartOrgan"; // Fixed: GiAnatomicalHeart changed to GiHeartOrgan
  }

  // 🧠 NEUROLOGY / PSYCHIATRY (Anatomical Human Brain)
  if (
    lower.includes("brain") || 
    lower.includes("neuro") || 
    lower.includes("headache") || 
    lower.includes("migraine") || 
    lower.includes("head") || 
    lower.includes("memory loss") || 
    lower.includes("dizziness") || 
    lower.includes("vertigo") || 
    lower.includes("fits") || 
    lower.includes("seizure") || 
    lower.includes("epilepsy") || 
    lower.includes("stroke") || 
    lower.includes("paralysis") || 
    lower.includes("numbness") || 
    lower.includes("tingling") || 
    lower.includes("fainting") || 
    lower.includes("sciatica") || 
    lower.includes("mental") || 
    lower.includes("psych") || 
    lower.includes("psychiatry") || 
    lower.includes("psychology") || 
    lower.includes("depression") || 
    lower.includes("anxiety") || 
    lower.includes("stress") || 
    lower.includes("insomnia") || 
    lower.includes("panic attack") || 
    lower.includes("mood swings") || 
    lower.includes("overthinking") || 
    lower.includes("bipolar") || 
    lower.includes("sleeplessness")
  ) {
    return "GiBrain"; 
  }

  // 🫁 PULMONOLOGY / RESPIRATORY (Real Lungs Organ)
  if (
    lower.includes("lung") || 
    lower.includes("pulmo") || 
    lower.includes("pulmonology") || 
    lower.includes("cough") || 
    lower.includes("breathing") || 
    lower.includes("shortness of breath") || 
    lower.includes("wheezing") || 
    lower.includes("phlegm") || 
    lower.includes("sputum") || 
    lower.includes("chest congestion") || 
    lower.includes("snoring") || 
    lower.includes("sleep apnea") || 
    lower.includes("copd") || 
    lower.includes("respiratory") || 
    lower.includes("breath") || 
    lower.includes("asthma") ||
    lower.includes("wind")
  ) {
    return "GiLungs"; 
  }

  // 🦴 ORTHOPEDICS (Bones, Joints, Spine & Skeletal Structural Pain)
  if (
    lower.includes("bone") || 
    lower.includes("ortho") || 
    lower.includes("orthopedics") || 
    lower.includes("joint") || 
    lower.includes("back pain") || 
    lower.includes("neck pain") || 
    lower.includes("shoulder pain") || 
    lower.includes("knee pain") || 
    lower.includes("knee") || 
    lower.includes("fracture") || 
    lower.includes("arthritis") || 
    lower.includes("rheumatology") || 
    lower.includes("spine") || 
    lower.includes("muscle cramp") || 
    lower.includes("ligament injury") || 
    lower.includes("swollen joints") || 
    lower.includes("bone pain") || 
    lower.includes("heel pain") || 
    lower.includes("uric acid pain")
  ) {
    return "GiSkeleton"; // Fixed: GiBoneSkeleton changed to GiSkeleton
  }

  // 🍽️ GASTROENTEROLOGY / STOMACH (Real Internal Stomach Organ)
  if (
    lower.includes("stomach") || 
    lower.includes("gastro") || 
    lower.includes("gastroenterology") || 
    lower.includes("acidity") || 
    lower.includes("diarrhea") || 
    lower.includes("constipation") || 
    lower.includes("vomiting") || 
    lower.includes("vomit") || 
    lower.includes("nausea") || 
    lower.includes("bloating") || 
    lower.includes("heartburn") || 
    lower.includes("gas problem") || 
    lower.includes("gas") || 
    lower.includes("indigestion") || 
    lower.includes("loose motions") || 
    lower.includes("stomach ulcer") || 
    lower.includes("ulcer") || 
    lower.includes("fatty liver") || 
    lower.includes("piles") || 
    lower.includes("bleeding in stool") || 
    lower.includes("hepatology") || 
    lower.includes("ibs") ||
    lower.includes("utensils")
  ) {
    return "GiStomach"; 
  }

  // 👁️ OPHTHALMOLOGY (Real Human Eye Anatomy)
  if (
    lower.includes("eye") || 
    lower.includes("opth") || 
    lower.includes("ophthalmology") || 
    lower.includes("vision") || 
    lower.includes("blurred vision") || 
    lower.includes("red eyes") || 
    lower.includes("dry eyes") || 
    lower.includes("eye itching") || 
    lower.includes("watery eyes") || 
    lower.includes("dark circles") || 
    lower.includes("double vision") || 
    lower.includes("burning eye") || 
    lower.includes("cataract") || 
    lower.includes("glaucoma")
  ) {
    return "GiBleedingEye"; 
  }

  // 👂 ENT (Ear, Nose & Throat Systems)
  if (
    lower.includes("ent") || 
    lower.includes("ear") || 
    lower.includes("hearing") || 
    lower.includes("throat") || 
    lower.includes("nose") || 
    lower.includes("tonsil") || 
    lower.includes("ear discharge") || 
    lower.includes("ear pain") || 
    lower.includes("tinnitus") || 
    lower.includes("sore throat") || 
    lower.includes("nose bleeding") || 
    lower.includes("blocked nose") || 
    lower.includes("sinusitis") || 
    lower.includes("otolaryngology")
  ) {
    return "FaEarListen"; // Fixed: GiEar changed to FaEarListen
  }

  // 🦷 DENTISTRY (Anatomical Human Tooth)
  if (
    lower.includes("dental") || 
    lower.includes("dentist") || 
    lower.includes("dentistry") || 
    lower.includes("tooth") || 
    lower.includes("teeth") || 
    lower.includes("gum bleeding") || 
    lower.includes("gum") || 
    lower.includes("cavity") || 
    lower.includes("toothache") || 
    lower.includes("wisdom tooth") || 
    lower.includes("bad breath") || 
    lower.includes("mouth ulcers") || 
    lower.includes("root canal") || 
    lower.includes("orthodontics")
  ) {
    return "GiTooth"; 
  }

  // 🧬 UROLOGY / NEPHROLOGY / KIDNEY (Detailed Kidneys System)
  if (
    lower.includes("urology") || 
    lower.includes("nephrology") || 
    lower.includes("uti") || 
    lower.includes("urine") || 
    lower.includes("urinary tract") || 
    lower.includes("urinary") || 
    lower.includes("kidney stone") || 
    lower.includes("kidney") || 
    lower.includes("burning urination") || 
    lower.includes("frequent urination") || 
    lower.includes("blood in urine") || 
    lower.includes("prostate enlargement") || 
    lower.includes("prostate") || 
    lower.includes("bladder")
  ) {
    return "GiKidneys"; 
  }

  // 🤰 GYNECOLOGY (Maternity / Women Health)
  if (
    lower.includes("gyne") || 
    lower.includes("gynecology") || 
    lower.includes("obstetrics") || 
    lower.includes("menstrual") || 
    lower.includes("period") || 
    lower.includes("delivery") || 
    lower.includes("irregular periods") || 
    lower.includes("white discharge") || 
    lower.includes("leukorrhea") || 
    lower.includes("pregnancy test") || 
    lower.includes("pregnancy") || 
    lower.includes("labor pain") || 
    lower.includes("pcos") || 
    lower.includes("infertility") || 
    lower.includes("ovary") || 
    lower.includes("uterus") || 
    lower.includes("female")
  ) {
    return "FaBabyCarriage"; 
  }

  // 👶 PEDIATRICS (Infant / Child Care)
  if (
    lower.includes("child") || 
    lower.includes("ped") || 
    lower.includes("pediatrics") || 
    lower.includes("baby") || 
    lower.includes("kid") || 
    lower.includes("infant") || 
    lower.includes("pediatric clinic") || 
    lower.includes("child bedwetting") || 
    lower.includes("child growth") || 
    lower.includes("teething issue") || 
    lower.includes("neonatal") || 
    lower.includes("vaccination")
  ) {
    return "FaChild"; 
  }

  // 🍬 ENDOCRINOLOGY (Diabetes / Syringe Injection)
  if (
    lower.includes("diabetes") || 
    lower.includes("thyroid") || 
    lower.includes("obesity") || 
    lower.includes("hormone") || 
    lower.includes("endocrinology") || 
    lower.includes("sugar level") || 
    lower.includes("weight gain") || 
    lower.includes("weight loss") || 
    lower.includes("metabolism") || 
    lower.includes("goiter") || 
    lower.includes("excessive thirst") || 
    lower.includes("hormonal imbalance") ||
    lower.includes("syringe")
  ) {
    return "FaSyringe"; 
  }

  // 🧴 DERMATOLOGY (Skin & Hair Protection)
  if (
    lower.includes("skin") || 
    lower.includes("derm") || 
    lower.includes("dermatology") || 
    lower.includes("allergy") || 
    lower.includes("acne") || 
    lower.includes("itching") || 
    lower.includes("hair loss") || 
    lower.includes("hairfall") || 
    lower.includes("rash") || 
    lower.includes("pimples") || 
    lower.includes("dandruff") || 
    lower.includes("dark spots") || 
    lower.includes("skin fungal") || 
    lower.includes("ringworm") || 
    lower.includes("blisters") || 
    lower.includes("warts") || 
    lower.includes("eczema") || 
    lower.includes("psoriasis") ||
    lower.includes("sparkles")
  ) {
    return "FaFileMedical"; // Fixed: FaShieldMedical changed to FaFileMedical to match component mapping
  }

  // 🩸 BLOOD RELATED (Blood Cells / Droplets)
  if (
    lower.includes("blood") || 
    lower.includes("anemia") || 
    lower.includes("bleeding") ||
    lower.includes("droplets")
  ) {
    return "FaDroplet"; 
  }

  // 🌡️ GENERAL MEDICINE (Clinical Thermometer)
  if (
    lower.includes("general") || 
    lower.includes("medicine") || 
    lower.includes("internal medicine") || 
    lower.includes("physician") || 
    lower.includes("fever") || 
    lower.includes("cold") || 
    lower.includes("flu") || 
    lower.includes("fatigue") || 
    lower.includes("weakness") || 
    lower.includes("body aches") || 
    lower.includes("body pain") || 
    lower.includes("typhoid") || 
    lower.includes("malaria") || 
    lower.includes("dengue") || 
    lower.includes("low energy") || 
    lower.includes("infection") || 
    lower.includes("shivering") || 
    lower.includes("viral") || 
    lower.includes("covid") ||
    lower.includes("activity")
  ) {
    return "FaThermometer"; 
  }

  // Default Fallback
  return "FaHeartPulse"; // Fixed: Deprecated FaHeartbeat changed to FaHeartPulse
}