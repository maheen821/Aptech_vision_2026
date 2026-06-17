import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import * as LucideIcons from "lucide-react"; 

/* ─── REAL MEDICAL ICONS IMPORTS FROM REACT-ICONS ─── */
import { 
  GiHeartOrgan, GiBrain, GiLungs, GiSkeleton, 
  GiStomach, GiBleedingEye, GiTooth, GiKidneys 
} from "react-icons/gi";

import { 
  FaEarListen, FaBabyCarriage, FaChild, FaSyringe, 
  FaFileMedical, FaDroplet, FaThermometer, FaHeartPulse,
  FaStethoscope
} from "react-icons/fa6";

/* ─── Types ─── */
interface SymptomDoc {
  _id?: string;
  id?: number;
  name: string;
  category: string; 
  specialties?: string[];
}

interface CategoryDoc {
  _id?: string;
  label: string;  
  color: string;  
  icon: string;   
  items: SymptomDoc[]; 
}

interface DoctorDoc {
  _id?: string;
  id?: number;
  name: string;
  specialty: string;
  rating: number;
  experience: number;
  fee: number;
  imageUrl?: string;  
  available: boolean;
}

interface AnalysisResult {
  matchedSpecialties: string[];
  doctors: DoctorDoc[];
}

/* ─── Base URL ─── */
const API_BASE = "http://localhost:5000/api";

const SPECIALTY_COLOR: Record<string, string> = {
  "Cardiology":       "from-rose-500 to-pink-600",
  "Neurology":        "from-violet-500 to-purple-600",
  "Dermatology":      "from-pink-500 to-rose-500",
  "Pulmonology":      "from-sky-500 to-blue-600",
  "Orthopedics":      "from-orange-500 to-amber-600",
  "ENT":              "from-teal-500 to-cyan-600",
  "Pediatrics":       "from-sky-400 to-indigo-500",
  "General Medicine": "from-emerald-500 to-teal-600",
};

// Complete Case-Insensitive Global Icon Dictionary Sync
const globalIconMap: Record<string, any> = {
  giheartorgan: GiHeartOrgan,
  gibrain: GiBrain,
  gilungs: GiLungs,
  giskeleton: GiSkeleton,
  gistomach: GiStomach,
  gibleedingeye: GiBleedingEye,
  gitooth: GiTooth,
  gikidneys: GiKidneys,
  faearlisten: FaEarListen,
  fababycarriage: FaBabyCarriage,
  fachild: FaChild,
  fasyringe: FaSyringe,
  fafilemedical: FaFileMedical,
  fadroplet: FaDroplet,
  fathermometer: FaThermometer,
  faheartpulse: FaHeartPulse,
  fastethoscope: FaStethoscope
};

const FALLBACK = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23e0f2fe'/%3E%3Ccircle cx='40' cy='28' r='14' fill='%230ea5e9'/%3E%3Cellipse cx='40' cy='65' rx='22' ry='16' fill='%230ea5e9'/%3E%3C/svg%3E`;
const ANALYSIS_STEPS = ["Reading symptom patterns...", "Mapping to medical specialties...", "Finding available doctors...", "Ranking by rating & experience..."];

const getSpecialtyGradient = (specialtyName: string) => SPECIALTY_COLOR[specialtyName] ?? "from-blue-600 to-indigo-700";

/* ─── DYNAMIC CORES THEME STYLING (HEX SAFE INTERNALS) ─── */
const getDynamicCategoryTheme = (hexColor: string) => {
  const safeColor = hexColor || "#3b82f6";
  return {
    badgeStyle: {
      backgroundColor: `${safeColor}12`,
      color: safeColor,
      borderColor: `${safeColor}25`
    },
    activeBadgeStyle: {
      background: `linear-gradient(135deg, ${safeColor}, ${safeColor}dd)`,
      color: "#ffffff",
      borderColor: safeColor,
      boxShadow: `0 10px 15px -3px ${safeColor}25`
    },
    iconWrapperStyle: {
      background: `linear-gradient(135deg, ${safeColor}, ${safeColor}cc)`,
      color: "#ffffff",
      boxShadow: `0 4px 12px ${safeColor}30`
    }
  };
};

/* ─── DYNAMIC GLOBAL MASTER ICON RENDERER ─── */
function DynamicCategoryIcon({ name, className = "w-4 h-4", style }: { name: string; className?: string; style?: React.CSSProperties }) {
  const normalizedKey = name.toLowerCase().trim();
  
  // 1. Check in custom React Medical Icons Dictionary
  if (globalIconMap[normalizedKey]) {
    const CustomIcon = globalIconMap[normalizedKey];
    return <CustomIcon className={className} style={style} />;
  }

  // 2. Fallback lookup inside Lucide Icons library object
  const LucideComponent = (LucideIcons as any)[name];
  if (LucideComponent) {
    return <LucideComponent className={className} style={style} />;
  }

  // 3. Absolute Safe Terminal Catch Fallback
  return <LucideIcons.Thermometer className={className} style={style} />;
}

/* ─── Infinite Counter Component ─── */
function CounterUp({ target, duration = 1.8, suffix = "", prefix = "" }: { target: number; duration?: number; suffix?: string; prefix?: string }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: false, margin: "-50px" });
  
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    if (suffix === "%") return latest.toFixed(1);
    return Math.floor(latest).toString();
  });

  useEffect(() => {
    if (inView) {
      count.set(0);
      const controls = animate(count, target, { duration: duration, ease: "easeOut" });
      return controls.stop;
    }
  }, [inView, target, duration, count]);

  return (
    <span className="font-black text-3xl sm:text-4xl text-slate-950 flex items-center justify-center tracking-tight transition-all">
      {prefix && <span className="text-2xl mr-1 text-slate-400 font-bold">{prefix}</span>}
      <motion.span ref={nodeRef}>{rounded}</motion.span>
      {suffix && <span className="text-sky-500 ml-0.5">{suffix}</span>}
    </span>
  );
}

/* ─── Non-Stopping Infinite Typing Heading Component ─── */
function TypingHeading() {
  const words = ["Intelligent Care,", "AI-Powered Care,", "Expert Clinical Care,"];
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const currentWord = words[currentWordIdx];
    
    const handleTyping = () => {
      if (!isDeleting) {
        setDisplayedText(currentWord.substring(0, displayedText.length + 1));
        if (displayedText === currentWord) {
          timer = setTimeout(() => setIsDeleting(true), 2000); 
          return;
        }
      } else {
        setDisplayedText(currentWord.substring(0, displayedText.length - 1));
        if (displayedText === "") {
          setIsDeleting(false);
          setCurrentWordIdx((prev) => (prev + 1) % words.length);
          return;
        }
      }
      
      timer = setTimeout(handleTyping, isDeleting ? 40 : 80);
    };

    timer = setTimeout(handleTyping, 100);
    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentWordIdx]);

  return (
    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight min-h-[110px] sm:min-h-[140px] lg:min-h-[160px]">
      <span className="relative">
        {displayedText}
        <motion.span 
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
          className="inline-block w-1.5 h-8 sm:h-12 bg-cyan-400 ml-1 absolute bottom-1"
        />
      </span>
      <br />
      <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent inline-block mt-1 animate-pulse">
        Tailored for You.
      </span>
    </h1>
  );
}

/* ─── Doctor Card ─── */
function DoctorCard({ doctor, index }: { doctor: DoctorDoc; index: number }) {
  const grad = getSpecialtyGradient(doctor.specialty);
  const doctorId = doctor._id || doctor.id;
  if (!doctorId) return null;

  const resolvedImage = doctor.imageUrl
    ? doctor.imageUrl.startsWith("http")
      ? doctor.imageUrl
      : `http://localhost:5000${doctor.imageUrl}`
    : FALLBACK;

  const goToProfile = () => {
    if (!doctorId) return;
    window.location.href = `/doctor/${doctorId}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 260, damping: 22 }}
      className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200/80 transition-all duration-300"
    >
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${grad}`} />
      <div className="p-5 flex items-center gap-4">
        <div className="relative shrink-0">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${grad} p-0.5 shadow-md group-hover:scale-105 transition-transform duration-300`}>
            <img
              src={resolvedImage}
              alt={doctor.name}
              onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
              className="w-full h-full rounded-[14px] object-cover bg-white"
            />
          </div>
          {doctor.available && (
            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm ring-4 ring-emerald-500/10 animate-pulse" title="Available" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="font-bold text-gray-900 text-sm leading-tight truncate group-hover:text-sky-600 transition-colors">{doctor.name}</h4>
              <span className={`inline-block mt-1 text-[10px] font-black tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r ${grad} text-white uppercase`}>
                {doctor.specialty}
              </span>
            </div>
            <div className="flex items-center gap-0.5 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded-lg text-amber-500 shrink-0">
              <LucideIcons.Star className="w-3 h-3 fill-current" />
              <span className="text-xs font-black text-amber-700">{doctor.rating.toFixed(1)}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1 font-medium">
              <LucideIcons.Activity className="w-3.5 h-3.5 text-gray-400" />
              {doctor.experience}+ Yrs Exp
            </span>
            <span className="flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
              <LucideIcons.Shield className="w-3 h-3" />
              ${doctor.fee}
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5">
        <button
          onClick={goToProfile}
          className={`w-full bg-gradient-to-r ${grad} text-white text-xs font-bold h-11 rounded-xl flex items-center justify-center gap-2 hover:opacity-95 shadow-sm hover:shadow-md transition-all relative overflow-hidden active:scale-[0.98]`}
        >
          <LucideIcons.User className="w-3.5 h-3.5" />
          View Complete Profile
          <LucideIcons.ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Analyzing Overlay ─── */
function AnalyzingPanel() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = ANALYSIS_STEPS.map((_, i) => setTimeout(() => setStep(i), i * 400));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      key="analyzing"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="bg-gradient-to-br from-slate-900 via-[#0b1b33] to-slate-900 rounded-3xl p-10 text-center border border-white/10 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-24 h-24 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-sky-900/40" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-sky-400 animate-spin" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-b-emerald-400 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <LucideIcons.Sparkles className="w-9 h-9 text-sky-300 animate-pulse" />
        </div>
      </div>

      <h3 className="text-2xl font-black text-white mb-1 tracking-tight">AI Clinical Diagnostic Sequence</h3>
      <p className="text-sky-300/70 text-sm mb-6 max-w-sm mx-auto">Evaluating symptom clusters against medical registry databases</p>

      <div className="space-y-2.5 mb-2 text-left max-w-xs mx-auto bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
        {ANALYSIS_STEPS.map((s, i) => (
          <motion.div
            key={s}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: i <= step ? 1 : 0.25, x: 0 }}
            className="flex items-center gap-3 text-sm"
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${i < step ? "bg-emerald-500" : i === step ? "bg-sky-500 ring-4 ring-sky-500/30" : "bg-white/10"}`}>
              {i < step ? <LucideIcons.CheckCircle2 className="w-3.5 h-3.5 text-white" /> : <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <span className={`font-medium ${i <= step ? "text-white" : "text-white/30"}`}>{s}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Main Component ─── */
export default function Symptoms() {
  const [selected, setSelected] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [symptomCategories, setSymptomCategories] = useState<CategoryDoc[] | null>(null);
  const [symptomsLoading, setSymptomsLoading] = useState(true);
  const [symptomsError, setSymptomsError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  /* ─── Fetch Categories & Symptoms ─── */
  useEffect(() => {
    const dataLoader = async () => {
      try {
        const [catsRes, symsRes] = await Promise.all([
          fetch(`${API_BASE}/categories`),
          fetch(`${API_BASE}/symptoms`)
        ]);

        if (!catsRes.ok || !symsRes.ok) throw new Error("Fetch failed");

        const catsData = await catsRes.json();
        const symsData = await symsRes.json();

        const rawCategories = Array.isArray(catsData) ? catsData : catsData.data || [];
        const rawSymptoms = Array.isArray(symsData) ? symsData : symsData.data || [];

        const mergedStructure: CategoryDoc[] = rawCategories.map((cat: any) => {
          const associatedItems = rawSymptoms.filter(
            (s: SymptomDoc) => s.category?.toLowerCase() === (cat.name || cat.label || "").toLowerCase()
          );

          return {
            _id: cat._id,
            label: cat.name || cat.label || "General",
            color: cat.color || "#3b82f6", // Directly stores full dynamic Hex string code safely
            icon: cat.icon || "Activity",
            items: associatedItems
          };
        });

        setSymptomCategories(mergedStructure);
        setSymptomsLoading(false);
      } catch (err) {
        console.error("Mapping Error: ", err);
        setSymptomsError(true);
        setSymptomsLoading(false);
      }
    };

    dataLoader();
  }, []);

  const toggle = (name: string) => {
    setResult(null);
    setSelected(prev => prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]);
  };

  const analyze = async () => {
    if (selected.length === 0 && description.trim() === "") return;
    setAnalyzing(true);
    setResult(null);
    setError(null);

    await new Promise(r => setTimeout(r, 1800));

    try {
      const res = await fetch(`${API_BASE}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: selected, description }),
      });
      if (!res.ok) throw new Error("Server error");
      const data: AnalysisResult = await res.json();
      setResult(data);
    } catch {
      setError("Could not connect to the server. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const reset = () => { setSelected([]); setDescription(""); setResult(null); setError(null); setSearchQuery(""); };
  const canAnalyze = selected.length > 0 || description.trim().length > 0;

  const filteredCategories = symptomCategories?.map(cat => ({
    ...cat,
    items: cat.items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 overflow-x-hidden pb-24 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* ─── HERO BANNER WITH HIGH QUALITY STABLE MEDICAL STREAM ─── */}
      <div className="relative bg-slate-950 overflow-hidden border-b border-slate-900 py-16 lg:py-24">
        
        {/* Real-time Streaming High Definition Medical Atmosphere Link */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-90">
            <source src="/videos/medical.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
        </div>

        <div className="container mx-auto max-w-6xl px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Column Content */}
          <div className="lg:col-span-7 text-left space-y-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 text-sky-300 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full backdrop-blur-md shadow-lg">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <LucideIcons.ShieldAlert className="w-3.5 h-3.5 fill-current opacity-90" /> AI-Enhanced Diagnostics Portal
              </div>
            </motion.div>

            <TypingHeading />

            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.4 }}
              className="text-slate-200 font-medium text-base max-w-lg leading-relaxed drop-shadow-md"
            >
              Select your clinical markers below or explain symptoms natively. Our neural matrix directly routes you to leading accredited domain experts instantly.
            </motion.p>

            {/* Active Tag Indicators */}
            <AnimatePresence>
              {selected.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: "auto" }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="pt-2"
                >
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Active Clinical Indicators:</p>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                    {selected.map(s => (
                      <motion.span 
                        key={s} 
                        initial={{ scale: 0.9, opacity: 0 }} 
                        animate={{ scale: 1, opacity: 1 }} 
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="flex items-center gap-1.5 text-xs font-bold bg-slate-900/80 border border-white/20 hover:border-white/30 text-white pl-3 pr-2 py-1.5 rounded-xl backdrop-blur-md transition-colors shadow-xl"
                      >
                        {s}
                        <button onClick={() => toggle(s)} className="text-slate-400 hover:text-rose-400 transition-colors bg-white/5 p-0.5 rounded-md">
                          <LucideIcons.X className="w-3 h-3" />
                        </button>
                      </motion.span>
                    ))}
                    <button onClick={reset} className="text-xs text-rose-400 hover:text-rose-300 font-bold tracking-wide transition-colors uppercase self-center ml-2 underline underline-offset-4">
                      Clear All
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Panel Column */}
          <div className="lg:col-span-5 hidden lg:block relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="relative w-full h-[340px] rounded-3xl bg-slate-900/70 border border-white/10 p-6 flex flex-col justify-between overflow-hidden shadow-2xl backdrop-blur-md group"
            >
              <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="grad-pattern" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                  <path d="M10,100 Q100,10 200,180 T400,50" fill="none" stroke="url(#grad-pattern)" strokeWidth="2" />
                  <circle cx="200" cy="180" r="6" fill="#8b5cf6" className="animate-ping" />
                  <circle cx="200" cy="180" r="4" fill="#38bdf8" />
                </svg>
              </div>

              <div className="flex items-center justify-between bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl shadow-lg backdrop-blur-md relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                    <LucideIcons.HeartPulse className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">Vitals Integrity Matrix</p>
                    <p className="text-[10px] text-slate-400">Secure real-time sync</p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md font-bold">OPTIMAL</span>
              </div>

              <div className="flex justify-center items-center py-6 relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 opacity-20 blur-2xl absolute" />
                <LucideIcons.Activity className="w-24 h-24 text-sky-400/80 relative z-10 drop-shadow-[0_0_15px_rgba(56,189,248,0.4)]" />
              </div>

              <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 p-3 rounded-2xl shadow-lg backdrop-blur-md relative z-10">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <LucideIcons.UserCheck className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="h-2 w-24 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-4/5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" />
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1">98.4% Accuracy Match Threshold</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ─── SCROLL COUNTERS BAR ─── */}
      <div className="container mx-auto max-w-5xl px-4 -mt-10 relative z-20">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-gray-100/80 shadow-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100 items-center">
          <div className="space-y-1.5 py-4 md:py-2 group">
            <CounterUp target={200} suffix="+" />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition-colors">Boarded Specialists Available</p>
          </div>
          <div className="space-y-1.5 py-4 md:py-2 group">
            <CounterUp target={99.2} suffix="%" />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition-colors">Accurate Diagnosis Route</p>
          </div>
          <div className="space-y-1.5 py-4 md:py-2 group">
            <CounterUp target={3} prefix="<" suffix=" Mins" />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition-colors">Average Consultant Match</p>
          </div>
        </div>
      </div>

      {/* ─── STABLE MATURING SYMPTOMS GRID WITH PREMIUM BACKGROUND BOX ─── */}
      <div className="container mx-auto max-w-5xl px-4 md:px-8 mt-12 space-y-6">
        
        <motion.div 
          initial={{ opacity: 0, y: 16 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-gradient-to-br from-slate-50 to-sky-50/50 rounded-[32px] border border-blue-100/70 shadow-[0_20px_50px_-20px_rgba(59,130,246,0.12)] overflow-hidden backdrop-blur-md"
        >
          {/* Top Panel Filter Header Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between px-8 py-6 border-b border-blue-100/60 bg-white/80 backdrop-blur-md gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                <LucideIcons.Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-black text-slate-900 text-2xl tracking-tight">Clinical Symptom Matrix</h2>
                <p className="text-sm text-slate-400 font-medium mt-0.5">Isolate symptoms to build precision diagnostic queries</p>
              </div>
            </div>

            {/* Dynamic Real-time Filtering Box */}
            {!symptomsLoading && !symptomsError && symptomCategories && symptomCategories.length > 0 && (
              <div className="relative min-w-[280px]">
                <LucideIcons.Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search specific symptoms..."
                  className="w-full bg-white/90 border border-slate-200/80 rounded-xl pl-10 pr-8 py-2.5 text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all shadow-sm"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-slate-200/60 hover:bg-slate-200 p-0.5 rounded">
                    <LucideIcons.X className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Core Content Box with Secure Mapping Rendering */}
          <div className="p-8 space-y-8">
            {symptomsLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
                <LucideIcons.Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <span className="text-sm font-medium tracking-wide">Syncing real-time global health taxonomy catalogs...</span>
              </div>
            ) : symptomsError || !symptomCategories || symptomCategories.length === 0 ? (
              <div className="flex flex-col items-center py-16 gap-3 text-center">
                <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                  <LucideIcons.AlertCircle className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-gray-700">Database Synchronization Latency</p>
                <p className="text-xs text-gray-400 max-w-xs">Could not successfully index directory categories.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {filteredCategories && filteredCategories.length > 0 ? (
                  filteredCategories.map((cat, catIdx) => {
                    const dynamicStyles = getDynamicCategoryTheme(cat.color);
                    const totalItems = cat.items || [];

                    if (totalItems.length === 0) return null;

                    return (
                      <motion.div 
                        key={cat._id || cat.label || `cat-${catIdx}`} 
                        initial={{ opacity: 0, y: 12 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: catIdx * 0.04 }}
                        className="p-6 rounded-2xl border border-blue-100/40 bg-white/80 backdrop-blur-sm shadow-[0_4px_25px_-12px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-300"
                      >
                        {/* Subheader Block for Each Main Segment */}
                        <div className="flex items-center gap-3 mb-5">
                          <div 
                            style={dynamicStyles.iconWrapperStyle}
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md"
                          >
                            <DynamicCategoryIcon name={cat.icon} className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-black uppercase tracking-wider text-slate-800">{cat.label}</span>
                          <div className="flex-1 h-px bg-slate-200/70" />
                          <span className="text-xs text-slate-500 bg-white border border-slate-100 px-2.5 py-0.5 rounded-md font-bold shadow-sm">{totalItems.length} items</span>
                        </div>
                        
                        {/* Tags Grid with Dynamic Highlights */}
                        <div className="flex flex-wrap gap-2.5">
                          {totalItems.map((sym, symIdx) => {
                            const isActive = selected.includes(sym.name);
                            return (
                              <motion.button
                                key={sym._id || sym.id || `${sym.name}-${symIdx}`}
                                onClick={() => toggle(sym.name)}
                                whileTap={{ scale: 0.97 }}
                                whileHover={{ scale: 1.02 }}
                                style={isActive ? dynamicStyles.activeBadgeStyle : dynamicStyles.badgeStyle}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold tracking-wide transition-all duration-200 shadow-[0_2px_4px_rgba(0,0,0,0.01)]`}
                              >
                                {isActive ? (
                                  <LucideIcons.Check className="w-4 h-4 shrink-0 stroke-[3px]" />
                                ) : (
                                  <span 
                                    style={{ backgroundColor: cat.color }}
                                    className="w-1.5 h-1.5 rounded-full opacity-70" 
                                  />
                                )}
                                {sym.name}
                              </motion.button>
                            );
                          })}
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="text-center py-16 border border-dashed border-slate-200 rounded-3xl bg-white/50">
                    <LucideIcons.SearchX className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">No matching symptoms cataloged</p>
                  </div>
                )}
              </div>
            )}

            {/* Description Section Segment */}
            <div className="mt-8 pt-6 border-t border-blue-100/60">
              <label className="text-base font-black text-slate-800 flex items-center gap-2 mb-2.5">
                <LucideIcons.FileText className="w-4 h-4 text-slate-400" />
                Describe Secondary Symptoms &amp; Duration <span className="text-slate-400 font-normal text-xs">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Ex: Continuous localized neural migraine headache persisting over 72 hours..."
                rows={3}
                className="w-full bg-white/80 border border-slate-200/80 rounded-2xl px-4 py-3.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all shadow-inner"
              />
            </div>

            {/* Submit Computing Action */}
            <motion.button
              onClick={analyze}
              disabled={analyzing || !canAnalyze}
              whileHover={canAnalyze && !analyzing ? { scale: 1.01 } : {}}
              whileTap={canAnalyze && !analyzing ? { scale: 0.99 } : {}}
              className={`w-full mt-6 h-14 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all duration-300 tracking-wide ${
                canAnalyze && !analyzing
                  ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-blue-500/20 hover:brightness-105 hover:shadow-indigo-500/30"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200/50"
              }`}
            >
              {analyzing ? (
                <>
                  <LucideIcons.Loader2 className="w-5 h-5 animate-spin" /> 
                  ENGINE MATRIX COMPUTING IN PROGRESS...
                </>
              ) : (
                <>
                  <LucideIcons.Sparkles className="w-5 h-5 text-blue-200" /> 
                  EXECUTE CLINICAL MATCH ANALYSIS
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* RESULTS FEEDBACK GRID MODULE */}
        <AnimatePresence mode="wait">
          {analyzing && <AnalyzingPanel key="analyzing" />}

          {error && !analyzing && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-rose-50 border border-rose-100 rounded-3xl p-6 flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center text-white shrink-0">
                <LucideIcons.AlertOctagon className="w-6 h-6" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="font-black text-rose-900 text-sm">Inbound Network Exception</p>
                <p className="text-xs text-rose-600/90 font-medium">{error}</p>
              </div>
            </motion.div>
          )}

          {result && !analyzing && (
            <motion.div key="results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className={`rounded-3xl p-6 text-white bg-gradient-to-br ${getSpecialtyGradient(result.matchedSpecialties[0])} shadow-xl relative overflow-hidden`}>
                <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 border border-white/20">
                    <LucideIcons.Activity className="w-6 h-6 text-white animate-pulse" />
                  </div>
                  <div className="flex-1 text-center sm:text-left space-y-0.5">
                    <h2 className="text-xl md:text-2xl font-black tracking-tight">
                      {result.matchedSpecialties.length === 1
                        ? `Primary Specialty Node: ${result.matchedSpecialties[0]}`
                        : `${result.matchedSpecialties.length} Diagnostics Streams Matched`}
                    </h2>
                    <p className="text-xs text-white/80 font-medium">Cross-matching complete. Rerouting vectors to appropriate registry personnel:</p>
                  </div>
                  <button onClick={reset} className="text-xs font-black bg-slate-900/40 border border-white/20 text-white px-4 py-2.5 rounded-xl hover:bg-slate-900/60 transition-colors shrink-0 tracking-wide uppercase">
                    Reset Matrix
                  </button>
                </div>
              </div>

              {result.doctors.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center shadow-md">
                  <LucideIcons.UserX className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="font-bold text-gray-700 text-sm mb-1">No Operational Personnel Found</p>
                  <p className="text-xs text-gray-400">There are currently no active consults scheduled under this registry block.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {result.matchedSpecialties.map((specialty) => {
                    const specialtyDoctors = result.doctors.filter(
                      (doc) => doc.specialty?.trim().toLowerCase() === specialty?.trim().toLowerCase()
                    );

                    if (specialtyDoctors.length === 0) return null;
                    const specialtyGrad = getSpecialtyGradient(specialty);

                    return (
                      <div key={specialty} className="space-y-4">
                        <div className="flex items-center gap-3">
                          <span className={`inline-block px-3.5 py-1.5 rounded-xl bg-gradient-to-r ${specialtyGrad} text-white font-black text-[10px] uppercase tracking-widest shadow-md`}>
                            {specialty} Registry Core
                          </span>
                          <div className="flex-1 h-px bg-slate-200" />
                          <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-md">{specialtyDoctors.length} Verified</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {specialtyDoctors.map((doc, idx) => (
                            <DoctorCard key={doc._id ?? doc.id ?? idx} doctor={doc} index={idx} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}