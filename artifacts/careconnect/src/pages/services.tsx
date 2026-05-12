import { motion } from "framer-motion";
import { Heart, Brain, Stethoscope, Baby, Activity, Bone, Ear, FlaskConical, Calendar, Search, FileText, Star, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "wouter";

const PLATFORM_SERVICES = [
  {
    icon: <FlaskConical className="w-7 h-7" />,
    tag: "AI-Powered",
    title: "Symptom Checker",
    desc: "Describe how you feel and our intelligent system instantly analyzes your symptoms to recommend the right specialist.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=360&fit=crop",
    color: "from-sky-500 to-sky-700",
    accent: "bg-sky-50 text-sky-700 border-sky-200",
    href: "/symptom",
  },
  {
    icon: <Search className="w-7 h-7" />,
    tag: "Smart Search",
    title: "Doctor Finder",
    desc: "Filter by specialty, location, rating, or fee to find exactly the right specialist from our verified network.",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&h=360&fit=crop",
    color: "from-emerald-500 to-teal-700",
    accent: "bg-emerald-50 text-emerald-700 border-emerald-200",
    href: "/doctors",
  },
  {
    icon: <Calendar className="w-7 h-7" />,
    tag: "Online Booking",
    title: "Appointment Booking",
    desc: "Book, reschedule, or cancel appointments in real-time. No phone calls. Instant confirmation sent to you.",
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&h=360&fit=crop",
    color: "from-violet-500 to-purple-700",
    accent: "bg-violet-50 text-violet-700 border-violet-200",
    href: "/appointments",
  },
  {
    icon: <FileText className="w-7 h-7" />,
    tag: "Digital Records",
    title: "Health Profile",
    desc: "Maintain a complete digital health record — allergies, medical history, prescriptions — always secure and accessible.",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&h=360&fit=crop",
    color: "from-rose-500 to-pink-700",
    accent: "bg-rose-50 text-rose-700 border-rose-200",
    href: "/account",
  },
  {
    icon: <Star className="w-7 h-7" />,
    tag: "Community",
    title: "Feedback System",
    desc: "Rate your doctors, share your experience, and help others make informed healthcare decisions with verified reviews.",
    image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=600&h=360&fit=crop",
    color: "from-amber-500 to-orange-600",
    accent: "bg-amber-50 text-amber-700 border-amber-200",
    href: "/account",
  },
];

const SPECIALTIES = [
  { name: "General Medicine", icon: <Stethoscope className="w-6 h-6" />, color: "bg-sky-50 text-sky-600 border-sky-200", desc: "Routine care and chronic disease management" },
  { name: "Cardiology", icon: <Heart className="w-6 h-6" />, color: "bg-rose-50 text-rose-600 border-rose-200", desc: "Expert heart care and cardiovascular health" },
  { name: "Neurology", icon: <Brain className="w-6 h-6" />, color: "bg-violet-50 text-violet-600 border-violet-200", desc: "Brain and nervous system disorders" },
  { name: "Dermatology", icon: <FlaskConical className="w-6 h-6" />, color: "bg-emerald-50 text-emerald-600 border-emerald-200", desc: "Medical and cosmetic skin treatments" },
  { name: "Pediatrics", icon: <Baby className="w-6 h-6" />, color: "bg-pink-50 text-pink-600 border-pink-200", desc: "Compassionate care for children" },
  { name: "Orthopedics", icon: <Bone className="w-6 h-6" />, color: "bg-orange-50 text-orange-600 border-orange-200", desc: "Bone, joint, and muscle treatments" },
  { name: "ENT", icon: <Ear className="w-6 h-6" />, color: "bg-teal-50 text-teal-600 border-teal-200", desc: "Ear, nose, and throat specialist care" },
  { name: "Pulmonology", icon: <Activity className="w-6 h-6" />, color: "bg-cyan-50 text-cyan-600 border-cyan-200", desc: "Respiratory and lung health care" },
];

export default function Services() {
  return (
    <div className="w-full overflow-x-hidden pb-24">

      {/* ── HERO ── */}
      <div className="relative bg-gradient-to-br from-slate-950 via-sky-950 to-emerald-950 pt-20 pb-24 px-4 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-emerald-400 to-sky-600" />
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="container mx-auto max-w-4xl text-center relative">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-block bg-white/10 border border-white/20 text-sky-300 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              Our Services
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-5 leading-tight">
              Everything You Need for<br />
              <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">Better Healthcare</span>
            </h1>
            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto">
              Comprehensive tools and real doctors — all in one platform designed to make healthcare simple, fast, and personal.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── PLATFORM SERVICES (image cards) ── */}
      <div className="container mx-auto max-w-6xl px-4 md:px-8 mt-20">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Platform Features</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Five powerful tools working together so you get the best care possible.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {PLATFORM_SERVICES.map((svc, i) => (
            <motion.div
              key={svc.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08 }}
              className="glass-card overflow-hidden group hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 flex flex-col"
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden shrink-0">
                <img src={svc.image} alt={svc.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className={`absolute inset-0 bg-gradient-to-br ${svc.color} opacity-50`} />
                <div className="absolute top-4 left-4">
                  <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border bg-white/90 ${svc.accent}`}>
                    {svc.icon} {svc.tag}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{svc.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5 flex-1">{svc.desc}</p>
                <Link href={svc.href}>
                  <span className={`inline-flex items-center gap-2 text-sm font-semibold cursor-pointer group-hover:gap-3 transition-all ${svc.accent.replace("bg-", "text-").split(" ")[0].replace("50", "600")}`}>
                    Get Started <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── SPECIALTIES ── */}
      <div className="container mx-auto max-w-6xl px-4 md:px-8 mt-20">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="inline-block bg-sky-50 text-sky-600 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">Medical Specialties</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Find Care by Specialty</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Browse our verified specialists across every major medical field.</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SPECIALTIES.map((sp, i) => (
            <motion.div
              key={sp.name}
              initial={{ opacity: 0, scale: 0.93 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <Link href={`/doctors?specialty=${sp.name}`}>
                <div className="glass-card p-5 flex flex-col items-center text-center cursor-pointer hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border mb-4 group-hover:scale-110 transition-transform ${sp.color}`}>
                    {sp.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{sp.name}</h3>
                  <p className="text-xs text-gray-500 leading-snug">{sp.desc}</p>
                  <span className="mt-3 flex items-center gap-1 text-xs font-semibold text-sky-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Find Doctors <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── CTA BANNER ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="container mx-auto max-w-6xl px-4 md:px-8 mt-20"
      >
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-sky-600 to-emerald-600 p-10 md:p-14">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Ready to take charge of your health?</h2>
              <p className="text-white/70 max-w-lg">Start with our symptom checker — get a doctor recommendation in under 60 seconds.</p>
            </div>
            <Link href="/symptom">
              <span className="shrink-0 inline-block bg-white text-sky-700 font-bold px-8 py-4 rounded-2xl cursor-pointer hover:bg-sky-50 transition-colors shadow-xl text-base whitespace-nowrap">
                Check Symptoms Now
              </span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
