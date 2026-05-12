import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useListDoctors, getListDoctorsQueryKey, useCreateAppointment } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useLocation } from "wouter";
import { Star, Loader2, Sparkles, CheckCircle2, X, ArrowRight, Stethoscope, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/* ── symptom → specialties mapping ── */
const SYMPTOM_MAP: Record<string, string[]> = {
  "Fever":              ["General Medicine"],
  "Headache":           ["Neurology", "General Medicine"],
  "Migraine":           ["Neurology"],
  "Skin Rash":          ["Dermatology"],
  "Acne / Pimples":     ["Dermatology"],
  "Itchy Skin":         ["Dermatology"],
  "Cough":              ["Pulmonology", "General Medicine"],
  "Shortness of Breath":["Pulmonology", "Cardiology"],
  "Wheezing":           ["Pulmonology"],
  "Stomach Pain":       ["General Medicine"],
  "Nausea / Vomiting":  ["General Medicine"],
  "Diarrhea":           ["General Medicine"],
  "Fatigue":            ["General Medicine"],
  "Dizziness":          ["Neurology"],
  "Chest Pain":         ["Cardiology"],
  "Heart Palpitations": ["Cardiology"],
  "Joint Pain":         ["Orthopedics"],
  "Back Pain":          ["Orthopedics"],
  "Muscle Weakness":    ["Neurology", "Orthopedics"],
  "Ear Pain":           ["ENT"],
  "Runny Nose":         ["ENT"],
  "Sore Throat":        ["ENT"],
  "Child Fever":        ["Pediatrics"],
  "Child Cough":        ["Pediatrics"],
};

const SYMPTOM_CATEGORIES = [
  { label: "General", color: "sky", items: ["Fever", "Fatigue", "Headache", "Nausea / Vomiting", "Diarrhea", "Stomach Pain"] },
  { label: "Heart & Lungs", color: "rose", items: ["Chest Pain", "Heart Palpitations", "Cough", "Shortness of Breath", "Wheezing"] },
  { label: "Brain & Nerves", color: "violet", items: ["Migraine", "Dizziness", "Muscle Weakness"] },
  { label: "Skin", color: "amber", items: ["Skin Rash", "Acne / Pimples", "Itchy Skin"] },
  { label: "Bones & Joints", color: "orange", items: ["Joint Pain", "Back Pain"] },
  { label: "ENT", color: "teal", items: ["Ear Pain", "Runny Nose", "Sore Throat"] },
  { label: "Children", color: "pink", items: ["Child Fever", "Child Cough"] },
];

const COLOR: Record<string, { pill: string; active: string }> = {
  sky:    { pill: "bg-sky-50 border-sky-200 text-sky-700",    active: "bg-sky-600 border-sky-600 text-white" },
  rose:   { pill: "bg-rose-50 border-rose-200 text-rose-700", active: "bg-rose-600 border-rose-600 text-white" },
  violet: { pill: "bg-violet-50 border-violet-200 text-violet-700", active: "bg-violet-600 border-violet-600 text-white" },
  amber:  { pill: "bg-amber-50 border-amber-200 text-amber-700", active: "bg-amber-500 border-amber-500 text-white" },
  orange: { pill: "bg-orange-50 border-orange-200 text-orange-700", active: "bg-orange-500 border-orange-500 text-white" },
  teal:   { pill: "bg-teal-50 border-teal-200 text-teal-700",  active: "bg-teal-600 border-teal-600 text-white" },
  pink:   { pill: "bg-pink-50 border-pink-200 text-pink-700",  active: "bg-pink-500 border-pink-500 text-white" },
};

/* derive matched specialties from selected symptoms */
function getSpecialties(symptoms: string[]): string[] {
  const set = new Set<string>();
  symptoms.forEach(s => SYMPTOM_MAP[s]?.forEach(sp => set.add(sp)));
  return [...set];
}

/* fallback image if imageUrl is missing */
const FALLBACK = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face";

function BookingDialog({ doctor }: { doctor: any }) {
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl px-5 gap-1.5">
          Book <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader className="pt-2">
          <DialogTitle className="text-2xl font-bold">Book Appointment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleBook} className="space-y-5 pt-2">
          <div className="flex items-center gap-4 p-4 bg-sky-50 border border-sky-100 rounded-2xl">
            <img src={doctor.imageUrl || FALLBACK} alt={doctor.name} onError={e => { (e.target as HTMLImageElement).src = FALLBACK; }} className="w-14 h-14 rounded-xl object-cover" />
            <div>
              <p className="font-bold text-gray-900">{doctor.name}</p>
              <p className="text-sm text-sky-700 font-medium">{doctor.specialty} · ${doctor.fee}</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="font-semibold text-gray-700">Date</Label>
            <Input type="date" required value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split("T")[0]} className="h-11" />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold text-gray-700">Time</Label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger className="h-11"><SelectValue placeholder="Choose a slot" /></SelectTrigger>
              <SelectContent>
                {["09:00","10:00","11:00","13:00","14:00","15:00","16:00"].map(t => (
                  <SelectItem key={t} value={t}>{t} – {parseInt(t)+1}:00</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl">Cancel</Button>
            <Button type="submit" className="bg-sky-600 hover:bg-sky-700 rounded-xl px-8" disabled={createAppointment.isPending}>
              {createAppointment.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Confirm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DoctorResultCard({ doctor, index }: { doctor: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
    >
      <div className="relative shrink-0">
        <img
          src={doctor.imageUrl || FALLBACK}
          alt={doctor.name}
          onError={e => { (e.target as HTMLImageElement).src = FALLBACK; }}
          className="w-16 h-16 rounded-xl object-cover border border-gray-100 shadow-sm"
        />
        {doctor.available && (
          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-gray-900 text-sm truncate">{doctor.name}</h4>
        <p className="text-xs text-sky-600 font-semibold mb-1">{doctor.specialty}</p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="flex items-center gap-0.5 text-amber-500 font-bold">
            <Star className="w-3 h-3 fill-current" /> {doctor.rating}
          </span>
          <span>·</span>
          <span>{doctor.experience}+ yrs</span>
          <span>·</span>
          <span className="text-emerald-600 font-bold">${doctor.fee}</span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0">
        <BookingDialog doctor={doctor} />
        <Link href={`/doctor/${doctor.id}`}>
          <span className="text-xs text-gray-400 hover:text-sky-600 transition-colors cursor-pointer">View Profile</span>
        </Link>
      </div>
    </motion.div>
  );
}

export default function Symptom() {
  const [selected, setSelected] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [done, setDone] = useState(false);

  const matchedSpecialties = useMemo(() => getSpecialties(selected), [selected]);
  const primarySpecialty = matchedSpecialties[0] || "General Medicine";

  /* fetch all doctors — we'll filter client-side across multiple specialties */
  const { data: allDoctors } = useListDoctors({}, { query: { queryKey: getListDoctorsQueryKey({}), enabled: done } });

  const matchedDoctors = useMemo(() => {
    if (!done || !allDoctors) return [];
    if (matchedSpecialties.length === 0) return allDoctors;
    return allDoctors.filter(d => matchedSpecialties.includes(d.specialty));
  }, [done, allDoctors, matchedSpecialties]);

  const toggle = (sym: string) => {
    setDone(false);
    setSelected(prev => prev.includes(sym) ? prev.filter(s => s !== sym) : [...prev, sym]);
  };

  const analyze = () => {
    setAnalyzing(true);
    setDone(false);
    setTimeout(() => { setAnalyzing(false); setDone(true); }, 1600);
  };

  const reset = () => { setSelected([]); setDescription(""); setDone(false); };

  return (
    <div className="w-full overflow-x-hidden pb-24">

      {/* ── HERO ── */}
      <div className="bg-gradient-to-br from-slate-950 via-sky-950 to-slate-900 pt-20 pb-16 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-emerald-400 to-sky-600" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="container mx-auto max-w-3xl text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-sky-300 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5">
              <Sparkles className="w-4 h-4" /> AI-Powered Symptom Analysis
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">How are you feeling today?</h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto">Select your symptoms below and we'll instantly match you with the right specialist doctors.</p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 md:px-8 mt-10 space-y-8">

        {/* ── SYMPTOM SELECTOR ── */}
        <div className="glass-card p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-sky-500" /> Select Your Symptoms
            </h2>
            {selected.length > 0 && (
              <button onClick={reset} className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors">
                <X className="w-3.5 h-3.5" /> Clear all
              </button>
            )}
          </div>

          <div className="space-y-5">
            {SYMPTOM_CATEGORIES.map(cat => (
              <div key={cat.label}>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2.5">{cat.label}</p>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map(sym => {
                    const isActive = selected.includes(sym);
                    const c = COLOR[cat.color];
                    return (
                      <button
                        key={sym}
                        onClick={() => toggle(sym)}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-sm font-medium transition-all hover:scale-105 active:scale-95 ${isActive ? c.active : c.pill}`}
                      >
                        {isActive && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {sym}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Selected summary chips */}
          {selected.length > 0 && (
            <div className="mt-6 pt-5 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                Selected ({selected.length}) — matching: <span className="text-sky-600">{matchedSpecialties.join(", ") || "General Medicine"}</span>
              </p>
            </div>
          )}

          {/* Text description */}
          <div className="mt-5">
            <label className="text-sm font-semibold text-gray-700 block mb-2">Describe how you feel (optional)</label>
            <Textarea
              placeholder="e.g. I've had chest pain for 2 days and feel short of breath when I walk..."
              className="bg-white/80 min-h-[100px] resize-none focus-visible:ring-sky-500"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <Button
            className="w-full mt-5 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white h-13 text-base rounded-xl shadow-lg shadow-sky-200 gap-2"
            onClick={analyze}
            disabled={analyzing || (selected.length === 0 && description.trim().length === 0)}
          >
            {analyzing
              ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing Symptoms...</>
              : <><Sparkles className="w-5 h-5" /> Analyze &amp; Find Doctors</>
            }
          </Button>
        </div>

        {/* ── RESULTS ── */}
        <AnimatePresence mode="wait">

          {/* Analyzing loader */}
          {analyzing && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="glass-card p-14 flex flex-col items-center text-center space-y-5"
            >
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" />
                <div className="w-full h-full bg-sky-50 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-sky-500 animate-pulse" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Analyzing your symptoms</h3>
                <p className="text-gray-500 mt-1">Matching you with the right specialists...</p>
              </div>
              {selected.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center max-w-sm">
                  {selected.map(s => (
                    <span key={s} className="text-xs bg-sky-100 text-sky-700 px-3 py-1 rounded-full font-medium">{s}</span>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Results */}
          {done && !analyzing && (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

              {/* Specialty banner */}
              <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white mb-6 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-1">Based on your symptoms</p>
                  <h2 className="text-2xl font-bold">
                    {matchedSpecialties.length === 1
                      ? `We recommend a ${matchedSpecialties[0]} specialist`
                      : `We found specialists in ${matchedSpecialties.length} departments`}
                  </h2>
                  {matchedSpecialties.length > 1 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 justify-center sm:justify-start">
                      {matchedSpecialties.map(s => (
                        <span key={s} className="text-xs bg-white/20 border border-white/30 px-2.5 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
                <Link href={`/doctors?specialty=${primarySpecialty}`}>
                  <span className="shrink-0 text-sm font-bold bg-white text-emerald-700 px-5 py-2.5 rounded-xl hover:bg-emerald-50 transition-colors cursor-pointer whitespace-nowrap">
                    View All →
                  </span>
                </Link>
              </div>

              {/* Doctor cards */}
              {matchedDoctors.length === 0 ? (
                <div className="glass-card p-10 text-center text-gray-400">
                  <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="font-medium">No specialists found. Try different symptoms.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">
                      {matchedDoctors.length} Doctor{matchedDoctors.length !== 1 ? "s" : ""} Available
                    </h3>
                    <span className="text-sm text-gray-400">Sorted by rating</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[...matchedDoctors].sort((a, b) => b.rating - a.rating).map((doc, i) => (
                      <DoctorResultCard key={doc.id} doctor={doc} index={i} />
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* Empty state */}
          {!analyzing && !done && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="glass-card p-14 flex flex-col items-center text-center space-y-4 bg-gradient-to-br from-sky-50/30 to-white"
            >
              <div className="text-5xl mb-2">🩺</div>
              <h3 className="text-2xl font-bold text-gray-900">Select symptoms above</h3>
              <p className="text-gray-500 max-w-sm leading-relaxed">
                Pick one or more symptoms from the list, then click "Analyze" to see matching specialist doctors.
              </p>
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {["Fever", "Chest Pain", "Skin Rash", "Headache"].map(s => (
                  <button key={s} onClick={() => toggle(s)}
                    className="text-sm px-3.5 py-1.5 bg-sky-50 border border-sky-200 text-sky-700 rounded-full hover:bg-sky-100 transition-colors"
                  >{s}</button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
