import React, { useState, useEffect, useRef } from "react";
import { useListDoctors, getListDoctorsQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Star, ShieldCheck, Clock, CalendarCheck, Heart, Brain, Bone, Sparkles,
  Baby, Wind, ChevronRight, ArrowRight, Phone, Mail, MessageCircle,
  MapPin, Send, CheckCircle2, Quote, X, Building2, Stethoscope, Activity,
  Search, SearchCheck, Filter, Users, UserCheck, ShieldAlert, Award, ArrowUpRight
} from "lucide-react";

/* ─── METADATA & CONFIGURATIONS ─────────────────────────────────────────── */
interface Doctor {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  experience: number;
  fee: number;
  imageUrl?: string;
  isOnline?: boolean;
  hospital?: string;
  reviewsCount?: number;
}

const HOME_FEATURED_DOCTORS: Doctor[] = [
  { id: 1, name: "Dr. Sarah Johnson", specialty: "General Medicine", rating: 4.9, reviewsCount: 142, experience: 12, fee: 120, imageUrl: "/images/team-sarah.jpg", isOnline: true, hospital: "CityMed Center" },
  { id: 2, name: "Dr. Rajan Patel", specialty: "Cardiology", rating: 4.8, reviewsCount: 98, experience: 15, fee: 200, imageUrl: "/images/team-rajan.jpg", isOnline: true, hospital: "NovaCare Premium" },
  { id: 3, name: "Dr. Amanda Lin", specialty: "Neurology", rating: 4.7, reviewsCount: 114, experience: 10, fee: 180, imageUrl: "/images/team-amanda.jpg", isOnline: false, hospital: "Mayo Clinic Allied" },
];

const SPECIALTIES = [
  { icon: Heart, label: "Cardiologist", desc: "Vascular systems", color: "from-cyan-500 to-blue-600", lightColor: "rgba(6,182,212,0.1)", slug: "Cardiology" },
  { icon: Brain, label: "Neurologist", desc: "Nervous systems", color: "from-blue-500 to-indigo-600", lightColor: "rgba(59,130,246,0.1)", slug: "Neurology" },
  { icon: Bone, label: "Orthopedic", desc: "Bone & musculoskeletal", color: "from-emerald-500 to-teal-600", lightColor: "rgba(16,185,129,0.1)", slug: "Orthopedics" },
  { icon: Sparkles, label: "Dermatologist", desc: "Advanced skincare", color: "from-teal-400 to-emerald-500", lightColor: "rgba(45,212,191,0.1)", slug: "Dermatology" },
  { icon: Baby, label: "Pediatrician", desc: "Infant & youth care", color: "from-sky-400 to-blue-500", lightColor: "rgba(56,189,248,0.1)", slug: "Pediatrics" },
  { icon: Wind, label: "Pulmonologist", desc: "Respiratory health", color: "from-cyan-400 to-emerald-500", lightColor: "rgba(34,211,238,0.1)", slug: "Pulmonology" },
];

const TESTIMONIALS = [
  { name: "Aisha Rahman", role: "Verified Patient", avatar: "AR", color: "from-cyan-400 to-blue-500", rating: 5, text: "CareConnect transformed how I view clinical visits. The interface is stunningly clean, and I arranged a diagnostic pipeline with a leading neurologist within minutes.", date: "May 2026" },
  { name: "James Miller", role: "Corporate Client", avatar: "JM", color: "from-emerald-400 to-teal-500", rating: 5, text: "The onboard AI health module pinpointed my prodromal indicators accurately. Connecting directly with an open cardiology suite saved us critical transit time.", date: "April 2026" },
  { name: "Priya Kapoor", role: "Chronic Care Patient", avatar: "PK", color: "from-blue-400 to-indigo-500", rating: 5, text: "Telehealth solutions usually feel dry, but this digital experience is world-class. Absolute clarity during the consultation and seamless clinical notes syncing.", date: "April 2026" },
];

const BLOG_POSTS = [
  { image: "/images/about-feature-1.jpg", tag: "Clinical Science", title: "Metabolic Homeostasis & Internal Thermoregulation", desc: "A scientific examination of continuous homeostatic balancing loops and advanced threshold criteria for direct intervention.", readTime: "4 min read", author: "Dr. Ethan Vance" },
  { image: "/images/service-primary-care.jpg", tag: "Cardiology", title: "Cardiovascular Risk Mitigation Profiles", desc: "Evaluating novel operational biomarkers and preventative physiological protocols recommended for dynamic lifestyles.", readTime: "7 min read", author: "Dr. Rajan Patel" },
  { image: "/images/about-feature-3.jpg", tag: "Nutritional Science", title: "Biochemically Optimized Dietary Architecture", desc: "How micronutrient timing controls oxidative strain and preserves daily cognitive metrics in high-efficiency professional environments.", readTime: "6 min read", author: "Elena Rostova, PhD" },
  { image: "/images/service-specialist.jpg", tag: "Dermatology", title: "Epidermal Barrier Protection Matrix", desc: "An architectural review of topical cellular reinforcement strategies customized for variable environmental pressures.", readTime: "5 min read", author: "Dr. Sarah Johnson" },
];

const PARTNERS = [
  { name: "Johns Hopkins International", location: "Baltimore, MD", level: "Tier-1 Hub" },
  { name: "Mayo Medical Network", location: "Rochester, MN", level: "Research Affiliate" },
  { name: "Cleveland Clinic Systems", location: "Cleveland, OH", level: "Cardio Excellence" },
  { name: "Stanford Healthcare Labs", location: "Stanford, CA", level: "AI Integration Partner" },
  { name: "Massachusetts General", location: "Boston, MA", level: "Trauma Network" },
  { name: "Cedars-Sinai Medical", location: "Los Angeles, CA", level: "Premium Care Node" },
];

const STATS = [
  { label: "Active Annual Patients", value: "48k+", trend: "+12% MoM" },
  { label: "Vetted Board Specialists", value: "620+", trend: "Top 2% Selection" },
  { label: "Digital Transformations", value: "180k+", trend: "99.4% Uptime" },
  { label: "Global Quality Metric", value: "4.96/5", trend: "ISO Certified" },
];

/* ─── STRUCTURAL ANIMATION PRESETS ───────────────────────────────────── */
const FADE_IN_UP = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } }
};

const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

/* ─── INTERACTIVE AI SYMPTOM CHECKER PANEL ────────────────────────────── */
function AISymptomModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [symptomInput, setSymptomInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<any>(null);

  const triggerAnalysis = () => {
    if (!symptomInput.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setStep(2);
      setAiReport({
        triageCode: "AMBULATORY_CARE",
        matchConfidence: "94%",
        probableCause: "Acute Respiratory Hyperreactivity / Seasonal Atopic Response",
        recommendedSpecialty: "Pulmonology or Allergy & Immunology",
        suggestedAction: "Schedule a high-priority telemedicine screening within 24-48 hours. Avoid structural tracking metrics until physical evaluation."
      });
    }, 2400);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4">
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        className="w-full max-w-lg bg-white/90 backdrop-blur-2xl rounded-[32px] border border-white/40 shadow-[0_32px_64px_-16px_rgba(15,23,42,0.2)] overflow-hidden">
        
        <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-blue-950 p-6 text-white relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center backdrop-blur">
              <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold tracking-tight text-lg">Synapse™ Core Diagnostics</h3>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-mono px-1.5 py-0.5 rounded-md">V2.6-AI</span>
              </div>
              <p className="text-slate-400 text-xs">Automated Clinical Classification Protocol</p>
            </div>
          </div>
          <button onClick={onClose} className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 bg-slate-50/50">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div key="step1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                <div className="bg-cyan-50 border border-cyan-100 p-4 rounded-2xl flex gap-3">
                  <ShieldAlert className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-cyan-800 leading-relaxed">
                    <strong>Disclaimer:</strong> This automated interface assesses categorical risks. It is not an emergency triage tool or definitive replacement for qualified practitioner directives.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Describe Current Physiological Symptoms</label>
                  <textarea
                    value={symptomInput}
                    onChange={(e) => setSymptomInput(e.target.value)}
                    placeholder="e.g., Persistent dry thoracic cough for 4 days, exacerbated during noctural hours, accompanied by mild subfebrile temperature..."
                    rows={4}
                    className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm text-slate-800 focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition"
                  />
                </div>

                <Button 
                  disabled={isAnalyzing || !symptomInput.trim()} 
                  onClick={triggerAnalysis}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold transition-all shadow-md shadow-cyan-500/10"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: "300ms" }} />
                      <span className="text-sm font-medium">Parsing Medical Nomenclature...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 justify-center">
                      <SearchCheck className="w-4 h-4" /> Run AI Synthesizer
                    </div>
                  )}
                </Button>
              </motion.div>
            ) : (
              <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Primary Synthetic Conclusion</span>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{aiReport?.probableCause}</p>
                  </div>
                  <hr className="border-slate-100" />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Target Specialty</span>
                      <p className="text-xs font-semibold text-cyan-600 mt-0.5">{aiReport?.recommendedSpecialty}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Confidence Scale</span>
                      <p className="text-xs font-semibold text-emerald-600 mt-0.5">{aiReport?.matchConfidence}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-900 text-slate-300 rounded-2xl text-xs leading-relaxed space-y-1.5">
                  <p className="font-bold text-white text-xs">Direct Operating Procedure:</p>
                  <p>{aiReport?.suggestedAction}</p>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-11 border-slate-200 text-slate-700 rounded-xl">
                    Re-evaluate
                  </Button>
                  <Link href={`/doctors?specialty=Pulmonology`} className="flex-1">
                    <Button className="w-full h-11 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-xl gap-1.5">
                      Match Doctors <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── LIVE CHAT MODULE ─────────────────────────────────────────────────── */
function ChatModal({ onClose }: { onClose: () => void }) {
  const [msg, setMsg] = useState("");
  const [msgs, setMsgs] = useState([
    { from: "bot", text: "Systems operational. Welcome to CareConnect Concierge. Please input your diagnostic ID or specify scheduling inquiries." }
  ]);
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const REPLIES = [
    "Routing query to our triage management queue. Estimated verification lag is currently under 3 minutes.",
    "Database indexing confirms immediate open slots for digital telemedicine consulting today. Shall I secure a time-window?",
    "Your current token is validated. Please provide localized insurance group frameworks if seeking automated direct-billing settlement.",
  ];

  const send = () => {
    if (!msg.trim()) return;
    const userMsg = msg.trim();
    setMsgs(p => [...p, { from: "user", text: userMsg }]);
    setMsg("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs(p => [...p, { from: "bot", text: REPLIES[Math.floor(Math.random() * REPLIES.length)] }]);
    }, 1100);
  };

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-end sm:items-center justify-end p-4 sm:p-6 bg-slate-950/20 backdrop-blur-sm">
      <motion.div initial={{ y: 50, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 50, scale: 0.95 }}
        className="w-full max-w-md bg-white rounded-[28px] shadow-[0_24px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 to-blue-950 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Clinical Coordinator Node</p>
              <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /><p className="text-slate-400 text-[11px]">System Latency: 14ms</p></div>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"><X className="w-3.5 h-3.5" /></button>
        </div>
        
        <div className="h-80 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50/50">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed font-medium ${m.from === "user" ? "bg-blue-600 text-white rounded-br-sm" : "bg-white text-slate-700 shadow-sm border border-slate-100 rounded-bl-sm"}`}>
                {m.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-100 shadow-sm px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                {[0, 1, 2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="px-4 py-3 border-t border-slate-100 bg-white flex gap-2">
          <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Input messaging system payload..." className="flex-1 h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium" />
          <button onClick={send} className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center transition-colors">
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── PLATFORM SYSTEM ENGINE ───────────────────────────────────────────── */
export default function Home() {
  const { data: doctors } = useListDoctors({}, { query: { queryKey: getListDoctorsQueryKey({}) } });
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactSent, setContactSent] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setActiveTestimonial(i => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const doctorsList = Array.isArray(doctors) ? doctors : (doctors as any)?.data ?? [];
  const featuredDocs = doctorsList.length > 0 ? doctorsList.slice(0, 3) : HOME_FEATURED_DOCTORS;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setContactSent(true);
    setContactForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="w-full min-h-screen bg-[#FAFCFF] text-slate-900 font-sans selection:bg-cyan-500/20 overflow-x-hidden relative">
      
      {/* BACKGROUND VECTOR DECORATIONS */}
      <div className="absolute top-0 inset-x-0 h-[1000px] bg-gradient-to-b from-cyan-500/5 via-blue-500/5 to-transparent pointer-events-none z-0" />
      <div className="absolute top-[12%] left-[-10%] w-[50vw] h-[50vw] bg-radial-gradient from-cyan-400/10 to-transparent blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[35%] right-[-10%] w-[45vw] h-[45vw] bg-radial-gradient from-emerald-400/10 to-transparent blur-[100px] rounded-full pointer-events-none" />

      {/* ─── HERO CONTAINER ─── */}
      <section className="w-full min-h-screen flex items-center pt-28 pb-20 px-4 md:px-8 relative z-10">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* LEFT CONTENT COL */}
          <motion.div 
            initial="hidden" animate="visible" variants={STAGGER_CONTAINER}
            className="lg:col-span-7 space-y-8 text-center lg:text-left"
          >
            <motion.div variants={FADE_IN_UP} className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/60 border border-slate-200/80 backdrop-blur-md shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
              <span className="text-[11px] font-bold tracking-wider text-slate-700 uppercase">Automated Health Networks</span>
            </motion.div>

            <motion.h1 variants={FADE_IN_UP} className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.05]">
              The sovereign standard in <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 via-blue-600 to-emerald-600">
                Medical Infrastructure.
              </span>
            </motion.h1>

            <motion.p variants={FADE_IN_UP} className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Synthesize clinic diagnostics, map regional practitioners, and book premium clinical pathways instantaneously. Backed by automated tier-one verification.
            </motion.p>

            {/* INTEGRATED SEARCH SYSTEM */}
            <motion.div variants={FADE_IN_UP} className="w-full max-w-2xl mx-auto lg:mx-0 p-2 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl sm:rounded-3xl shadow-[0_20px_48px_-12px_rgba(148,163,184,0.25)] flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center gap-3 px-3 py-2">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Query conditions, procedural specialties, or practitioner keys..." 
                  className="w-full bg-transparent border-none text-slate-800 text-sm font-medium outline-none placeholder:text-slate-400"
                />
              </div>
              <div className="flex gap-2 sm:w-auto">
                <Button onClick={() => setAiOpen(true)} variant="outline" className="flex-1 sm:flex-none h-12 px-4 rounded-xl border-slate-200 text-slate-700 bg-white hover:bg-slate-50 gap-2 text-xs font-bold">
                  <Activity className="w-4 h-4 text-cyan-500" /> Synthesize
                </Button>
                <Link href={`/doctors?q=${encodeURIComponent(searchTerm)}`} className="flex-1 sm:flex-none">
                  <Button className="w-full h-12 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all">
                    Search Systems
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* ACTION TRIGGERS & TRUST SIGNALS */}
            <motion.div variants={FADE_IN_UP} className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span className="text-xs font-semibold text-slate-600">HIPAA Compliant Node</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200 hidden sm:block" />
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-cyan-500" />
                <span className="text-xs font-semibold text-slate-600">Direct Insured Verification</span>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT VISUAL COL */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="w-full max-w-md mx-auto relative group">
              
              {/* BACKPLANE GLASS GLOW */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500 to-blue-500 rounded-[40px] opacity-20 blur-xl group-hover:opacity-25 transition duration-500" />
              
              {/* PRIMARY GRAPHIC CONTAINER */}
              <div className="relative bg-white/40 border border-white/60 backdrop-blur-xl rounded-[36px] p-3 shadow-[0_32px_64px_-16px_rgba(148,163,184,0.3)]">
                <div className="rounded-[28px] overflow-hidden bg-slate-100 aspect-[4/5] relative">
                  <img src="/images/hero-doctor.jpg" alt="Clinical Operations" className="w-full h-full object-cover transition duration-700 group-hover:scale-102" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                </div>
              </div>

              {/* FLOATING REALTIME MONITOR CARD */}
              <motion.div 
                animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-8 top-[20%] bg-white/90 backdrop-blur-xl border border-slate-100 rounded-2xl p-4 shadow-[0_16px_32px_rgba(15,23,42,0.08)] flex items-center gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Practitioner Vetting</p>
                  <p className="text-sm font-extrabold text-slate-900 mt-0.5">100% Board Certified</p>
                </div>
              </motion.div>

              {/* FLOATING TELEMETRY CARD */}
              <motion.div 
                animate={{ y: [0, 8, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -right-6 bottom-[15%] bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 shadow-[0_16px_32px_rgba(15,23,42,0.08)] flex items-center gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Triage Pipeline</p>
                  <p className="text-sm font-extrabold text-slate-900 mt-0.5">Live 24/7 Connectivity</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ─── REALTIME TELEMETRY METRICS (STATS) ─── */}
      <section className="w-full py-16 bg-white border-y border-slate-200/50 relative z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 divide-x-0 lg:divide-x divide-slate-100">
            {STATS.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="text-center lg:text-left lg:px-8 first:pl-0"
              >
                <span className="text-[10px] font-bold uppercase text-cyan-600 tracking-wider block mb-1">{stat.trend}</span>
                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROCEDURAL SPECIALTIES SECTION ─── */}
      <section className="w-full py-28 px-4 md:px-8 max-w-7xl mx-auto relative z-20">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6 text-center md:text-left">
          <div>
            <span className="text-xs font-bold text-cyan-600 uppercase tracking-widest block mb-2">System Taxonomy</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Browse via Specialized Units</h2>
          </div>
          <p className="text-slate-500 font-medium text-sm max-w-md">
            Direct interface entry points mapped across standard diagnostic tracks. Selecting maps localized queues instantly.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {SPECIALTIES.map((spec, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <Link href={`/doctors?specialty=${spec.slug}`}>
                <div className="h-full bg-white border border-slate-200/60 rounded-2xl p-6 flex flex-col justify-between items-start cursor-pointer shadow-[0_4px_16px_rgba(148,163,184,0.04)] hover:shadow-[0_20px_32px_-8px_rgba(148,163,184,0.15)] hover:border-slate-300 transition-all group">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105" style={{ backgroundColor: spec.lightColor }}>
                    <spec.icon className="w-5 h-5 text-slate-800" />
                  </div>
                  <div className="mt-8">
                    <h4 className="font-bold text-slate-900 text-sm tracking-tight">{spec.label}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{spec.desc}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── EXPERT PRACTITIONER CAPACITIES (DOCTOR CARDS) ─── */}
      <section className="w-full py-28 bg-slate-50/60 border-y border-slate-200/30 px-4 md:px-8 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-16 gap-6 text-center sm:text-left">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2">Vetted Deployments</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Featured On-Call Specialists</h2>
            </div>
            <Link href="/doctors">
              <Button variant="outline" className="h-11 rounded-xl border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-bold gap-2">
                Analyze Total Ledger <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredDocs.map((doc, idx) => (
              <motion.div 
                key={doc.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="bg-white border border-slate-200/50 rounded-3xl overflow-hidden shadow-[0_8px_24px_rgba(148,163,184,0.05)] hover:shadow-[0_32px_48px_-12px_rgba(148,163,184,0.18)] transition-all flex flex-col group"
              >
                {/* HEAD PHOTO SUITE */}
                <div className="h-56 bg-slate-100 relative overflow-hidden">
                  <img 
                    src={doc.imageUrl || "/images/doctor-fallback.jpg"} 
                    alt={doc.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    onError={e => { (e.target as HTMLImageElement).src = "/images/doctor-fallback.jpg"; }}
                  />
                  
                  {/* METRIC BADGES BAR */}
                  <div className="absolute top-4 inset-x-4 flex justify-between items-center pointer-events-none">
                    <span className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur text-[10px] font-black text-slate-900 flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {doc.rating} ({doc.reviewsCount || 45})
                    </span>
                    
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase shadow-sm ${doc.isOnline ? "bg-emerald-500 text-white" : "bg-slate-900 text-white"}`}>
                      {doc.isOnline ? "Active Video Room" : "In-Clinic Only"}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur text-[10px] font-bold text-white tracking-wide uppercase">
                      {doc.hospital || "Core Facility"}
                    </span>
                  </div>
                </div>

                {/* PROTOCOL DATA PANEL */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <div>
                    <span className="text-[11px] font-bold text-cyan-600 uppercase tracking-wider">{doc.specialty}</span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1 tracking-tight">{doc.name}</h3>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 mt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-semibold text-slate-500">{doc.experience} Years Exp</span>
                      </div>
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-xs text-slate-400">Base Fee:</span>
                        <span className="text-sm font-black text-slate-900">${doc.fee}</span>
                      </div>
                    </div>
                  </div>

                  <Link href={`/doctor/${doc.id}`} className="w-full">
                    <Button className="w-full h-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors">
                      Engage Booking Protocol
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INTEGRATED TRIAL MARQUEE (PARTNERS) ─── */}
      <section className="w-full py-16 bg-white overflow-hidden relative border-b border-slate-200/40 z-20">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        
        <div className="w-full max-w-7xl mx-auto px-4 mb-8 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Affiliated Enterprise Networks</span>
        </div>

        {/* INFINITE LOOP CONTAINER */}
        <div className="flex w-max gap-8 animate-marquee">
          {[...PARTNERS, ...PARTNERS].map((partner, idx) => (
            <div key={idx} className="px-6 py-4 bg-slate-50 border border-slate-200/50 rounded-2xl flex items-center gap-4 shrink-0 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-mono text-xs font-bold">
                {partner.name.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{partner.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[9px] font-medium text-slate-400">{partner.location}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span className="text-[9px] font-bold text-cyan-600">{partner.level}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TESTIMONIAL CAROUSEL ─── */}
      <section className="w-full py-28 px-4 md:px-8 max-w-4xl mx-auto relative z-20">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-cyan-600 uppercase tracking-widest block mb-2">Quality Validation</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Empirical Patient Experiences</h2>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTestimonial}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35 }}
              className="bg-white border border-slate-200/60 rounded-[32px] p-8 md:p-10 shadow-[0_24px_48px_-12px_rgba(148,163,184,0.15)] relative"
            >
              <Quote className="w-12 h-12 text-slate-100 absolute top-8 left-8 -z-0 pointer-events-none" />
              <div className="relative z-10 space-y-6">
                <p className="text-slate-700 text-base md:text-lg font-medium leading-relaxed italic">
                  "{TESTIMONIALS[activeTestimonial].text}"
                </p>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${TESTIMONIALS[activeTestimonial].color} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                      {TESTIMONIALS[activeTestimonial].avatar}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm tracking-tight">{TESTIMONIALS[activeTestimonial].name}</p>
                      <p className="text-[11px] text-slate-400 font-medium">{TESTIMONIALS[activeTestimonial].role} · {TESTIMONIALS[activeTestimonial].date}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: TESTIMONIALS[activeTestimonial].rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* DOT CONTROLS */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {TESTIMONIALS.map((_, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveTestimonial(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${idx === activeTestimonial ? "w-6 bg-slate-900" : "w-2 bg-slate-200 hover:bg-slate-300"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── CLINICAL LITERACY (HEALTH BLOGS) ─── */}
      <section className="w-full py-28 bg-slate-50/40 border-t border-slate-200/40 px-4 md:px-8 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block">Knowledge Bases</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Verified Clinical Intelligence</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BLOG_POSTS.map((post, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border border-slate-200/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col h-full group cursor-pointer"
              >
                <div className="h-44 bg-slate-200 relative overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent" />
                  <span className="absolute top-3 left-3 bg-white/95 backdrop-blur text-[9px] font-bold text-slate-800 px-2 py-0.5 rounded-md shadow-sm uppercase tracking-wide">
                    {post.tag}
                  </span>
                </div>
                
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400">By {post.author}</p>
                    <h3 className="font-bold text-slate-900 text-sm mt-1 leading-snug tracking-tight group-hover:text-cyan-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">{post.desc}</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-50 text-[11px] font-bold">
                    <span className="text-slate-400 font-medium">{post.readTime}</span>
                    <span className="text-slate-900 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Parse Engine <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECURE COMMUNICATIONS INTEGRATION (CONTACT) ─── */}
      <section className="w-full py-28 px-4 md:px-8 max-w-7xl mx-auto relative z-20">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <span className="text-xs font-bold text-cyan-600 uppercase tracking-widest block">Support Grid</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Open Operational Interfaces</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT SYSTEM DATA */}
          <div className="lg:col-span-5 space-y-4">
            {[
              { icon: Mail, title: "Automated Ingestion Mail", detail: "inbound@careconnect.health" },
              { icon: Phone, title: "VoIP Primary Exchange", detail: "+1 (888) 227-3669" },
              { icon: MapPin, title: "Centralized Topology Node", detail: "Level 42, Omnitower, New York, NY" }
            ].map((node, idx) => (
              <div key={idx} className="p-5 bg-white border border-slate-200/60 rounded-2xl flex items-center gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700 shrink-0">
                  <node.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{node.title}</p>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">{node.detail}</p>
                </div>
              </div>
            ))}

            <button 
              onClick={() => setChatOpen(true)}
              className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.01]"
            >
              <MessageCircle className="w-4 h-4" /> Initialize Live Encrypted Chat
            </button>
          </div>

          {/* RIGHT CONTACT FORM */}
          <div className="lg:col-span-7 bg-white border border-slate-200/60 rounded-[32px] p-6 sm:p-8 shadow-[0_20px_40px_-12px_rgba(148,163,184,0.1)]">
            {contactSent ? (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Transmission Dispatched Successfully</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">Your verification parameters have entered active state queues. Standby for sync.</p>
                <button onClick={() => setContactSent(false)} className="text-xs font-bold text-cyan-600 underline">File Additional Payload</button>
              </motion.div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Identity Parameter</label>
                    <input 
                      type="text" required
                      value={contactForm.name}
                      onChange={e => setContactForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="e.g. Sterling Archer" 
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium outline-none focus:border-slate-400 transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Routing Address (Email)</label>
                    <input 
                      type="email" required
                      value={contactForm.email}
                      onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="e.g. archer@isis.org" 
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium outline-none focus:border-slate-400 transition"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Inquiry Log Text</label>
                  <textarea 
                    rows={4} required
                    value={contactForm.message}
                    onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))}
                    placeholder="Provide continuous structural details..."
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium outline-none focus:border-slate-400 resize-none transition"
                  />
                </div>
                <Button type="submit" className="w-full h-11 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-xs shadow-md">
                  Execute Transmission
                </Button>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* ─── MACRO SYSTEM TERMINAL (FINAL CTA) ─── */}
      <section className="w-full py-24 px-4 md:px-8 max-w-5xl mx-auto relative z-20">
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 border border-slate-800 rounded-[40px] p-8 md:p-14 text-center text-white relative overflow-hidden shadow-[0_32px_64px_-24px_rgba(15,23,42,0.6)]">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="relative z-10 space-y-6 max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
              <Heart className="w-5 h-5 text-cyan-400" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Begin structural platform optimization today.</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
              Establish clinical tracking profiles, coordinate with high-tier diagnostics registries, and finalize infrastructure architecture parameters seamlessly.
            </p>
            <div className="pt-2">
              <Link href="/register">
                <Button size="lg" className="h-12 px-8 rounded-xl bg-white text-slate-900 hover:bg-slate-50 font-extrabold text-xs tracking-wide shadow-md">
                  Initialize Sovereign Access Token
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FLOATING AI ASSISTANT FIXED ACTUATOR ─── */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setAiOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-[0_12px_24px_rgba(6,182,212,0.3)] border border-cyan-400/20 relative group"
        >
          <Activity className="w-5 h-5" />
          <span className="absolute right-16 top-1.5 px-3 py-1 rounded-lg bg-slate-900 text-white text-[10px] font-bold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap shadow">
            AI Diagnostics Engine
          </span>
        </motion.button>
      </div>

      {/* MODAL MOUNT POINTS */}
      <AnimatePresence>{aiOpen && <AISymptomModal onClose={() => setAiOpen(false)} />}</AnimatePresence>
      <AnimatePresence>{chatOpen && <ChatModal onClose={() => setChatOpen(false)} />}</AnimatePresence>

    </div>
  );
}