import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, MessageCircle, Search, AlertTriangle, Navigation, X, Send, Star, Clock, Loader2, ExternalLink, ShieldAlert } from "lucide-react";
import { useListDoctors, getListDoctorsQueryKey } from "@workspace/api-client-react";

const FALLBACK_IMG = "/images/doctor-fallback.jpg";

const FAKE_HOSPITALS = [
  { name: "City General Hospital", address: "123 Main St, New York, NY", distance: "0.4 mi", open: true, phone: "+1 (212) 555-0101" },
  { name: "St. Mary's Medical Center", address: "456 Park Ave, New York, NY", distance: "0.8 mi", open: true, phone: "+1 (212) 555-0202" },
  { name: "Downtown Emergency Clinic", address: "789 Broadway, New York, NY", distance: "1.2 mi", open: true, phone: "+1 (212) 555-0303" },
  { name: "Metropolitan Hospital", address: "321 5th Ave, New York, NY", distance: "1.7 mi", open: false, phone: "+1 (212) 555-0404" },
];

function ChatPanel({ doctor, onClose }: { doctor: any; onClose: () => void }) {
  const [messages, setMessages] = useState([
    { from: "doctor", text: `Hello! I'm ${doctor.name}. How can I help you today?`, time: "now" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const REPLIES = [
    "I understand your concern. Can you describe your symptoms in more detail?",
    "Please stay calm. Based on what you've told me, you should seek immediate attention.",
    "I recommend visiting the nearest emergency room if the pain is severe.",
    "Can you tell me how long you've been experiencing these symptoms?",
    "I'll note your condition. Do you have any known allergies or medical history I should know?",
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input.trim(), time: "now" };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, {
        from: "doctor",
        text: REPLIES[Math.floor(Math.random() * REPLIES.length)],
        time: "now",
      }]);
    }, 1400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.95 }}
      className="fixed bottom-24 right-4 md:right-8 w-80 md:w-96 bg-white rounded-3xl shadow-2xl shadow-gray-300/50 border border-gray-100 z-[90] flex flex-col overflow-hidden"
      style={{ maxHeight: "70vh" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-sky-600 to-cyan-500 shrink-0">
        <img src={doctor.imageUrl || FALLBACK_IMG} onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
          className="w-10 h-10 rounded-xl object-cover border-2 border-white/40" alt={doctor.name} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white truncate">{doctor.name}</p>
          <p className="text-xs text-sky-100">{doctor.specialty} · <span className="text-emerald-300 font-semibold">Online</span></p>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50/60">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
              msg.from === "user"
                ? "bg-sky-600 text-white rounded-br-sm"
                : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm"
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1">
              {[0, 1, 2].map(i => (
                <span key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-3 border-t border-gray-100 bg-white flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Type your message..."
          className="flex-1 h-10 px-4 bg-gray-100 rounded-xl text-sm text-gray-800 outline-none focus:ring-2 focus:ring-sky-300 transition"
        />
        <button
          onClick={send}
          disabled={!input.trim()}
          className="w-10 h-10 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-40 flex items-center justify-center text-white transition-all shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

export default function Emergency() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locating, setLocating] = useState(false);
  const [chatDoctor, setChatDoctor] = useState<any>(null);
  const [doctorSearch, setDoctorSearch] = useState("");

  const { data: doctors, isLoading } = useListDoctors({}, { query: { queryKey: getListDoctorsQueryKey({}) } });

  const filteredDoctors = doctors?.filter(d =>
    !doctorSearch || d.name.toLowerCase().includes(doctorSearch.toLowerCase()) || d.specialty.toLowerCase().includes(doctorSearch.toLowerCase())
  ) ?? [];

  const openHospitalMaps = () => {
    const q = searchQuery.trim() || "hospitals near me";
    window.open(`https://www.google.com/maps/search/${encodeURIComponent(q + " hospital emergency")}`, "_blank");
  };

  const findNearbyHospitals = () => {
    setLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          window.open(`https://www.google.com/maps/search/hospital+emergency/@${latitude},${longitude},14z`, "_blank");
          setLocating(false);
        },
        () => {
          window.open("https://www.google.com/maps/search/hospital+emergency+near+me", "_blank");
          setLocating(false);
        }
      );
    } else {
      window.open("https://www.google.com/maps/search/hospital+emergency+near+me", "_blank");
      setLocating(false);
    }
  };

  const openDoctorMap = (doctor: any) => {
    const q = `${doctor.name} doctor ${doctor.location || ""}`.trim();
    window.open(`https://www.google.com/maps/search/${encodeURIComponent(q)}`, "_blank");
  };

  return (
    <div className="w-full pb-32 overflow-x-hidden">

      {/* ── HERO ── */}
      <div className="relative bg-gradient-to-br from-red-950 via-red-900 to-rose-900 pt-20 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(239,68,68,0.3),transparent_60%)]" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-rose-400 to-red-600" />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-red-500/10 blur-3xl" />

        <div className="container mx-auto max-w-4xl text-center relative">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-400/30 text-red-300 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              <ShieldAlert className="w-4 h-4" /> Emergency Services
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              🚨 Emergency
              <span className="block bg-gradient-to-r from-red-400 to-rose-300 bg-clip-text text-transparent">Help Center</span>
            </h1>
            <p className="text-red-200/80 text-lg max-w-xl mx-auto mb-8">
              Find nearby hospitals, reach emergency doctors instantly, and get immediate medical assistance.
            </p>

            {/* Emergency Call Banner */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="tel:911"
                className="flex items-center gap-3 px-8 py-4 bg-red-500 hover:bg-red-400 text-white font-bold text-lg rounded-2xl shadow-lg shadow-red-900/50 transition-all hover:scale-105 active:scale-95"
              >
                <Phone className="w-5 h-5" /> Call 911 — Emergency
              </a>
              <button
                onClick={findNearbyHospitals}
                disabled={locating}
                className="flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-base rounded-2xl transition-all hover:scale-105 disabled:opacity-60"
              >
                {locating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
                {locating ? "Getting Location..." : "Find Hospitals Near Me"}
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── HOSPITAL SEARCH ── */}
      <div className="container mx-auto max-w-4xl px-4 md:px-8 -mt-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 p-6"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-500" /> Search Nearby Hospitals
          </h2>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && openHospitalMaps()}
                placeholder="Enter your city, area or address..."
                className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition"
              />
            </div>
            <button
              onClick={openHospitalMaps}
              className="px-5 h-12 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl flex items-center gap-2 transition-colors shadow-md shadow-red-200 whitespace-nowrap"
            >
              <MapPin className="w-4 h-4" /> Search
            </button>
          </div>

          {/* Quick hospital list */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FAKE_HOSPITALS.map((h, i) => (
              <button
                key={i}
                onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(h.name + " " + h.address)}`, "_blank")}
                className="flex items-start gap-3 p-4 rounded-2xl border border-gray-100 bg-gray-50/60 hover:bg-red-50 hover:border-red-200 text-left transition-all group"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${h.open ? "bg-emerald-100" : "bg-gray-100"}`}>
                  <MapPin className={`w-4 h-4 ${h.open ? "text-emerald-600" : "text-gray-400"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">{h.name}</p>
                  <p className="text-xs text-gray-500 truncate">{h.address}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-semibold ${h.open ? "text-emerald-600" : "text-gray-400"}`}>
                      {h.open ? "● Open 24/7" : "● Closed"}
                    </span>
                    <span className="text-xs text-gray-400">· {h.distance}</span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-red-400 transition-colors shrink-0 mt-0.5" />
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── EMERGENCY DOCTORS ── */}
      <div className="container mx-auto max-w-6xl px-4 md:px-8 mt-14">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-500" /> Emergency Doctors
            </h2>
            <p className="text-gray-500 text-sm mt-1">Available specialists for urgent consultation</p>
          </div>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={doctorSearch}
              onChange={e => setDoctorSearch(e.target.value)}
              placeholder="Search doctor or specialty..."
              className="w-full h-11 pl-10 pr-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-72 rounded-3xl bg-gray-100 animate-pulse" />)}
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No doctors found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor, i) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {/* Card header */}
                <div className="relative h-28 bg-gradient-to-br from-red-50 to-rose-100 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-100 via-red-50 to-white" />
                  <img
                    src={doctor.imageUrl || FALLBACK_IMG}
                    alt={doctor.name}
                    onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
                    className="absolute bottom-0 right-4 w-20 h-20 rounded-2xl object-cover shadow-lg border-4 border-white"
                  />
                  {doctor.available && (
                    <span className="absolute top-3 left-3 flex items-center gap-1.5 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Available
                    </span>
                  )}
                  <div className="absolute top-3 right-24 flex items-center gap-1 bg-white border border-yellow-200 px-2 py-0.5 rounded-full shadow-sm">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs font-bold text-gray-800">{doctor.rating}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-gray-900">{doctor.name}</h3>
                  <p className="text-red-600 text-sm font-semibold">{doctor.specialty}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-2 mb-4">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-sky-400" /> {doctor.experience}+ yrs</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-sky-400" /> {doctor.location || "NYC"}</span>
                  </div>

                  {/* Action buttons */}
                  <div className="grid grid-cols-3 gap-2 mt-auto">
                    <button
                      onClick={() => openDoctorMap(doctor)}
                      className="flex flex-col items-center gap-1 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors border border-blue-200 group"
                    >
                      <MapPin className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold">View Map</span>
                    </button>
                    <a
                      href={`tel:+12125550100`}
                      className="flex flex-col items-center gap-1 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors border border-emerald-200 group"
                    >
                      <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold">Call</span>
                    </a>
                    <button
                      onClick={() => setChatDoctor(chatDoctor?.id === doctor.id ? null : doctor)}
                      className={`flex flex-col items-center gap-1 py-2.5 rounded-xl transition-colors border group ${
                        chatDoctor?.id === doctor.id
                          ? "bg-sky-600 text-white border-sky-600"
                          : "bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-200"
                      }`}
                    >
                      <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold">Chat</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ── CHAT PANEL ── */}
      <AnimatePresence>
        {chatDoctor && <ChatPanel doctor={chatDoctor} onClose={() => setChatDoctor(null)} />}
      </AnimatePresence>
    </div>
  );
}
