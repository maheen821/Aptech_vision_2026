import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Star, MapPin, Search, Clock, Loader2, CheckCircle2,
  SlidersHorizontal, X, UserCheck, Award, Calendar,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const API_BASE = "http://localhost:5000";

const SORT_OPTIONS = [
  { value: "rating",     label: "Highest Rated" },
  { value: "fee_asc",   label: "Lowest Fee" },
  { value: "fee_desc",  label: "Highest Fee" },
  { value: "experience", label: "Most Experienced" },
];

// Fallback color tailwind classes if database doesn't provide color
const COLOR_PALETTE = [
  "from-sky-400 to-blue-500",
  "from-rose-400 to-pink-500",
  "from-violet-400 to-purple-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
  "from-blue-400 to-indigo-500",
  "from-cyan-400 to-sky-500",
  "from-teal-400 to-green-500",
];

// Helper function to dynamically get a gradient class based on string hash
const getGradientClass = (specialtyName: string) => {
  if (!specialtyName) return COLOR_PALETTE[0];
  let hash = 0;
  for (let i = 0; i < specialtyName.length; i++) {
    hash = specialtyName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLOR_PALETTE.length;
  return COLOR_PALETTE[index];
};

const FALLBACK_IMG = "/images/doctor-fallback.jpg";

function sortDoctors(docs: any[], sort: string) {
  return [...docs].sort((a, b) => {
    if (sort === "rating")     return (b.rating ?? 0) - (a.rating ?? 0);
    if (sort === "fee_asc")    return (a.fee ?? 0) - (b.fee ?? 0);
    if (sort === "fee_desc")   return (b.fee ?? 0) - (a.fee ?? 0);
    if (sort === "experience") return (b.experience ?? 0) - (a.experience ?? 0);
    return 0;
  });
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function Doctors() {
  const searchParams = new URLSearchParams(window.location.search);
  const [search,      setSearch]      = useState("");
  const [specialty,   setSpecialty]   = useState(searchParams.get("specialty") || "");
  const [sort,        setSort]        = useState("rating");
  const [minRating,   setMinRating]   = useState(0);
  const [maxFee,      setMaxFee]      = useState(500);
  const [showFilters, setShowFilters] = useState(false);
  const [doctors,     setDoctors]     = useState<any[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]); // Dynamic Specialties state
  const [isLoading,   setIsLoading]   = useState(true);
  const [fetchError,  setFetchError]  = useState(false);

  // Fetch doctors and specialties combined
  const loadComponentData = useCallback(async () => {
    setIsLoading(true);
    setFetchError(false);
    try {
      // Promise.all se dono endpoints ka data parallelly fetch hoga
      const [doctorsRes, specialtiesRes] = await Promise.all([
        axios.get(`${API_BASE}/api/doctors`),
        axios.get(`${API_BASE}/api/specialties`) // Adjust path matching your backend route
      ]);

      // Handle Doctors Data
      const rawDocs = doctorsRes.data?.data ?? doctorsRes.data;
      const docList = Array.isArray(rawDocs) ? rawDocs : [];
      const normalizedDocs = docList.map((d: any) => ({
        ...d,
        fee:         Number(d.fee)         || 0,
        experience:  Number(d.experience)  || 0,
        rating:      Number(d.rating)      || 0,
        reviewCount: Number(d.reviewCount) || 0,
      }));
      setDoctors(normalizedDocs);

      // Handle Specialties Data dynamically
      const rawSpecs = specialtiesRes.data?.data ?? specialtiesRes.data;
      const specList = Array.isArray(rawSpecs) ? rawSpecs : [];
      // Object arrays se name string map kar rahe hain (e.g. [{name: 'Cardiology'}] -> ['Cardiology'])
      const mappedSpecs = specList.map((s: any) => typeof s === 'string' ? s : s.name);
      setSpecialties(mappedSpecs);

    } catch (error: any) {
      console.error("❌ Data load failed:", error?.response?.data ?? error?.message);
      setFetchError(true);
      setDoctors([]);
      setSpecialties([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { 
    loadComponentData(); 
  }, [loadComponentData]);

  const filtered = sortDoctors(
    doctors.filter(d => {
      const matchSearch    = !search    || d.name?.toLowerCase().includes(search.toLowerCase()) || d.specialty?.toLowerCase().includes(search.toLowerCase());
      const matchSpecialty = !specialty || d.specialty === specialty;
      const matchRating    = d.rating >= minRating;
      const matchFee       = maxFee >= 500 ? true : d.fee <= maxFee;
      return matchSearch && matchSpecialty && matchRating && matchFee;
    }),
    sort
  );

  const activeFilters = [
    specialty    && { label: specialty,            clear: () => setSpecialty("") },
    minRating > 0 && { label: `⭐ ${minRating}+`,  clear: () => setMinRating(0) },
    maxFee < 500  && { label: `Fee ≤ $${maxFee}`,  clear: () => setMaxFee(500) },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  const clearAll = () => { setSpecialty(""); setSearch(""); setMinRating(0); setMaxFee(500); };

  return (
    <div className="w-full overflow-x-hidden pb-24 bg-slate-50 min-h-screen">

      {/* ── HERO ── */}
      <div className="bg-gradient-to-br from-slate-950 via-sky-950 to-slate-900 pt-20 pb-16 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-emerald-400 to-sky-600" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-4xl relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-sky-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
              <Award className="w-3 h-3" /> Verified Specialists
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight">
              Find Your <span className="text-sky-400">Doctor</span>
            </h1>
            <p className="text-white/50 text-lg">
              {isLoading ? "Loading specialists..." : `${doctors.length} verified specialist${doctors.length !== 1 ? "s" : ""} ready to help`}
            </p>
            {fetchError && (
              <p className="text-amber-400 text-sm mt-3 bg-amber-400/10 border border-amber-400/20 px-4 py-1.5 rounded-full inline-block">
                Backend connect nahi ho saka
              </p>
            )}
          </motion.div>

          {/* Search */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or specialty..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-14 pl-12 pr-14 bg-white rounded-2xl border-0 text-gray-900 text-base shadow-2xl outline-none focus:ring-4 focus:ring-sky-400/30 transition"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 md:px-8 mt-8">

        {/* ── SPECIALTY PILLS (DYNAMIC FROM DATABASE) ── */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 mb-5 scrollbar-none">
          {["All", ...specialties].map(s => (
            <button
              key={s}
              onClick={() => setSpecialty(s === "All" ? "" : (specialty === s ? "" : s))}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all whitespace-nowrap ${
                (s === "All" && !specialty) || specialty === s
                  ? "bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-200"
                  : "bg-white text-gray-600 border-gray-200 hover:border-sky-300 hover:text-sky-700"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* ── CONTROLS ── */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-sm text-gray-500 font-medium">
              {isLoading ? "Loading..." : `${filtered.length} doctor${filtered.length !== 1 ? "s" : ""} found`}
            </p>
            {activeFilters.map((f, i) => (
              <span key={i} className="flex items-center gap-1.5 bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold px-3 py-1 rounded-full">
                {f.label}
                <button onClick={f.clear}><X className="w-3 h-3" /></button>
              </span>
            ))}
            {activeFilters.length > 0 && (
              <button onClick={clearAll} className="text-xs text-gray-400 hover:text-red-500 transition-colors">Clear all</button>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-9 w-44 text-xs rounded-xl bg-white border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${showFilters ? "bg-sky-50 border-sky-300 text-sky-700" : "bg-white border-gray-200 text-gray-600 hover:border-sky-300"}`}
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>

        {/* ── ADVANCED FILTERS ── */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-3">
                    Min Rating: <span className="text-sky-600">{minRating > 0 ? `${minRating}+ ⭐` : "Any"}</span>
                  </label>
                  <div className="flex gap-2">
                    {[0, 3.5, 4.0, 4.5].map(r => (
                      <button key={r} onClick={() => setMinRating(r)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${minRating === r ? "bg-amber-400 border-amber-400 text-white" : "bg-white border-gray-200 text-gray-600 hover:border-amber-300"}`}
                      >
                        {r === 0 ? "Any" : `${r}+`}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-3">
                    Max Fee: <span className="text-sky-600">{maxFee >= 500 ? "Any" : `$${maxFee}`}</span>
                  </label>
                  <div className="flex gap-2">
                    {[500, 200, 150, 100].map(f => (
                      <button key={f} onClick={() => setMaxFee(f)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${maxFee === f ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-gray-200 text-gray-600 hover:border-emerald-300"}`}
                      >
                        {f >= 500 ? "Any" : `≤$${f}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── LOADING ── */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-28 gap-4">
            <Loader2 className="w-12 h-12 text-sky-400 animate-spin" />
            <p className="text-gray-400 text-sm font-medium">Loading doctors...</p>
          </div>
        )}

        {/* ── EMPTY ── */}
        {!isLoading && filtered.length === 0 && (
          <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center max-w-xl mx-auto shadow-sm">
            <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-sky-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-400 mb-5">
              {doctors.length === 0 ? "Backend se koi doctor nahi mila." : "Try adjusting your filters."}
            </p>
            {activeFilters.length > 0 && (
              <Button variant="outline" className="rounded-xl" onClick={clearAll}>Clear All Filters</Button>
            )}
          </div>
        )}

        {/* ── GRID ── */}
        {!isLoading && filtered.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={specialty + search + sort}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((doctor, i) => (
                <motion.div
                  key={doctor._id ?? doctor.id ?? i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <DoctorCard doctor={doctor} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

// ─── DOCTOR CARD ──────────────────────────────────────────────────────────────
function DoctorCard({ doctor }: { doctor: any }) {
  const [open,      setOpen]      = useState(false);
  const [date,      setDate]      = useState("");
  const [time,      setTime]      = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const { toast } = useToast();

  // Dynamic gradient assignment from dynamic logic
  const gradient    = getGradientClass(doctor.specialty);
  const doctorId    = doctor._id ?? doctor.id;
  const profileHref = `/doctors/${doctorId}`;

  const resolvedImage = doctor.imageUrl
    ? doctor.imageUrl.startsWith("http") ? doctor.imageUrl : `${API_BASE}${doctor.imageUrl}`
    : FALLBACK_IMG;

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;
    setIsBooking(true);
    try {
      await axios.post(`${API_BASE}/api/appointments`, {
        doctorId, doctorName: doctor.name,
        specialty: doctor.specialty, date, time, fee: doctor.fee,
      });
      toast({ title: "Appointment Booked!", description: `Your visit with ${doctor.name} has been scheduled.` });
      setOpen(false);
    } catch {
      toast({ title: "Booking Failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group bg-white rounded-[28px] overflow-hidden shadow-md hover:shadow-2xl hover:shadow-black/10 border border-gray-100/80 flex flex-col h-full"
    >
      {/* ── IMAGE SECTION ── */}
      <div className={`relative bg-gradient-to-br ${gradient} overflow-hidden`} style={{ height: "220px" }}>

        {/* Animated background blobs */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-8 -left-8 w-36 h-36 bg-black/10 rounded-full"
        />

        {/* Doctor image */}
        <div className="absolute inset-0 flex items-end justify-center pb-0">
          {!imgLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
            </div>
          )}
          <motion.img
            src={resolvedImage}
            alt={doctor.name}
            onLoad={() => setImgLoaded(true)}
            onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMG; setImgLoaded(true); }}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={imgLoaded ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
            style={{ objectPosition: "center top" }}
          />
        </div>

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Available / Unavailable pill */}
        <div className="absolute top-4 left-4 z-10">
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-full shadow-lg ${
              doctor.available ? "text-emerald-600" : "text-red-500"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${doctor.available ? "bg-emerald-500 animate-pulse" : "bg-red-400"}`} />
            {doctor.available ? "Available" : "Unavailable"}
          </motion.span>
        </div>

        {/* Rating + review count pill */}
        {doctor.rating > 0 && (
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-full shadow-lg">
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-bold text-gray-900">{doctor.rating}</span>
            {doctor.reviewCount > 0 && (
              <span className="text-[10px] text-gray-400 font-medium">({doctor.reviewCount})</span>
            )}
          </div>
        )}

        {/* Name + specialty overlaid */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-4">
          <h3 className="text-white font-bold text-xl leading-tight drop-shadow-md">{doctor.name}</h3>
          <span className="inline-block mt-1 text-white/80 text-xs font-semibold">{doctor.specialty}</span>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="px-5 pt-4 pb-5 flex flex-col flex-1">

        {/* Specialty badge */}
        <div className="mb-3">
          <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${gradient} text-white shadow-sm`}>
            {doctor.specialty}
          </span>
        </div>

        {/* Bio */}
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4 flex-1">
          {doctor.bio || "Experienced specialist dedicated to top-quality patient care."}
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-0 mb-4 bg-slate-50 rounded-2xl overflow-hidden border border-gray-100">
          {[
            { label: "Experience", value: doctor.experience ? `${doctor.experience}+ yrs` : "—" },
            { label: "Fee",        value: doctor.fee ? `$${doctor.fee}` : "—" },
            { label: "Status",     value: "Verified", icon: <UserCheck className="w-3 h-3 text-emerald-500" /> },
          ].map((stat, i) => (
            <div key={i} className={`text-center py-3 ${i < 2 ? "border-r border-gray-100" : ""}`}>
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-0.5">{stat.label}</p>
              <div className="flex items-center justify-center gap-1">
                {stat.icon}
                <p className={`text-xs font-bold ${stat.label === "Status" ? "text-emerald-600" : "text-gray-800"}`}>
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Location */}
        {doctor.location && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
            <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="truncate font-medium">{doctor.location}</span>
          </div>
        )}

        {/* ── ACTIONS ── */}
        <div className="space-y-2">
          {/* Book Appointment */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <motion.button
                whileTap={{ scale: 0.97 }}
                className={`w-full h-11 bg-gradient-to-r ${gradient} text-white font-bold rounded-2xl shadow-md hover:shadow-lg hover:opacity-95 transition-all text-sm`}
              >
                Book Appointment
              </motion.button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-3xl">
              <DialogHeader className="pt-2">
                <DialogTitle className="text-2xl font-bold">Book Appointment</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleBook} className="space-y-5 pt-2">
                <div className="flex items-center gap-4 p-4 bg-slate-50 border border-gray-100 rounded-2xl">
                  <img src={resolvedImage} alt={doctor.name}
                    onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow" />
                  <div>
                    <p className="font-bold text-gray-900">{doctor.name}</p>
                    <p className="text-sm text-sky-600 font-semibold">{doctor.specialty}</p>
                    <p className="text-sm text-gray-400">${doctor.fee} · Consultation</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold flex items-center gap-1.5 text-gray-700">
                    <Calendar className="w-4 h-4 text-sky-500" /> Select Date
                  </Label>
                  <Input type="date" required value={date} onChange={e => setDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]} className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold flex items-center gap-1.5 text-gray-700">
                    <Clock className="w-4 h-4 text-sky-500" /> Select Time
                  </Label>
                  <div className="grid grid-cols-4 gap-2">
                    {["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00"].map(t => (
                      <button key={t} type="button" onClick={() => setTime(t)}
                        className={`h-10 rounded-xl text-sm font-semibold border transition-all ${time === t ? `bg-gradient-to-r ${gradient} border-transparent text-white shadow-md` : "bg-white border-gray-200 text-gray-600 hover:border-sky-300"}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-emerald-700 font-medium">Free cancellation up to 24 hours before your appointment.</p>
                </div>
                <DialogFooter className="gap-2 pt-1">
                  <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl">Cancel</Button>
                  <Button type="submit" disabled={isBooking || !date || !time}
                    className={`bg-gradient-to-r ${gradient} border-0 rounded-xl px-8 text-white font-bold hover:opacity-90`}
                  >
                    {isBooking && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Confirm Booking
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* View Profile link */}
          <a
            href={profileHref}
            className="flex items-center justify-center gap-1.5 w-full h-9 rounded-2xl border border-gray-200 text-xs font-semibold text-gray-500 hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50 transition-all"
          >
            View Profile
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>
      </div>
    </motion.div>
  );
}