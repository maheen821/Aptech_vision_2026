import { useState } from "react";
import { useListDoctors, getListDoctorsQueryKey, useCreateAppointment } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MapPin, Search, Clock, Loader2, CheckCircle2, SlidersHorizontal, X, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

const SPECIALTIES = [
  "General Medicine", "Cardiology", "Neurology", "Dermatology",
  "Pediatrics", "Orthopedics", "ENT", "Pulmonology",
];

const SORT_OPTIONS = [
  { value: "rating", label: "Highest Rated" },
  { value: "fee_asc", label: "Lowest Fee" },
  { value: "fee_desc", label: "Highest Fee" },
  { value: "experience", label: "Most Experienced" },
];

const FALLBACK_IMG = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face";

function sortDoctors(docs: any[], sort: string) {
  return [...docs].sort((a, b) => {
    if (sort === "rating") return b.rating - a.rating;
    if (sort === "fee_asc") return a.fee - b.fee;
    if (sort === "fee_desc") return b.fee - a.fee;
    if (sort === "experience") return b.experience - a.experience;
    return 0;
  });
}

export default function Doctors() {
  const searchParams = new URLSearchParams(window.location.search);
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState(searchParams.get("specialty") || "");
  const [sort, setSort] = useState("rating");
  const [minRating, setMinRating] = useState(0);
  const [maxFee, setMaxFee] = useState(500);
  const [showFilters, setShowFilters] = useState(false);

  const { data: doctors, isLoading } = useListDoctors(
    { search: search || undefined, specialty: specialty || undefined },
    { query: { queryKey: getListDoctorsQueryKey({ search: search || undefined, specialty: specialty || undefined }) } }
  );

  const filtered = doctors
    ? sortDoctors(
        doctors.filter(d => d.rating >= minRating && d.fee <= maxFee),
        sort
      )
    : [];

  const activeFilters = [
    specialty && { label: specialty, clear: () => setSpecialty("") },
    minRating > 0 && { label: `⭐ ${minRating}+`, clear: () => setMinRating(0) },
    maxFee < 500 && { label: `Fee ≤ $${maxFee}`, clear: () => setMaxFee(500) },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  const clearAll = () => { setSpecialty(""); setSearch(""); setMinRating(0); setMaxFee(500); };

  return (
    <div className="w-full overflow-x-hidden pb-24">

      {/* ── HERO SEARCH BANNER ── */}
      <div className="bg-gradient-to-br from-slate-950 via-sky-950 to-slate-900 pt-20 pb-12 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-emerald-400 to-sky-600" />
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-sky-500/10 blur-3xl" />

        <div className="container mx-auto max-w-4xl relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-8">
            <span className="inline-block bg-white/10 border border-white/20 text-sky-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              Our Specialists
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Find Your Doctor</h1>
            <p className="text-white/60 text-lg">Browse {doctors?.length ?? "50+"} verified specialists and book instantly.</p>
          </motion.div>

          {/* Search bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by doctor name or specialty..."
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

        {/* ── SPECIALTY PILLS ── */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 mb-4 scrollbar-none">
          <button
            onClick={() => setSpecialty("")}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${!specialty ? "bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-200" : "bg-white text-gray-600 border-gray-200 hover:border-sky-300"}`}
          >
            All
          </button>
          {SPECIALTIES.map(s => (
            <button
              key={s}
              onClick={() => setSpecialty(specialty === s ? "" : s)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all whitespace-nowrap ${specialty === s ? "bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-200" : "bg-white text-gray-600 border-gray-200 hover:border-sky-300 hover:text-sky-700"}`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* ── CONTROLS BAR ── */}
        <div className="flex items-center justify-between gap-4 mb-6">
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
            {/* Sort */}
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-9 w-40 text-xs rounded-xl bg-white border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>

            {/* Advanced filters toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${showFilters ? "bg-sky-50 border-sky-300 text-sky-700" : "bg-white border-gray-200 text-gray-600 hover:border-sky-300"}`}
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>

        {/* ── ADVANCED FILTERS PANEL ── */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-3">
                    Minimum Rating: <span className="text-sky-600">{minRating > 0 ? `${minRating}+ ⭐` : "Any"}</span>
                  </label>
                  <div className="flex gap-2">
                    {[0, 3.5, 4.0, 4.5].map(r => (
                      <button
                        key={r}
                        onClick={() => setMinRating(r)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${minRating === r ? "bg-amber-400 border-amber-400 text-white" : "bg-white border-gray-200 text-gray-600 hover:border-amber-300"}`}
                      >
                        {r === 0 ? "Any" : `${r}+`}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-3">
                    Max Consultation Fee: <span className="text-sky-600">{maxFee >= 500 ? "Any" : `$${maxFee}`}</span>
                  </label>
                  <div className="flex gap-2">
                    {[500, 200, 150, 100].map(f => (
                      <button
                        key={f}
                        onClick={() => setMaxFee(f)}
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

        {/* ── GRID ── */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <div key={i} className="glass-card h-96 animate-pulse bg-white/40" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card p-16 text-center max-w-xl mx-auto">
            <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-sky-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-500">Try adjusting your search or filters.</p>
            <Button variant="outline" className="mt-5 rounded-xl" onClick={clearAll}>Clear All Filters</Button>
          </div>
        ) : (
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
                  key={doctor.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
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

function DoctorCard({ doctor }: { doctor: any }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const createAppointment = useCreateAppointment({
    mutation: {
      onSuccess: () => {
        toast({ title: "Appointment Booked!", description: `Your visit with ${doctor.name} has been scheduled.` });
        setOpen(false);
        setLocation("/appointments");
      },
      onError: () => {
        toast({ title: "Booking Failed", variant: "destructive" });
      },
    },
  });

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;
    createAppointment.mutate({ data: { doctorId: doctor.id, doctorName: doctor.name, specialty: doctor.specialty, date, time, fee: doctor.fee } });
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl flex flex-col overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full shadow-sm">

      {/* Top image section */}
      <div className="relative h-32 bg-gradient-to-br from-sky-50 to-sky-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-sky-50 to-white" />
        <img
          src={doctor.imageUrl || FALLBACK_IMG}
          alt={doctor.name}
          onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
          className="absolute bottom-0 right-4 w-24 h-24 rounded-2xl object-cover shadow-lg border-4 border-white group-hover:scale-105 transition-transform duration-500"
        />
        {doctor.available && (
          <span className="absolute top-4 left-4 flex items-center gap-1.5 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> Available
          </span>
        )}
        <div className="absolute top-4 right-32 flex items-center gap-1 bg-white border border-yellow-200 px-2.5 py-1 rounded-full shadow-sm">
          <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
          <span className="text-xs font-bold text-gray-800">{doctor.rating}</span>
          <span className="text-xs text-gray-400">({doctor.reviewCount})</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 leading-tight">{doctor.name}</h3>
          <p className="text-sky-600 text-sm font-semibold mt-0.5">{doctor.specialty}</p>
        </div>

        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4 flex-1">
          {doctor.bio || "Experienced specialist dedicated to providing top-quality patient care."}
        </p>

        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-semibold text-gray-700">{doctor.experience}+</span> yrs
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-semibold text-gray-700 truncate max-w-[100px]">{doctor.location || "NYC"}</span>
          </span>
          <span className="flex items-center gap-1.5 ml-auto">
            <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-emerald-600 font-semibold">Verified</span>
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Fee</p>
            <p className="text-2xl font-extrabold text-gray-900">${doctor.fee}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl px-6 shadow-md shadow-sky-200">
                  Book Visit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-3xl">
                <DialogHeader className="pt-2">
                  <DialogTitle className="text-2xl font-bold">Book Appointment</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleBook} className="space-y-5 pt-2">
                  <div className="flex items-center gap-4 p-4 bg-sky-50 border border-sky-100 rounded-2xl">
                    <img
                      src={doctor.imageUrl || FALLBACK_IMG}
                      alt={doctor.name}
                      onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                    <div>
                      <p className="font-bold text-gray-900">{doctor.name}</p>
                      <p className="text-sm text-sky-700 font-medium">{doctor.specialty} · ${doctor.fee}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Select Date</Label>
                    <Input type="date" required value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split("T")[0]} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Select Time</Label>
                    <Select value={time} onValueChange={setTime}>
                      <SelectTrigger className="h-11"><SelectValue placeholder="Choose a slot" /></SelectTrigger>
                      <SelectContent>
                        {["09:00","10:00","11:00","13:00","14:00","15:00","16:00"].map(t => (
                          <SelectItem key={t} value={t}>{t} – {parseInt(t)+1}:00</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-gray-500">Free cancellation up to 24 hours before your appointment.</p>
                  </div>
                  <DialogFooter className="gap-2 pt-2">
                    <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl">Cancel</Button>
                    <Button type="submit" className="bg-sky-600 hover:bg-sky-700 rounded-xl px-8" disabled={createAppointment.isPending}>
                      {createAppointment.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Confirm Booking
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <button
              onClick={() => setLocation(`/doctor/${doctor.id}`)}
              className="text-xs text-gray-400 hover:text-sky-600 transition-colors font-medium"
            >
              View Profile →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
