import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Phone, MessageCircle, Search, AlertTriangle, Navigation,
  X, Send, Star, Clock, Loader2, ShieldAlert, Mic, MicOff,
  PhoneOff, Volume2, Calendar, CheckCircle2, User, FileText,
  Activity, Ambulance, Zap, Heart, ChevronRight, PhoneCall
} from "lucide-react";

/* ─── DATA ─────────────────────────────────────────────── */

const ALL_HOSPITALS: Record<string, any[]> = {
  default: [
    { id: 1, name: "City General Hospital", area: "Downtown", address: "123 Main St", distance: "0.4 mi", open: true, phone: "+1 (212) 555-0101", rating: 4.8, reviews: 1240, services: ["ICU", "Trauma", "ER"], image: "/images/service-emergency.jpg" },
    { id: 2, name: "St. Mary's Medical Center", area: "Midtown", address: "456 Park Ave", distance: "0.8 mi", open: true, phone: "+1 (212) 555-0202", rating: 4.6, reviews: 980, services: ["Cardiac", "Pediatric", "ER"], image: "/images/about-hero.jpg" },
    { id: 3, name: "Metropolitan Hospital", area: "Uptown", address: "789 Broadway", distance: "1.2 mi", open: true, phone: "+1 (212) 555-0303", rating: 4.7, reviews: 1560, services: ["Neuro", "Orthopedic", "ER"], image: "/images/about-feature-1.jpg" },
    { id: 4, name: "Downtown Emergency Clinic", area: "Financial Dist.", address: "321 5th Ave", distance: "1.7 mi", open: false, phone: "+1 (212) 555-0404", rating: 4.4, reviews: 720, services: ["ER", "Urgent Care"], image: "/images/about-feature-2.jpg" },
  ],
  karachi: [
    { id: 1, name: "Aga Khan University Hospital", area: "Stadium Road", address: "Stadium Rd, Karachi", distance: "0.6 mi", open: true, phone: "+92 21 3493 0051", rating: 4.9, reviews: 5200, services: ["ICU", "Trauma", "Cardiac"], image: "/images/service-emergency.jpg" },
    { id: 2, name: "Liaquat National Hospital", area: "Gulshan", address: "Liaquat Natnl Hospital Rd", distance: "1.1 mi", open: true, phone: "+92 21 3412 1011", rating: 4.7, reviews: 3100, services: ["ER", "Neuro", "Orthopedic"], image: "/images/about-hero.jpg" },
    { id: 3, name: "Ziauddin Hospital", area: "Clifton", address: "4/B Shahra-e-Ghalib", distance: "1.8 mi", open: true, phone: "+92 21 111 000 260", rating: 4.6, reviews: 2700, services: ["Cardiac", "ICU", "ER"], image: "/images/about-feature-1.jpg" },
    { id: 4, name: "South City Hospital", area: "DHA", address: "Block 7, Clifton", distance: "2.3 mi", open: false, phone: "+92 21 3589 8901", rating: 4.4, reviews: 1100, services: ["ER", "Pediatric"], image: "/images/about-feature-2.jpg" },
  ],
  gulshan: [
    { id: 1, name: "Liaquat National Hospital", area: "Gulshan-e-Iqbal", address: "Liaquat National Hospital Rd", distance: "0.3 mi", open: true, phone: "+92 21 3412 1011", rating: 4.8, reviews: 3100, services: ["ER", "Trauma", "ICU"], image: "/images/service-emergency.jpg" },
    { id: 2, name: "Gulshan Medical Center", area: "Gulshan Block 6", address: "Block 6, PECHS", distance: "0.7 mi", open: true, phone: "+92 21 3498 0012", rating: 4.5, reviews: 860, services: ["ER", "Urgent Care"], image: "/images/about-hero.jpg" },
  ],
  dha: [
    { id: 1, name: "South City Hospital", area: "DHA Phase 2", address: "Block 7, Clifton", distance: "0.4 mi", open: true, phone: "+92 21 3589 8901", rating: 4.6, reviews: 1100, services: ["ER", "Pediatric", "ICU"], image: "/images/service-emergency.jpg" },
    { id: 2, name: "Shifa International (DHA)", area: "DHA Phase 6", address: "Plot 62 DHA", distance: "1.2 mi", open: true, phone: "+92 21 3599 1234", rating: 4.7, reviews: 1900, services: ["Cardiac", "Trauma", "ER"], image: "/images/about-feature-3.jpg" },
  ],
  "north nazimabad": [
    { id: 1, name: "Abbasi Shaheed Hospital", area: "North Nazimabad", address: "Block B, N. Nazimabad", distance: "0.5 mi", open: true, phone: "+92 21 3661 2345", rating: 4.4, reviews: 890, services: ["ER", "ICU"], image: "/images/service-emergency.jpg" },
    { id: 2, name: "Hussaini Hospital", area: "Abbas Town", address: "Abbas Town, Karachi", distance: "0.9 mi", open: true, phone: "+92 21 3663 4567", rating: 4.3, reviews: 740, services: ["ER", "Urgent Care"], image: "/images/about-feature-4.jpg" },
  ],
};

const DOCTORS = [
  { id: 1, name: "Dr. Sarah Johnson", specialty: "Emergency Physician", experience: 12, rating: 4.9, reviews: 340, fee: 150, available: true, image: "/images/team-sarah.jpg", location: "Downtown Medical Center" },
  { id: 2, name: "Dr. Rajan Patel", specialty: "Cardiologist", experience: 15, rating: 4.8, reviews: 520, fee: 200, available: true, image: "/images/team-rajan.jpg", location: "City Heart Institute" },
  { id: 3, name: "Dr. Amanda Lin", specialty: "Trauma Specialist", experience: 10, rating: 4.7, reviews: 280, fee: 180, available: true, image: "/images/team-amanda.jpg", location: "Metro Trauma Center" },
  { id: 4, name: "Dr. Lin Wei", specialty: "Neurologist", experience: 18, rating: 4.9, reviews: 610, fee: 220, available: false, image: "/images/team-lin.jpg", location: "Neuro Excellence Clinic" },
  { id: 5, name: "Dr. Marcus Brown", specialty: "Pulmonologist", experience: 13, rating: 4.6, reviews: 390, fee: 170, available: true, image: "/images/hero-doctor.jpg", location: "Lung & Chest Specialists" },
  { id: 6, name: "Dr. Elena Vazquez", specialty: "Cardiologist", experience: 9, rating: 4.8, reviews: 270, fee: 190, available: true, image: "/images/doctor-fallback.jpg", location: "Heart & Vascular Institute" },
];

const DOCTOR_REPLIES = [
  "I understand. Please describe your symptoms in detail so I can assist better.",
  "Based on what you've shared, immediate attention may be needed. Are you near a hospital?",
  "Please stay calm. Can you tell me your current vital signs if available?",
  "I'll prioritize your case. How long have you been experiencing this?",
  "Do you have any known allergies or ongoing medications? This is important.",
  "I recommend calling 911 immediately if symptoms are worsening. I'll coordinate with the ER.",
];

const HOSPITAL_REPLIES = [
  "Hello! This is the emergency support desk. How can we assist you?",
  "We have emergency doctors available right now. What is the nature of the emergency?",
  "Please provide your location so we can dispatch the nearest ambulance.",
  "Our trauma team is on standby. Are you safe at your current location?",
  "We're logging your request. Please stay on the line and keep calm.",
];

/* ─── CALL MODAL ───────────────────────────────────────── */
function CallModal({ entity, type, onClose }: { entity: any; type: "doctor" | "hospital"; onClose: () => void }) {
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(true);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setConnected(true), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!connected) return;
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [connected]);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <motion.div initial={{ scale: 0.85, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.85, opacity: 0, y: 40 }}
        className="w-full max-w-xs bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        {/* Top gradient */}
        <div className="h-1 bg-gradient-to-r from-emerald-500 to-cyan-400" />

        <div className="p-8 flex flex-col items-center gap-6">
          {/* Avatar with pulse */}
          <div className="relative">
            {!connected && (
              <>
                <span className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" style={{ animationDuration: "1s" }} />
                <span className="absolute inset-0 m-[-12px] rounded-full bg-emerald-400/10 animate-ping" style={{ animationDuration: "1s", animationDelay: "0.3s" }} />
              </>
            )}
            <img src={entity.image} alt={entity.name}
              onError={e => { (e.target as HTMLImageElement).src = "/images/doctor-fallback.jpg"; }}
              className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500/40 relative z-10" />
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-slate-900 z-20">
              <Phone className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-xl font-bold text-white">{entity.name}</h3>
            <p className="text-slate-400 text-sm mt-1">{type === "doctor" ? entity.specialty : entity.area}</p>
            <p className={`text-sm font-semibold mt-2 ${connected ? "text-emerald-400" : "text-amber-400"}`}>
              {connected ? fmt(seconds) : "Calling…"}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-5">
            <button onClick={() => setMuted(m => !m)}
              className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${muted ? "bg-red-500/20 border border-red-500/40 text-red-400" : "bg-white/10 border border-white/10 text-slate-400 hover:bg-white/20"}`}>
              {muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              <span className="text-[9px] font-bold">{muted ? "Unmute" : "Mute"}</span>
            </button>

            <button onClick={onClose}
              className="w-16 h-16 rounded-2xl bg-red-600 hover:bg-red-700 flex flex-col items-center justify-center gap-1 shadow-lg shadow-red-900/50 transition-all hover:scale-105">
              <PhoneOff className="w-6 h-6 text-white" />
              <span className="text-[9px] font-bold text-white">End</span>
            </button>

            <button onClick={() => setSpeaker(s => !s)}
              className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${speaker ? "bg-sky-500/20 border border-sky-500/40 text-sky-400" : "bg-white/10 border border-white/10 text-slate-400 hover:bg-white/20"}`}>
              <Volume2 className="w-5 h-5" />
              <span className="text-[9px] font-bold">Speaker</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── CHAT MODAL ───────────────────────────────────────── */
function ChatModal({ entity, type, onClose }: { entity: any; type: "doctor" | "hospital"; onClose: () => void }) {
  const replies = type === "doctor" ? DOCTOR_REPLIES : HOSPITAL_REPLIES;
  const [messages, setMessages] = useState([
    { from: "other", text: type === "doctor"
      ? `Hello! I'm ${entity.name}. How can I help you today?`
      : `Hello! Welcome to ${entity.name} emergency support. How can we help you?`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const send = () => {
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages(prev => [...prev, { from: "user", text: input.trim(), time: now }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { from: "other", text: replies[Math.floor(Math.random() * replies.length)], time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    }, 1600);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center sm:justify-end sm:pr-8 sm:pb-8 bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
        className="w-full sm:w-96 bg-slate-900 border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: "80vh" }}>

        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-sky-700 to-cyan-600 shrink-0">
          <img src={entity.image} onError={e => { (e.target as HTMLImageElement).src = "/images/doctor-fallback.jpg"; }}
            className="w-10 h-10 rounded-xl object-cover border-2 border-white/30" alt="" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{entity.name}</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-sky-200">Online · Emergency Support</span>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-900/90">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} gap-2`}>
              {msg.from === "other" && (
                <img src={entity.image} onError={e => { (e.target as HTMLImageElement).src = "/images/doctor-fallback.jpg"; }}
                  className="w-7 h-7 rounded-full object-cover shrink-0 mt-auto" alt="" />
              )}
              <div className={`max-w-[75%] ${msg.from === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.from === "user"
                    ? "bg-sky-600 text-white rounded-br-sm"
                    : "bg-slate-700/80 border border-white/5 text-gray-100 rounded-bl-sm"
                }`}>{msg.text}</div>
                <span className="text-[10px] text-slate-500 px-1">{msg.time}</span>
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex items-end gap-2">
              <img src={entity.image} onError={e => { (e.target as HTMLImageElement).src = "/images/doctor-fallback.jpg"; }}
                className="w-7 h-7 rounded-full object-cover shrink-0" alt="" />
              <div className="bg-slate-700/80 border border-white/5 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                {[0, 1, 2].map(i => <span key={i} className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-3 py-3 border-t border-white/5 bg-slate-800 flex items-center gap-2 shrink-0">
          <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Type your message…"
            className="flex-1 h-10 px-4 bg-slate-700 border border-white/10 rounded-xl text-sm text-gray-100 outline-none focus:ring-2 focus:ring-sky-500/50 placeholder-slate-500 transition" />
          <button onClick={send} disabled={!input.trim()}
            className="w-10 h-10 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-30 flex items-center justify-center text-white transition-all">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── MAP MODAL ────────────────────────────────────────── */
function MapModal({ hospital, onClose }: { hospital: any; onClose: () => void }) {
  const mapUrl = `https://www.google.com/maps/search/${encodeURIComponent(hospital.name + " " + hospital.address)}`;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div>
            <h3 className="font-bold text-white">{hospital.name}</h3>
            <p className="text-slate-400 text-sm">{hospital.address} · {hospital.distance}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"><X className="w-4 h-4" /></button>
        </div>

        {/* Map-style visual */}
        <div className="relative h-56 bg-gradient-to-br from-slate-800 to-slate-700 overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(99,179,237,0.3) 40px, rgba(99,179,237,0.3) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(99,179,237,0.3) 40px, rgba(99,179,237,0.3) 41px)`,
          }} />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-red-500/30 animate-ping" />
              <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-xl shadow-red-900/50 relative z-10">
                <MapPin className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="bg-slate-900/90 border border-white/10 rounded-2xl px-5 py-3 text-center backdrop-blur">
              <p className="font-bold text-white text-sm">{hospital.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">{hospital.address}</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-xs text-emerald-400 font-semibold">~{hospital.distance} away</span>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-sky-400">Est. 8 min drive</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 flex gap-3">
          <a href={mapUrl} target="_blank" rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl transition-colors text-sm">
            <Navigation className="w-4 h-4" /> Open in Google Maps
          </a>
          <a href={`tel:${hospital.phone}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors text-sm">
            <Phone className="w-4 h-4" /> Call Now
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── BOOKING MODAL ────────────────────────────────────── */
function BookingModal({ doctor, onClose }: { doctor: any; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", phone: "", date: "", time: "", notes: "" });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 1800);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto">
      <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl my-4">
        <div className="h-1 bg-gradient-to-r from-red-500 to-rose-400" />

        {done ? (
          <div className="p-8 flex flex-col items-center gap-4 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </motion.div>
            <div>
              <h3 className="text-xl font-bold text-white">Appointment Confirmed!</h3>
              <p className="text-slate-400 text-sm mt-2">Your emergency appointment with <span className="text-sky-400 font-semibold">{doctor.name}</span> has been booked.</p>
            </div>
            <div className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-left space-y-2">
              <div className="flex justify-between text-sm"><span className="text-slate-400">Date</span><span className="text-white font-semibold">{form.date}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-400">Time</span><span className="text-white font-semibold">{form.time}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-400">Doctor</span><span className="text-white font-semibold">{doctor.name}</span></div>
            </div>
            <button onClick={onClose} className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl transition-colors">Done</button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div>
                <h3 className="font-bold text-white">Book Emergency Appointment</h3>
                <p className="text-slate-400 text-xs mt-0.5">{doctor.name} · {doctor.specialty}</p>
              </div>
              <button onClick={onClose} className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={submit} className="p-5 space-y-4">
              {[
                { icon: User, label: "Patient Name", key: "name", type: "text", placeholder: "Your full name" },
                { icon: Phone, label: "Phone Number", key: "phone", type: "tel", placeholder: "+1 234 567 8900" },
              ].map(({ icon: Icon, label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">{label}</label>
                  <div className="relative">
                    <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input required type={type} placeholder={placeholder} value={(form as any)[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      className="w-full h-11 pl-10 pr-4 bg-slate-800 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-sky-500/50 transition" />
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input required type="date" min={new Date().toISOString().split("T")[0]} value={form.date}
                      onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                      className="w-full h-11 pl-10 pr-2 bg-slate-800 border border-white/10 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-sky-500/50 transition" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Time</label>
                  <select required value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                    className="w-full h-11 px-3 bg-slate-800 border border-white/10 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-sky-500/50 transition">
                    <option value="">Select</option>
                    {["08:00","09:00","10:00","11:00","13:00","14:00","15:00","16:00"].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1 block"><FileText className="w-3.5 h-3.5" /> Emergency Notes</label>
                <textarea placeholder="Describe the emergency symptoms…" rows={3} value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-sky-500/50 resize-none transition" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white font-bold rounded-xl shadow-lg shadow-red-900/40 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Confirming…</> : <><Calendar className="w-4 h-4" /> Confirm Emergency Appointment</>}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ─── HOSPITAL CARD ─────────────────────────────────────── */
function HospitalCard({ h, onMap, onCall, onChat }: { h: any; onMap: () => void; onCall: () => void; onChat: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      className="group relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-red-500/40 hover:shadow-xl hover:shadow-red-900/20 transition-all duration-300 backdrop-blur-sm">
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <img src={h.image} alt={h.name} onError={e => { (e.target as HTMLImageElement).src = "/images/service-emergency.jpg"; }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
        {h.open
          ? <span className="absolute top-3 left-3 flex items-center gap-1.5 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md"><span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Emergency Open</span>
          : <span className="absolute top-3 left-3 flex items-center gap-1.5 bg-slate-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">Closed</span>
        }
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/50 border border-white/10 px-2.5 py-1 rounded-full backdrop-blur-sm">
          <MapPin className="w-3 h-3 text-red-400" />
          <span className="text-xs text-white font-semibold">{h.distance}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-white text-base leading-tight">{h.name}</h3>
        <p className="text-slate-400 text-xs mt-0.5">{h.area} · {h.address}</p>

        <div className="flex items-center gap-2 mt-2 mb-3">
          <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
            <Star className="w-3 h-3 text-amber-400 fill-current" />
            <span className="text-xs text-amber-300 font-bold">{h.rating}</span>
            <span className="text-xs text-slate-500">({h.reviews})</span>
          </div>
          <span className="text-xs text-slate-500">{h.phone}</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {h.services.map((s: string) => (
            <span key={s} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-300">{s}</span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "View Map", icon: MapPin, color: "bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20", action: onMap },
            { label: "Call", icon: PhoneCall, color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20", action: onCall },
            { label: "Chat", icon: MessageCircle, color: "bg-sky-500/10 border-sky-500/20 text-sky-400 hover:bg-sky-500/20", action: onChat },
          ].map(({ label, icon: Icon, color, action }) => (
            <button key={label} onClick={action}
              className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border transition-all ${color}`}>
              <Icon className="w-4 h-4" />
              <span className="text-[10px] font-bold">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── DOCTOR CARD ───────────────────────────────────────── */
function DoctorCard({ doc, onChat, onCall, onBook }: { doc: any; onChat: () => void; onCall: () => void; onBook: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      className="group bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-sky-500/40 hover:shadow-xl hover:shadow-sky-900/20 transition-all duration-300 backdrop-blur-sm flex flex-col">
      {/* Top */}
      <div className="relative h-24 bg-gradient-to-br from-slate-800 to-slate-700 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900/30 to-red-900/20" />
        <img src={doc.image} alt={doc.name} onError={e => { (e.target as HTMLImageElement).src = "/images/doctor-fallback.jpg"; }}
          className="absolute bottom-0 right-4 w-20 h-20 rounded-2xl object-cover shadow-xl border-4 border-slate-900 group-hover:scale-105 transition-transform duration-500" />
        {doc.available
          ? <span className="absolute top-3 left-3 flex items-center gap-1.5 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full"><span className="w-1 h-1 rounded-full bg-white animate-pulse" /> Available</span>
          : <span className="absolute top-3 left-3 bg-slate-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Busy</span>}
        <div className="absolute top-3 right-24 flex items-center gap-1 bg-black/40 border border-white/10 px-2 py-0.5 rounded-full backdrop-blur-sm">
          <Star className="w-3 h-3 text-amber-400 fill-current" />
          <span className="text-xs font-bold text-white">{doc.rating}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-white">{doc.name}</h3>
        <p className="text-red-400 text-xs font-semibold mt-0.5">{doc.specialty}</p>
        <div className="flex items-center gap-3 text-xs text-slate-500 mt-2 mb-4">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-sky-500" /> {doc.experience}+ yrs</span>
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-sky-500" /> {doc.location}</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Emergency Fee</p>
            <p className="text-xl font-extrabold text-white">${doc.fee}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Reviews</p>
            <p className="text-sm font-bold text-amber-400">{doc.reviews}+</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-auto">
          {[
            { label: "Chat", icon: MessageCircle, color: "bg-sky-500/10 border-sky-500/20 text-sky-400 hover:bg-sky-500/20", action: onChat },
            { label: "Call", icon: PhoneCall, color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20", action: onCall },
            { label: "Book", icon: Calendar, color: "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20", action: onBook },
          ].map(({ label, icon: Icon, color, action }) => (
            <button key={label} onClick={action}
              className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border transition-all ${color}`}>
              <Icon className="w-4 h-4" />
              <span className="text-[10px] font-bold">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── MAIN PAGE ─────────────────────────────────────────── */
export default function Emergency() {
  const [searchQuery, setSearchQuery] = useState("");
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const [locating, setLocating] = useState(false);

  const [callEntity, setCallEntity] = useState<{ entity: any; type: "doctor" | "hospital" } | null>(null);
  const [chatEntity, setChatEntity] = useState<{ entity: any; type: "doctor" | "hospital" } | null>(null);
  const [mapHospital, setMapHospital] = useState<any | null>(null);
  const [bookDoctor, setBookDoctor] = useState<any | null>(null);

  const doSearch = (q: string) => {
    const key = q.toLowerCase().trim();
    const result = ALL_HOSPITALS[key] ?? ALL_HOSPITALS.default;
    setHospitals(result);
    setSearched(true);
  };

  const findNearby = () => {
    setLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          window.open(`https://www.google.com/maps/search/hospital+emergency/@${latitude},${longitude},14z`, "_blank");
          setLocating(false);
          doSearch("default");
        },
        () => { window.open("https://www.google.com/maps/search/hospital+emergency+near+me", "_blank"); setLocating(false); doSearch("default"); }
      );
    } else {
      window.open("https://www.google.com/maps/search/hospital+emergency+near+me", "_blank");
      setLocating(false);
      doSearch("default");
    }
  };

  const SERVICES = [
    { icon: Ambulance, label: "Ambulance Support", desc: "24/7 emergency ambulance dispatch", color: "text-red-400", bg: "from-red-500/10 to-rose-500/5 border-red-500/20" },
    { icon: ShieldAlert, label: "ER Hospital Access", desc: "Instant access to emergency rooms", color: "text-blue-400", bg: "from-blue-500/10 to-cyan-500/5 border-blue-500/20" },
    { icon: Activity, label: "Doctor Recommendation", desc: "AI-matched emergency specialists", color: "text-emerald-400", bg: "from-emerald-500/10 to-teal-500/5 border-emerald-500/20" },
    { icon: Phone, label: "Emergency Hotline", desc: "Round-the-clock emergency contacts", color: "text-amber-400", bg: "from-amber-500/10 to-orange-500/5 border-amber-500/20" },
  ];

  return (
    <div className="w-full bg-slate-950 min-h-screen pb-24 overflow-x-hidden">

      {/* ── HERO ── */}
      <div className="relative overflow-hidden pt-20 pb-24 px-4">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/80 via-slate-950 to-blue-950/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(239,68,68,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(37,99,235,0.1),transparent_50%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/10 rounded-full blur-3xl" />

        <div className="container mx-auto max-w-4xl relative text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <ShieldAlert className="w-3.5 h-3.5" /> Emergency Services — 24 / 7
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-tight tracking-tight">
              Emergency
              <span className="block bg-gradient-to-r from-red-400 via-rose-400 to-orange-400 bg-clip-text text-transparent">Assistance</span>
            </h1>

            <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Get immediate medical help, connect with emergency doctors, and find nearby hospitals instantly.
            </p>

            {/* CTA row */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="tel:911"
                className="relative group flex items-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-black text-lg rounded-2xl shadow-2xl shadow-red-900/60 transition-all hover:scale-105 overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Phone className="w-5 h-5 animate-pulse" />
                </div>
                <span className="relative">Call 911 — Emergency</span>
              </a>
              <button onClick={findNearby} disabled={locating}
                className="flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 text-white font-bold text-base rounded-2xl transition-all hover:scale-105 disabled:opacity-50 backdrop-blur-sm">
                {locating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
                {locating ? "Locating…" : "Find Hospitals Near Me"}
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── ALERT BOX ── */}
      <div className="container mx-auto max-w-4xl px-4 -mt-6 mb-10 relative z-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="flex items-start gap-4 p-5 rounded-2xl border border-red-500/30 bg-red-500/5 backdrop-blur-sm"
          style={{ boxShadow: "0 0 30px rgba(239,68,68,0.1), inset 0 0 30px rgba(239,68,68,0.02)" }}>
          <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0 animate-pulse">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="font-bold text-red-300 text-sm mb-0.5">⚠️ Critical Warning</p>
            <p className="text-slate-400 text-sm leading-relaxed">
              If the patient is unconscious or having difficulty breathing, <span className="text-red-400 font-bold">contact emergency services immediately</span>. Do not delay — call <span className="text-white font-black">911</span> right now.
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── HOSPITAL SEARCH ── */}
      <div className="container mx-auto max-w-5xl px-4 mb-14">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white/3 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-400" /> Search Nearby Hospitals
          </h2>
          <p className="text-slate-500 text-sm mb-5">Try: Karachi, Gulshan, DHA, North Nazimabad or any city/area</p>

          <div className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && doSearch(searchQuery)}
                placeholder="Enter city, area or address…"
                className="w-full h-13 py-3.5 pl-12 pr-4 bg-slate-800/60 border border-white/10 rounded-2xl text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500/40 transition text-sm" />
            </div>
            <button onClick={() => doSearch(searchQuery)}
              className="px-6 h-13 py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl flex items-center gap-2 transition-colors shadow-lg shadow-red-900/40 whitespace-nowrap">
              <Search className="w-4 h-4" /> Search
            </button>
          </div>

          {/* Quick chips */}
          <div className="flex flex-wrap gap-2 mb-6">
            {["Karachi", "Gulshan", "DHA", "North Nazimabad"].map(c => (
              <button key={c} onClick={() => { setSearchQuery(c); doSearch(c); }}
                className="px-3 py-1.5 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-slate-400 hover:text-red-300 text-xs font-semibold rounded-xl transition-all">
                {c}
              </button>
            ))}
          </div>

          {/* Results */}
          <AnimatePresence>
            {searched && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <p className="text-xs text-slate-500 mb-4 font-semibold uppercase tracking-wider">{hospitals.length} hospitals found</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {hospitals.map(h => (
                    <HospitalCard key={h.id} h={h}
                      onMap={() => setMapHospital(h)}
                      onCall={() => setCallEntity({ entity: h, type: "hospital" })}
                      onChat={() => setChatEntity({ entity: h, type: "hospital" })}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ── EMERGENCY SERVICES ── */}
      <div className="container mx-auto max-w-5xl px-4 mb-14">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><Zap className="w-6 h-6 text-amber-400" /> Emergency Services</h2>
        <p className="text-slate-500 text-sm mb-6">Available around the clock for your safety</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SERVICES.map(({ icon: Icon, label, desc, color, bg }) => (
            <motion.div key={label} whileHover={{ y: -4 }}
              className={`p-5 rounded-2xl border bg-gradient-to-br ${bg} backdrop-blur-sm transition-all`}>
              <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-3 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm mb-1">{label}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── DOCTORS ── */}
      <div className="container mx-auto max-w-5xl px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-400" /> Emergency Doctors
            </h2>
            <p className="text-slate-500 text-sm mt-1">Specialists available for urgent consultation right now</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> {DOCTORS.filter(d => d.available).length} Online Now
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DOCTORS.map(doc => (
            <DoctorCard key={doc.id} doc={doc}
              onChat={() => setChatEntity({ entity: doc, type: "doctor" })}
              onCall={() => setCallEntity({ entity: doc, type: "doctor" })}
              onBook={() => setBookDoctor(doc)}
            />
          ))}
        </div>
      </div>

      {/* ── MODALS ── */}
      <AnimatePresence>
        {callEntity && <CallModal entity={callEntity.entity} type={callEntity.type} onClose={() => setCallEntity(null)} />}
        {chatEntity && <ChatModal entity={chatEntity.entity} type={chatEntity.type} onClose={() => setChatEntity(null)} />}
        {mapHospital && <MapModal hospital={mapHospital} onClose={() => setMapHospital(null)} />}
        {bookDoctor && <BookingModal doctor={bookDoctor} onClose={() => setBookDoctor(null)} />}
      </AnimatePresence>
    </div>
  );
}
