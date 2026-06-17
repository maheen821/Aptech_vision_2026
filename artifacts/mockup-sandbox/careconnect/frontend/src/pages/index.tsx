import { useState, useEffect, useRef } from "react";
import { useListDoctors, getListDoctorsQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, ShieldCheck, Clock, CalendarCheck, Heart, Brain, Bone, Sparkles,
  Baby, Wind, ChevronRight, ArrowRight, Phone, Mail, MessageCircle,
  MapPin, Send, CheckCircle2, Quote, X, Building2, Stethoscope, Activity
} from "lucide-react";

/* ─── Mock data ─────────────────────────────────────────── */
const HOME_FEATURED_DOCTORS = [
  { id: 1, name: "Dr. Sarah Johnson", specialty: "General Medicine", rating: 4.9, experience: 12, fee: 120, imageUrl: "/images/team-sarah.jpg" },
  { id: 2, name: "Dr. Rajan Patel", specialty: "Cardiology", rating: 4.8, experience: 15, fee: 200, imageUrl: "/images/team-rajan.jpg" },
  { id: 3, name: "Dr. Amanda Lin", specialty: "Neurology", rating: 4.7, experience: 10, fee: 180, imageUrl: "/images/team-amanda.jpg" },
];

const SPECIALTIES = [
  { icon: Heart, label: "Cardiologist", desc: "Heart & vascular specialist", color: "from-rose-500 to-red-500", bg: "bg-rose-50 hover:bg-rose-100", border: "border-rose-100 hover:border-rose-300", slug: "Cardiology" },
  { icon: Brain, label: "Neurologist", desc: "Brain & nervous system", color: "from-violet-500 to-purple-500", bg: "bg-violet-50 hover:bg-violet-100", border: "border-violet-100 hover:border-violet-300", slug: "Neurology" },
  { icon: Bone, label: "Orthopedic", desc: "Bones, joints & muscles", color: "from-amber-500 to-orange-500", bg: "bg-amber-50 hover:bg-amber-100", border: "border-amber-100 hover:border-amber-300", slug: "Orthopedics" },
  { icon: Sparkles, label: "Dermatologist", desc: "Skin & aesthetic care", color: "from-pink-500 to-rose-400", bg: "bg-pink-50 hover:bg-pink-100", border: "border-pink-100 hover:border-pink-300", slug: "Dermatology" },
  { icon: Baby, label: "Pediatrician", desc: "Children's health expert", color: "from-sky-500 to-cyan-500", bg: "bg-sky-50 hover:bg-sky-100", border: "border-sky-100 hover:border-sky-300", slug: "Pediatrics" },
  { icon: Wind, label: "Pulmonologist", desc: "Lung & respiratory care", color: "from-teal-500 to-emerald-500", bg: "bg-teal-50 hover:bg-teal-100", border: "border-teal-100 hover:border-teal-300", slug: "Pulmonology" },
];

const TESTIMONIALS = [
  { name: "Aisha Rahman", role: "Patient", avatar: "AR", color: "from-sky-400 to-cyan-500", rating: 5, text: "Very helpful doctor, smooth booking experience. I got an appointment within minutes. CareConnect changed how I approach my healthcare.", date: "April 2026" },
  { name: "James Miller", role: "Regular User", avatar: "JM", color: "from-emerald-400 to-teal-500", rating: 5, text: "The AI symptom checker is amazing! It accurately identified my condition and connected me with the right specialist immediately.", date: "March 2026" },
  { name: "Priya Kapoor", role: "Patient", avatar: "PK", color: "from-violet-400 to-purple-500", rating: 4, text: "Outstanding service. My doctor was professional and caring. The video consultation felt just as good as an in-person visit.", date: "March 2026" },
  { name: "David Chen", role: "Parent", avatar: "DC", color: "from-rose-400 to-pink-500", rating: 5, text: "Booked a pediatric appointment for my son at midnight. The doctor responded within 10 minutes. Truly 24/7 healthcare!", date: "February 2026" },
  { name: "Sara Malik", role: "Patient", avatar: "SM", color: "from-amber-400 to-orange-500", rating: 5, text: "CareConnect's emergency service is a lifesaver. I found the nearest hospital and got emergency care in record time.", date: "January 2026" },
];

const BLOG_POSTS = [
  { image: "/images/about-feature-1.jpg", tag: "Prevention", title: "How to Control Fever at Home", desc: "Simple and effective home remedies and when to seek medical attention for persistent fevers.", readTime: "3 min read" },
  { image: "/images/service-primary-care.jpg", tag: "Cardiology", title: "Heart Health Tips for 2026", desc: "Evidence-based lifestyle habits that cardiologists recommend for a stronger, healthier heart.", readTime: "5 min read" },
  { image: "/images/about-feature-3.jpg", tag: "Nutrition", title: "Healthy Diet Guide for Busy People", desc: "Quick, nutritious meal plans and snack ideas for professionals who are always on the go.", readTime: "4 min read" },
  { image: "/images/service-specialist.jpg", tag: "Skin", title: "Daily Skin Care Routine", desc: "A dermatologist-approved morning and evening skincare routine for all skin types.", readTime: "3 min read" },
];

const PARTNERS = [
  { name: "CityMed Hospital", abbr: "CM" },
  { name: "NovaCare Clinics", abbr: "NC" },
  { name: "MedPlus Network", abbr: "MP" },
  { name: "HealthBridge", abbr: "HB" },
  { name: "VitalCare", abbr: "VC" },
  { name: "PrimeMed", abbr: "PM" },
];

const STEPS = [
  { title: "Check Symptoms", desc: "Use our smart AI checker to identify potential conditions instantly.", icon: Stethoscope, color: "from-sky-500 to-cyan-500" },
  { title: "Find a Doctor", desc: "Match with top-rated specialists verified in your area.", icon: Star, color: "from-emerald-500 to-teal-500" },
  { title: "Book Instantly", desc: "Schedule at your convenience — same-day slots available.", icon: CalendarCheck, color: "from-violet-500 to-purple-500" },
];

const STATS = [
  { label: "Active Patients", value: "10,000+" },
  { label: "Expert Doctors", value: "500+" },
  { label: "Appointments", value: "25,000+" },
  { label: "Satisfaction", value: "4.9/5" },
];

/* ─── Live Chat Modal ───────────────────────────────────── */
function ChatModal({ onClose }: { onClose: () => void }) {
  const [msg, setMsg] = useState("");
  const [msgs, setMsgs] = useState([
    { from: "bot", text: "Hi! Welcome to CareConnect Support. How can I help you today? 👋" }
  ]);
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const REPLIES = [
    "I can help you book an appointment with the right specialist. What symptoms are you experiencing?",
    "Our doctors are available 24/7. Let me find the best match for you.",
    "I'll connect you with a specialist right away. Can you share more details?",
    "Thank you for reaching out! A healthcare coordinator will assist you shortly.",
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
    }, 1200);
  };

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
        className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-sky-100">
        <div className="bg-gradient-to-r from-sky-500 to-emerald-500 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">CareConnect Support</p>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" /><p className="text-white/80 text-xs">Online now</p></div>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"><X className="w-4 h-4" /></button>
        </div>
        <div className="h-64 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.from === "user" ? "bg-sky-500 text-white rounded-br-sm" : "bg-white text-gray-700 shadow-sm border border-gray-100 rounded-bl-sm"}`}>
                {m.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 shadow-sm px-4 py-2.5 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                {[0, 1, 2].map(i => <span key={i} className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
        <div className="px-4 py-3 border-t border-gray-100 bg-white flex gap-2">
          <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Type a message…" className="flex-1 h-10 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400" />
          <button onClick={send} className="w-10 h-10 rounded-xl bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main page ─────────────────────────────────────────── */
export default function Home() {
  const { data: doctors } = useListDoctors({}, { query: { queryKey: getListDoctorsQueryKey({}) } });
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactSent, setContactSent] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(i => (i + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const doctorsList = Array.isArray(doctors) ? doctors : (doctors as any)?.data ?? [];

const featuredDocs =
  doctorsList.length > 0
    ? doctorsList.slice(0, 3)
    : HOME_FEATURED_DOCTORS;

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => { setContactSent(true); setContactForm({ name: "", email: "", message: "" }); }, 600);
  };

  return (
    <div className="flex flex-col items-center w-full overflow-x-hidden" style={{ background: "linear-gradient(135deg, #ffffff 0%, #EBF5FF 50%, #f0fdf4 100%)" }}>

      {/* ─── HERO ─── */}
      <section className="w-full min-h-[90vh] flex items-center pt-20 pb-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 0% 50%, rgba(186,230,253,0.4) 0%, transparent 60%), radial-gradient(ellipse at 100% 30%, rgba(187,247,208,0.3) 0%, transparent 55%)" }} />
        <div className="absolute top-24 -left-32 w-96 h-96 bg-sky-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "4s" }} />
        <div className="absolute top-32 -right-32 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "5s" }} />

        <div className="container mx-auto max-w-6xl relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="flex-1 text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur border border-sky-200/60 text-sky-700 text-sm font-semibold shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              Your Smart Healthcare Partner
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Clinical confidence.<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-emerald-500">Approachable care.</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-xl mx-auto lg:mx-0">
              Find doctors, check symptoms, and book appointments in seconds. Premium healthcare that feels human.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/emergency">
                <Button size="lg" className="h-13 px-8 rounded-2xl bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-700 hover:to-rose-600 shadow-lg shadow-red-200 text-white font-bold gap-2 text-base">
                  🚨 Emergency Help
                </Button>
              </Link>
              <Link href="/doctors">
                <Button size="lg" variant="outline" className="h-13 px-8 rounded-2xl bg-white/80 backdrop-blur border-sky-200 hover:bg-sky-50 text-gray-700 font-semibold text-base gap-2">
                  <Stethoscope className="w-5 h-5 text-sky-500" /> Find a Doctor
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.15 }}
            className="flex-1 w-full max-w-lg">
            <div className="relative">
              <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl p-3 shadow-2xl shadow-sky-100/60 rotate-1 hover:rotate-0 transition-transform duration-500"
                style={{ boxShadow: "0 20px 60px rgba(14,165,233,0.12)" }}>
                <img src="/images/hero-doctor.jpg" alt="Doctor" className="rounded-2xl object-cover w-full h-[380px] shadow-sm" />
              </div>
              <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity }}
                className="absolute -left-10 top-16 bg-white/90 backdrop-blur-xl border border-sky-100 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-emerald-600 fill-current" />
                </div>
                <div><p className="text-sm font-bold text-gray-900">Top Rated</p><p className="text-xs text-gray-400">500+ Specialists</p></div>
              </motion.div>
              <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                className="absolute -right-6 bottom-20 bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                  <Activity className="w-5 h-5 text-sky-600" />
                </div>
                <div><p className="text-sm font-bold text-gray-900">24/7 Available</p><p className="text-xs text-gray-400">Always online</p></div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="w-full py-14 px-4 bg-white/60 backdrop-blur-sm border-y border-sky-100/60">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <h3 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-emerald-500">{s.value}</h3>
                <p className="text-gray-500 font-medium mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SPECIALTIES ─── */}
      <section className="w-full py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="inline-block bg-sky-50 border border-sky-200 text-sky-600 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">Specialties</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Find Your Specialist</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Click any specialty to instantly browse verified doctors in that field</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {SPECIALTIES.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <Link href={`/doctors?specialty=${s.slug}`}>
                  <div className={`group ${s.bg} border-2 ${s.border} rounded-2xl p-5 flex flex-col items-center text-center cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-200`}>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-md mb-3 group-hover:scale-110 transition-transform duration-200`}>
                      <s.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-bold text-gray-900 text-sm leading-tight">{s.label}</p>
                    <p className="text-xs text-gray-500 mt-1 leading-tight">{s.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="w-full py-20 px-4" style={{ background: "linear-gradient(135deg, #EBF5FF 0%, #f0fdf4 100%)" }}>
        <div className="container mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="inline-block bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">Process</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How CareConnect Works</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                <div className="bg-white/80 backdrop-blur border border-white/80 rounded-3xl p-8 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  style={{ boxShadow: "0 4px 24px rgba(14,165,233,0.06)" }}>
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg mb-5`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 text-sm font-bold flex items-center justify-center mx-auto mb-3">{i + 1}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED DOCTORS ─── */}
      <section className="w-full py-24 px-4 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <span className="inline-block bg-sky-50 border border-sky-200 text-sky-600 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">Our Team</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Specialists</h2>
              <p className="text-gray-500 mt-2">Highly rated doctors ready to help you today.</p>
            </div>
            <Link href="/doctors">
              <Button variant="outline" className="rounded-xl border-sky-200 text-sky-600 hover:bg-sky-50 gap-2 font-semibold shrink-0">
                View All Doctors <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredDocs.map((doc: { id: number; name: string; specialty:
             string; rating: number; experience: number; fee: number; imageUrl?: string }, i: number) => (
              <motion.div key={doc.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link href={`/doctor/${doc.id}`}>
                  <div className="group bg-white/80 backdrop-blur border border-gray-100 rounded-3xl overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-sky-100/60 hover:-translate-y-1 transition-all duration-300"
                    style={{ boxShadow: "0 4px 20px rgba(14,165,233,0.07)" }}>
                    <div className="h-48 overflow-hidden relative">
                      <img src={(doc as any).imageUrl || "/images/doctor-fallback.jpg"} alt={doc.name}
                        onError={e => { (e.target as HTMLImageElement).src = "/images/doctor-fallback.jpg"; }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-bold text-gray-900 flex items-center gap-1 shadow-sm">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-current" /> {doc.rating}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-0.5">{doc.name}</h3>
                      <p className="text-sky-600 font-semibold text-sm mb-4">{doc.specialty}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1.5 text-gray-400"><Clock className="w-4 h-4" /> {doc.experience} yrs exp</span>
                        <span className="font-bold text-emerald-600">${doc.fee}/visit</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="w-full py-24 px-4" style={{ background: "linear-gradient(135deg, #EBF5FF 0%, #f0fdf4 100%)" }}>
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="inline-block bg-rose-50 border border-rose-200 text-rose-500 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What Patients Say</h2>
          </motion.div>
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div key={activeTestimonial}
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
                className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-3xl p-8 md:p-10 shadow-xl shadow-sky-100/30"
                style={{ boxShadow: "0 8px 40px rgba(14,165,233,0.08)" }}
              >
                <Quote className="w-10 h-10 text-sky-200 mb-4" />
                <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">"{TESTIMONIALS[activeTestimonial].text}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${TESTIMONIALS[activeTestimonial].color} flex items-center justify-center text-white font-bold`}>
                      {TESTIMONIALS[activeTestimonial].avatar}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{TESTIMONIALS[activeTestimonial].name}</p>
                      <p className="text-sm text-gray-400">{TESTIMONIALS[activeTestimonial].role} · {TESTIMONIALS[activeTestimonial].date}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(n => <Star key={n} className={`w-4 h-4 ${n <= TESTIMONIALS[activeTestimonial].rating ? "text-amber-400 fill-current" : "text-gray-200"}`} />)}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="flex items-center justify-center gap-2 mt-6">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setActiveTestimonial(i)}
                  className={`rounded-full transition-all duration-300 ${i === activeTestimonial ? "w-8 h-2.5 bg-sky-500" : "w-2.5 h-2.5 bg-gray-300 hover:bg-sky-300"}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── HEALTH BLOG ─── */}
      <section className="w-full py-24 px-4 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="inline-block bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">Health Insights</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Health Tips & Articles</h2>
            <p className="text-gray-500 mt-3">Expert-written guides to keep you informed and healthy</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BLOG_POSTS.map((post, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <div className="group bg-white/80 border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col cursor-pointer"
                  style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
                  <div className="h-44 overflow-hidden relative">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <span className="absolute top-3 left-3 bg-white/90 text-sky-600 text-[11px] font-bold px-2.5 py-1 rounded-full">{post.tag}</span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-gray-900 mb-2 leading-snug">{post.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">{post.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{post.readTime}</span>
                      <span className="text-sky-600 text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">Read more <ChevronRight className="w-3 h-3" /></span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PARTNER HOSPITALS ─── */}
      <section className="w-full py-20 px-4" style={{ background: "linear-gradient(135deg, #EBF5FF 0%, #f0fdf4 100%)" }}>
        <div className="container mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="inline-block bg-sky-50 border border-sky-200 text-sky-600 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">Network</span>
            <h2 className="text-3xl font-bold text-gray-900">Partner Hospitals & Clinics</h2>
            <div className="flex items-center justify-center gap-4 mt-3">
              {["✔ Verified Hospitals", "✔ Trusted Clinics", "✔ Certified Network"].map(b => (
                <span key={b} className="text-sm text-emerald-600 font-semibold">{b}</span>
              ))}
            </div>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {PARTNERS.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <div className="group bg-white/80 border-2 border-gray-100 hover:border-sky-300 rounded-2xl p-5 flex flex-col items-center gap-3 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-110 transition-transform">
                    {p.abbr}
                  </div>
                  <p className="text-xs font-semibold text-gray-600 text-center leading-tight">{p.name}</p>
                  <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /><span className="text-[10px] text-emerald-600 font-semibold">Verified</span></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <section className="w-full py-24 px-4 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="inline-block bg-sky-50 border border-sky-200 text-sky-600 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">Support</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Contact & Support</h2>
            <p className="text-gray-500 mt-3">We're here for you 24/7 — reach out anytime</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* LEFT — Contact Info */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-5">
              {[
                { icon: Mail, label: "Email Support", value: "support@careconnect.health", color: "from-sky-400 to-cyan-500", light: "bg-sky-50 border-sky-100" },
                { icon: Phone, label: "Phone Number", value: "+1 (800) CARE-NOW", color: "from-emerald-400 to-teal-500", light: "bg-emerald-50 border-emerald-100" },
                { icon: Clock, label: "Working Hours", value: "24/7 — Always Available", color: "from-violet-400 to-purple-500", light: "bg-violet-50 border-violet-100" },
                { icon: MapPin, label: "Head Office", value: "123 Medical Center Drive, NYC", color: "from-rose-400 to-pink-500", light: "bg-rose-50 border-rose-100" },
              ].map(({ icon: Icon, label, value, color, light }) => (
                <div key={label} className={`flex items-center gap-5 p-5 ${light} border rounded-2xl`}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">{label}</p>
                    <p className="font-semibold text-gray-800">{value}</p>
                  </div>
                </div>
              ))}
              <button onClick={() => setChatOpen(true)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-sky-200/50 transition-all hover:scale-[1.02]">
                <MessageCircle className="w-5 h-5" /> 💬 Start Live Chat
              </button>
            </motion.div>

            {/* RIGHT — Contact Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-white/80 backdrop-blur-xl border border-sky-100 rounded-3xl p-8 shadow-xl shadow-sky-100/30"
              style={{ boxShadow: "0 8px 40px rgba(14,165,233,0.08)" }}>
              {contactSent ? (
                <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-500">Our team will get back to you within 24 hours.</p>
                  <button onClick={() => setContactSent(false)} className="mt-6 px-6 py-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 font-semibold text-sm hover:bg-sky-100 transition-colors">Send Another</button>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Send className="w-5 h-5 text-sky-500" /> Send a Message</h3>
                  <form onSubmit={handleContact} className="space-y-4">
                    {[
                      { label: "Your Name", key: "name", type: "text", placeholder: "Jane Smith" },
                      { label: "Email Address", key: "email", type: "email", placeholder: "you@example.com" },
                    ].map(({ label, key, type, placeholder }) => (
                      <div key={key} className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</label>
                        <input type={type} value={contactForm[key as keyof typeof contactForm]}
                          onChange={e => setContactForm(p => ({ ...p, [key]: e.target.value }))}
                          placeholder={placeholder}
                          className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition" />
                      </div>
                    ))}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Message</label>
                      <textarea value={contactForm.message} onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))}
                        placeholder="How can we help you?" rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 resize-none outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition" />
                    </div>
                    <button type="submit"
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-bold flex items-center justify-center gap-2 shadow-md shadow-sky-200/40 transition-all hover:scale-[1.02]">
                      <Send className="w-4 h-4" /> Send Message
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="w-full py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-3xl overflow-hidden relative bg-gradient-to-br from-sky-500 to-emerald-500 p-12 md:p-16 text-white text-center"
            style={{ boxShadow: "0 20px 60px rgba(14,165,233,0.25)" }}>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-5"><Heart className="w-7 h-7 text-white" /></div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Ready to take control of your health?</h2>
              <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">Join thousands of patients who've transformed their healthcare experience.</p>
              <Link href="/register">
                <Button size="lg" className="h-13 px-10 rounded-2xl bg-white text-sky-600 hover:bg-gray-50 font-bold text-base shadow-xl">
                  Get Started — It's Free
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── LIVE CHAT MODAL ─── */}
      <AnimatePresence>{chatOpen && <ChatModal onClose={() => setChatOpen(false)} />}</AnimatePresence>
    </div>
  );
}
