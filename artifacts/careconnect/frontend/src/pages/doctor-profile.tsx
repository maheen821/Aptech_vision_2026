import { useParams, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, MapPin, Clock, Award, BadgeCheck, GraduationCap, ChevronRight,
  Calendar, Phone, Heart, Shield, Users, TrendingUp, Building2,
  Stethoscope, ArrowLeft, Loader2, CheckCircle2, Activity,
  X, AlertTriangle, BookOpen,
} from "lucide-react";

const API_BASE = "http://localhost:5000";

// ── Types ──────────────────────────────────────────────────────────────────────
type Education = { degree: string; institution: string; year: string };
type Timing    = { day: string; time: string };
type Review    = { name: string; rating: number; comment: string; date: string };

type Doctor = {
  _id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  experience: number;
  fee: number;
  available: boolean;
  imageUrl?: string;
  location?: string;
  bio?: string;
  education?: Education[];
  timings?: Timing[];
  treatments?: string[];
  reviews?: Review[];
  successRate?: number;
  patientsTreated?: number;
};

// ── Star Row ───────────────────────────────────────────────────────────────────
function StarRow({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          style={{ width: size, height: size }}
          className={n <= Math.round(rating) ? "text-amber-400 fill-current" : "text-gray-200 fill-current"}
        />
      ))}
    </div>
  );
}

// ── Image helper ───────────────────────────────────────────────────────────────
function doctorImg(url?: string) {
  if (!url) return "/images/doctor-fallback.jpg";
  return url.startsWith("http") ? url : `${API_BASE}${url}`;
}

// ─────────────────────────────────────────────────────────────────────────────
export default function DoctorProfile() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();

  const [doctor,    setDoctor]    = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState(false);

  // ── Booking state ──
  const [bookOpen,     setBookOpen]     = useState(false);
  const [date,         setDate]         = useState("");
  const [time,         setTime]         = useState("");
  const [patientName,  setPatientName]  = useState("");
  const [phone,        setPhone]        = useState("");
  const [booking,      setBooking]      = useState(false);
  const [booked,       setBooked]       = useState(false);

  // ── Fetch doctor from backend ──────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setError(false);
    fetch(`${API_BASE}/api/doctors/${id}`)
      .then(r => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then(data => {
        const raw = data?.doctor ?? data;
        setDoctor({
          ...raw,
          rating:          Number(raw.rating)          || 0,
          reviewCount:     Number(raw.reviewCount)     || 0,
          experience:      Number(raw.experience)      || 0,
          fee:             Number(raw.fee)             || 0,
          successRate:     Number(raw.successRate)     ?? 95,
          patientsTreated: Number(raw.patientsTreated) || 0,
          education:       Array.isArray(raw.education)  ? raw.education  : [],
          timings:         Array.isArray(raw.timings)    ? raw.timings    : [],
          treatments:      Array.isArray(raw.treatments) ? raw.treatments : [],
          reviews:         Array.isArray(raw.reviews)    ? raw.reviews    : [],
        });
      })
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctor || !date || !time) return;
    setBooking(true);
    await new Promise(r => setTimeout(r, 900));
    setBooking(false);
    setBooked(true);
    setTimeout(() => { setBookOpen(false); setBooked(false); setDate(""); setTime(""); setPatientName(""); setPhone(""); }, 1500);
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-sky-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-sky-200 border-t-sky-500 animate-spin" />
          <p className="text-gray-500 font-medium">Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error || !doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-sky-50">
        <div className="text-center bg-white rounded-3xl shadow-lg border border-gray-100 p-12 max-w-sm">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Doctor Not Found</h2>
          <p className="text-gray-500 text-sm mb-6">This profile may have been removed or the ID is invalid.</p>
          <button onClick={() => setLocation("/doctors")}
            className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all">
            Back to Doctors
          </button>
        </div>
      </div>
    );
  }

  const education  = doctor.education  ?? [];
  const timings    = doctor.timings    ?? [];
  const treatments = doctor.treatments ?? [];
  const reviews    = doctor.reviews    ?? [];
  const img        = doctorImg(doctor.imageUrl);

  return (
    <div className="w-full pb-24 bg-gradient-to-br from-slate-50 via-sky-50/20 to-white min-h-screen">

      {/* ── HERO BANNER ────────────────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-sky-950 via-slate-900 to-emerald-950 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
        <div className="absolute top-20 left-1/3 w-64 h-64 rounded-full bg-emerald-500/8 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 md:px-10 py-10">
          <button onClick={() => setLocation("/doctors")}
            className="flex items-center gap-2 text-sky-300/80 hover:text-sky-200 text-sm font-medium mb-8 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Doctors
          </button>

          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative shrink-0"
            >
              <div className="w-36 h-36 md:w-44 md:h-44 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl ring-4 ring-sky-400/20">
                <img src={img} alt={doctor.name}
                  onError={e => { (e.target as HTMLImageElement).src = "/images/doctor-fallback.jpg"; }}
                  className="w-full h-full object-cover"
                />
              </div>
              {doctor.available ? (
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-emerald-900/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Available
                </div>
              ) : (
                <div className="absolute -bottom-2 -right-2 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/70" /> Unavailable
                </div>
              )}
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ x: 24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 22 }}
              className="flex-1"
            >
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold px-3 py-1 rounded-full">
                  {doctor.specialty}
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <BadgeCheck className="w-3 h-3" /> Verified
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 leading-tight">{doctor.name}</h1>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <StarRow rating={doctor.rating} size={18} />
                  <span className="text-amber-400 font-bold text-lg">{doctor.rating}</span>
                  <span className="text-gray-400 text-sm">({doctor.reviewCount} reviews)</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-5 text-sm text-gray-300 mb-6">
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-sky-400 shrink-0" />
                  {doctor.experience}+ Years Experience
                </span>
                {doctor.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                    {doctor.location}
                  </span>
                )}
                {(doctor.patientsTreated ?? 0) > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-sky-400 shrink-0" />
                    {(doctor.patientsTreated ?? 0).toLocaleString()}+ Patients
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <button onClick={() => setBookOpen(true)}
                  className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 active:scale-95 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-sky-900/40 transition-all">
                  <Calendar className="w-4 h-4" /> Book Appointment
                </button>
                <button className="flex items-center gap-2 border border-white/20 text-white hover:bg-white/10 active:scale-95 px-6 py-2.5 rounded-xl transition-all font-semibold">
                  <Phone className="w-4 h-4" /> Contact
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── CONTENT ────────────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 md:px-10 max-w-6xl mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── LEFT / MAIN ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Quick Overview Cards */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <SectionTitle icon={<Stethoscope className="w-5 h-5 text-sky-500" />} title="Quick Overview" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { icon: Award,      label: "Experience",  value: `${doctor.experience}+ Years`,    color: "bg-emerald-50 text-emerald-600" },
                  { icon: Star,       label: "Rating",      value: `${doctor.rating} / 5.0`,          color: "bg-amber-50 text-amber-600" },
                  { icon: Stethoscope,label: "Specialty",   value: doctor.specialty,                  color: "bg-sky-50 text-sky-600" },
                  { icon: Clock,      label: "Timing",      value: timings.length ? `${timings.length} slots` : "See sidebar", color: "bg-violet-50 text-violet-600" },
                  { icon: Activity,   label: "Success Rate",value: `${doctor.successRate ?? 95}%`,    color: "bg-rose-50 text-rose-600" },
                  { icon: MapPin,     label: "Location",    value: doctor.location || "—",             color: "bg-cyan-50 text-cyan-600" },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-2 hover:shadow-md transition-shadow">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color} shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{label}</p>
                      <p className="text-sm font-bold text-gray-800 leading-snug mt-0.5">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Bio */}
            {doctor.bio && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }}>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                  <SectionTitle icon={<FileTextIcon />} title="About Doctor" />
                  <p className="text-gray-600 leading-relaxed text-sm">{doctor.bio}</p>
                </div>
              </motion.div>
            )}

            {/* Education */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                <SectionTitle icon={<GraduationCap className="w-5 h-5 text-sky-500" />} title="Education & Credentials" />
                {education.length === 0 ? (
                  <EmptyState icon={<BookOpen className="w-6 h-6 text-gray-300" />} text="No education info added yet." />
                ) : (
                  <div className="relative pl-7">
                    <div className="absolute left-1 top-2 bottom-2 w-0.5 bg-gradient-to-b from-sky-400 via-sky-300 to-emerald-400 rounded-full" />
                    {education.map((edu, i) => (
                      <div key={i} className="relative mb-6 last:mb-0">
                        <div className="absolute -left-[27px] top-1.5 w-4 h-4 rounded-full border-2 border-sky-400 bg-white shadow-sm" />
                        <div className="bg-gradient-to-r from-sky-50/80 to-white border border-sky-100 rounded-2xl p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <span className="text-xs font-bold text-sky-600 bg-sky-100 px-2.5 py-0.5 rounded-lg">{edu.year || "—"}</span>
                          </div>
                          <p className="font-bold text-gray-900 text-sm">{edu.degree}</p>
                          <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />{edu.institution}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Treatments */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                <SectionTitle icon={<Stethoscope className="w-5 h-5 text-sky-500" />} title="Specialization & Treatments" />
                {treatments.length === 0 ? (
                  <EmptyState icon={<Stethoscope className="w-6 h-6 text-gray-300" />} text="No treatments listed." />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {treatments.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3.5 bg-sky-50/70 border border-sky-100 rounded-xl hover:bg-sky-100/60 transition-colors">
                        <div className="w-6 h-6 rounded-lg bg-sky-200/60 flex items-center justify-center shrink-0">
                          <ChevronRight className="w-3.5 h-3.5 text-sky-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Reviews */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <SectionTitle icon={<Heart className="w-5 h-5 text-rose-500" />} title="Patient Reviews" />
              {reviews.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                  <EmptyState icon={<Heart className="w-6 h-6 text-gray-300" />} text="No reviews yet." />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {reviews.map((review, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-emerald-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {(review.name || "?")[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm leading-none">{review.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{review.date}</p>
                          </div>
                        </div>
                        <StarRow rating={Number(review.rating)} size={13} />
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed italic">"{review.comment}"</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-5">

            {/* Fee Card */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
                <p className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-1">Consultation Fee</p>
                <p className="text-5xl font-extrabold text-gray-900 tracking-tight mb-1">${doctor.fee}</p>
                <p className="text-sm text-gray-400 mb-5">per session</p>
                <button onClick={() => setBookOpen(true)}
                  className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-semibold rounded-xl py-3 shadow-md shadow-sky-200 transition-all">
                  <Calendar className="w-4 h-4" /> Book Appointment
                </button>
              </div>
            </motion.div>

            {/* Timings */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-500" /> Available Timings
                </h3>
                {timings.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-2">No timings added yet.</p>
                ) : (
                  <div className="space-y-2">
                    {timings.map(({ day, time }, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <span className="text-sm font-semibold text-gray-700">{day}</span>
                        <span className="text-sky-700 font-semibold bg-sky-50 border border-sky-100 px-2.5 py-1 rounded-lg text-xs">{time}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" /> Success Stats
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Patients Treated", value: (doctor.patientsTreated ?? 0) > 0 ? `${(doctor.patientsTreated ?? 0).toLocaleString()}+` : "—", icon: Users, color: "text-sky-500 bg-sky-50" },
                    { label: "Success Rate",    value: `${doctor.successRate ?? 95}%`, icon: TrendingUp, color: "text-emerald-500 bg-emerald-50" },
                    { label: "Years Active",    value: `${doctor.experience}+`,       icon: Award,     color: "text-violet-500 bg-violet-50" },
                    { label: "Total Reviews",   value: doctor.reviewCount > 0 ? String(doctor.reviewCount) : "—", icon: Star, color: "text-amber-500 bg-amber-50" },
                  ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm text-gray-600">{label}</span>
                        <span className="font-extrabold text-gray-900">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Why Choose */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
              <div className="bg-gradient-to-br from-sky-50/80 to-emerald-50/60 rounded-2xl border border-sky-100 shadow-sm p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-sky-500" /> Why Choose This Doctor?
                </h3>
                <div className="space-y-2.5">
                  {[
                    { icon: BadgeCheck, label: "Verified & Certified",              color: "text-sky-600 bg-sky-100" },
                    { icon: Star,       label: "Top Rated Specialist",              color: "text-amber-600 bg-amber-100" },
                    { icon: Award,      label: `${doctor.experience}+ Years of Expertise`, color: "text-violet-600 bg-violet-100" },
                    { icon: Users,      label: `${doctor.patientsTreated != null && doctor.patientsTreated > 0 ? doctor.patientsTreated.toLocaleString() + "+" : "Many"} Patients Trusted`, color: "text-emerald-600 bg-emerald-100" },
                  ].map(({ icon: Icon, label, color }) => (
                    <div key={label} className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── BIG CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 rounded-3xl overflow-hidden relative bg-gradient-to-br from-sky-600 to-emerald-600 p-8 md:p-12 text-white text-center"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.18),transparent)] pointer-events-none" />
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Book Appointment with {doctor.name}</h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">Secure your slot today. Same-day appointments available. Trusted by thousands of patients.</p>
            <button onClick={() => setBookOpen(true)}
              className="bg-white text-sky-700 hover:bg-sky-50 active:scale-95 font-bold px-10 py-3.5 rounded-2xl text-base shadow-xl transition-all">
              Book Now — ${doctor.fee} / session
            </button>
          </div>
        </motion.div>
      </div>

      {/* ── BOOKING MODAL ── */}
      <AnimatePresence>
        {bookOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-sky-600 to-sky-500 px-6 py-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Book Appointment</h2>
                  <p className="text-sky-100 text-sm">Fill in your details to confirm</p>
                </div>
                <button onClick={() => setBookOpen(false)} className="text-white/70 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleBook} className="p-6 space-y-4">
                {/* Doctor mini card */}
                <div className="flex items-center gap-3 p-4 bg-sky-50 border border-sky-100 rounded-2xl">
                  <img src={img} alt={doctor.name}
                    onError={e => { (e.target as HTMLImageElement).src = "/images/doctor-fallback.jpg"; }}
                    className="w-12 h-12 rounded-xl object-cover border border-sky-100 shrink-0"
                  />
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{doctor.name}</p>
                    <p className="text-xs text-sky-600 font-semibold">{doctor.specialty} · ${doctor.fee} per session</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Your Name</label>
                    <input placeholder="Full name" value={patientName} onChange={e => setPatientName(e.target.value)}
                      className="w-full h-11 px-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 bg-gray-50 focus:bg-white transition" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Phone Number</label>
                    <input placeholder="+1 (555) 000-0000" value={phone} onChange={e => setPhone(e.target.value)}
                      className="w-full h-11 px-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 bg-gray-50 focus:bg-white transition" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Date</label>
                    <input type="date" required value={date} onChange={e => setDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full h-11 px-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 bg-gray-50 focus:bg-white transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Time Slot</label>
                    <select value={time} onChange={e => setTime(e.target.value)} required
                      className="w-full h-11 px-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 bg-gray-50 focus:bg-white transition appearance-none">
                      <option value="">Select slot</option>
                      {timings.length > 0
                        ? timings.map((t, i) => <option key={i} value={t.time}>{t.day} — {t.time}</option>)
                        : ["09:00 AM","10:00 AM","11:00 AM","01:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM"].map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))
                      }
                    </select>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex items-start gap-2 text-xs text-emerald-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  Free cancellation up to 24 hours before your appointment.
                </div>

                {booked ? (
                  <div className="flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white rounded-2xl font-bold">
                    <CheckCircle2 className="w-5 h-5" /> Appointment Confirmed!
                  </div>
                ) : (
                  <div className="flex gap-3 pt-1">
                    <button type="button" onClick={() => setBookOpen(false)}
                      className="flex-1 h-11 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all text-sm">
                      Cancel
                    </button>
                    <button type="submit" disabled={booking}
                      className="flex-1 h-11 bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2">
                      {booking ? <><Loader2 className="w-4 h-4 animate-spin" /> Booking...</> : "Confirm Booking"}
                    </button>
                  </div>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Helper components ──────────────────────────────────────────────────────────
function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
      {icon} {title}
    </h2>
  );
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-2">
      {icon}
      <p className="text-sm text-gray-400">{text}</p>
    </div>
  );
}

function FileTextIcon() {
  return (
    <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}
