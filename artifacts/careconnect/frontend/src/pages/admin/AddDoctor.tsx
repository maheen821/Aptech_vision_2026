import { useState, useRef, useEffect, useCallback } from "react";
import {
  UserPlus, Stethoscope, Clock, DollarSign, MapPin,
  FileText, Image as ImageIcon, CheckCircle2, Loader2,
  ChevronDown, X, Star, Users, ToggleLeft, ToggleRight,
  Trash2, Pencil, RefreshCw, PlusCircle, Search,
  AlertTriangle, BookOpen, Calendar, Activity, Heart,
  MessageSquare, Plus, TrendingUp, Grid, Award, ShieldCheck,
  UserCheck, Sparkles
} from "lucide-react";

const API_BASE = "http://localhost:5000";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const FALLBACK_IMG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23e0f2fe'/%3E%3Ccircle cx='40' cy='28' r='14' fill='%230ea5e9'/%3E%3Cellipse cx='40' cy='65' rx='22' ry='16' fill='%230ea5e9'/%3E%3C/svg%3E`;

const EMPTY_FORM = {
  name: "", category: "", specialty: "", experience: "", fee: "",
  location: "", bio: "", rating: "", reviewCount: "",
  successRate: "95", patientsTreated: "0",
};

type Education = { degree: string; institution: string; year: string };
type Timing = { day: string; time: string };
type Review = { name: string; rating: string; comment: string; date: string };

type Doctor = {
  _id: string;
  name: string;
  category: string;
  specialty: string;
  experience: number;
  fee: number;
  rating: number;
  reviewCount: number;
  location?: string;
  bio?: string;
  available: boolean;
  imageUrl?: string;
  education?: Education[];
  timings?: Timing[];
  treatments?: string[];
  reviews?: Review[];
  successRate?: number;
  patientsTreated?: number;
};

const MOCK_DOCTORS: Doctor[] = [
  {
    _id: "1", name: "Dr. Aisha Khan", category: "Surgical", specialty: "Cardiology",
    experience: 14, fee: 200, rating: 4.9, reviewCount: 312, location: "CareConnect Lahore",
    bio: "Board-certified cardiologist specializing in interventional procedures and heart disease management.",
    available: true,
    education: [
      { degree: "MBBS", institution: "Aga Khan University", year: "2008" },
      { degree: "FCPS Cardiology", institution: "CPSP", year: "2013" },
    ],
    timings: [{ day: "Monday", time: "9:00AM-12:00PM" }, { day: "Wednesday", time: "2:00PM-6:00PM" }],
    treatments: ["Angioplasty", "ECG", "Echo", "Stenting", "Bypass Review"],
    reviews: [{ name: "Fatima R.", rating: "5", comment: "Excellent doctor, very thorough.", date: "Jan 2024" }],
    successRate: 97, patientsTreated: 2450,
  },
  {
    _id: "2", name: "Dr. Ayeza", category: "Orthopedics", specialty: "Orthopedics",
    experience: 10, fee: 1500, rating: 3, reviewCount: 500, location: "CareConnect Faisalabad",
    bio: "An Orthopedic doctor specializes in diagnosing and treating musculoskeletal conditions.",
    available: true,
    education: [
      { degree: "MBBS", institution: "Dow University of Health Sciences", year: "2004" },
      { degree: "FCPS Orthopedic Surgery", institution: "CPSP", year: "2012" },
    ],
    timings: [{ day: "Monday", time: "8:00AM-12:00PM" }, { day: "Tuesday", time: "8:00AM-5:00PM" }],
    treatments: ["Fracture Care", "Joint Replacement", "Spine Surgery", "Sports Medicine"],
    reviews: [],
    successRate: 80, patientsTreated: 3000,
  },
  {
    _id: "3", name: "Dr. Hania Ahmed", category: "Medical", specialty: "General Medicine",
    experience: 20, fee: 200, rating: 4.5, reviewCount: 0, location: "CareConnect Karachi",
    bio: "Experienced physician with focus on preventive medicine and patient-centered care.",
    available: false,
    education: [],
    timings: [],
    treatments: ["General Checkup", "Vaccinations", "Blood Tests"],
    reviews: [],
    successRate: 95, patientsTreated: 5200,
  },
];

/* ─── Specialty Gradient Map ─── */
const SPECIALTY_GRADIENT: Record<string, string> = {
  "Cardiology":       "from-rose-500 to-pink-600",
  "Neurology":        "from-violet-500 to-purple-600",
  "Dermatology":      "from-pink-500 to-rose-500",
  "Pulmonology":      "from-sky-500 to-blue-600",
  "Orthopedics":      "from-orange-500 to-amber-500",
  "ENT":              "from-teal-500 to-cyan-600",
  "Pediatrics":       "from-sky-400 to-indigo-500",
  "General Medicine": "from-emerald-500 to-teal-600",
};

const getGrad = (specialty: string) =>
  SPECIALTY_GRADIENT[specialty] ?? "from-blue-500 to-sky-600";

/* ─── Main Component ─── */
export default function AddDoctor() {
  const [tab, setTab] = useState<"add" | "view">("view");
  const [doctors, setDoctors] = useState<Doctor[]>(MOCK_DOCTORS);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef6ff] via-[#f5f9ff] to-[#eaf3ff]">

      {/* ─── STICKY HEADER ─── */}
    <div className="bg-white border-b border-gray-100 sticky top-0 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">

          {/* LEFT: Dashboard Info */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-sky-500 rounded-xl flex items-center justify-center shadow-md shadow-blue-200 shrink-0">
                <Stethoscope className="w-4.5 h-4.5 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-black text-blue-900 leading-tight">Doctor Management</p>
                <p className="text-[10px] text-blue-400 font-medium">CareConnect Admin</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3 pl-4 border-l border-blue-100">
              <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg">
                <Users className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-xs font-black text-blue-700">{doctors.length}</span>
                <span className="text-[10px] text-blue-400 font-medium">Total</span>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-xs font-black text-emerald-700">{doctors.filter(d => d.available).length}</span>
                <span className="text-[10px] text-emerald-500 font-medium">Available</span>
              </div>
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-lg">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-black text-amber-700">
                  {doctors.length > 0 ? (doctors.reduce((a, d) => a + d.rating, 0) / doctors.length).toFixed(1) : "—"}
                </span>
                <span className="text-[10px] text-amber-500 font-medium">Avg</span>
              </div>
              <div className="hidden lg:flex items-center gap-1.5 bg-violet-50 border border-violet-100 px-3 py-1.5 rounded-lg">
                <Heart className="w-3.5 h-3.5 text-violet-500" />
                <span className="text-xs font-black text-violet-700">
                  {doctors.reduce((a, d) => a + (d.patientsTreated ?? 0), 0).toLocaleString()}
                </span>
                <span className="text-[10px] text-violet-400 font-medium">Patients</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Tabs */}
          <div className="flex items-center gap-1 bg-blue-50/80 border border-blue-100 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setTab("add")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-black transition-all ${
                tab === "add"
                  ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-md shadow-blue-200"
                  : "text-blue-500 hover:text-blue-700 hover:bg-blue-100/50"
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" /> Add Doctor
            </button>
            <button
              onClick={() => setTab("view")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-black transition-all ${
                tab === "view"
                  ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-md shadow-blue-200"
                  : "text-blue-500 hover:text-blue-700 hover:bg-blue-100/50"
              }`}
            >
              <Users className="w-3.5 h-3.5" /> View Doctors
            </button>
          </div>
        </div>
      </div>

      {/* ─── CONTENT ─── */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {tab === "add"
          ? <AddForm onSuccess={() => setTab("view")} />
          : <DoctorGrid doctors={doctors} setDoctors={setDoctors} />
        }
      </div>
    </div>
  );
}

/* ─── Doctor Grid (replaces DoctorTable) ─── */
function DoctorGrid({
  doctors,
  setDoctors,
}: {
  doctors: Doctor[];
  setDoctors: React.Dispatch<React.SetStateAction<Doctor[]>>;
}) {
  const [isLoading,  setIsLoading]  = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [search,     setSearch]     = useState("");
  const [editDoctor, setEditDoctor] = useState<Doctor | null>(null);
  const [deleteId,   setDeleteId]   = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDoctors = useCallback(async () => {
    setIsLoading(true);
    setFetchError(false);
    try {
      const res  = await fetch(`${API_BASE}/api/doctors`);
      const data = await res.json();
      const raw  = data?.data ?? data;
      const list = Array.isArray(raw) ? raw : [];
      setDoctors(list.map((d: any) => ({
        ...d,
        fee:             Number(d.fee)             || 0,
        experience:      Number(d.experience)      || 0,
        rating:          Number(d.rating)          || 0,
        reviewCount:     Number(d.reviewCount)     || 0,
        successRate:     Number(d.successRate)     || 95,
        patientsTreated: Number(d.patientsTreated) || 0,
      })));
    } catch {
      setFetchError(true);
    } finally {
      setIsLoading(false);
    }
  }, [setDoctors]);

  useEffect(() => { fetchDoctors(); }, [fetchDoctors]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await fetch(`${API_BASE}/api/doctors/${deleteId}`, { method: "DELETE" });
      setDoctors(prev => prev.filter(d => d._id !== deleteId));
      setDeleteId(null);
    } catch {
      alert("Delete failed. Try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = doctors.filter(d =>
    !search ||
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty?.toLowerCase().includes(search.toLowerCase()) ||
    d.category?.toLowerCase().includes(search.toLowerCase())
  );

  if (editDoctor) {
    return (
      <AddForm
        editData={editDoctor}
        onSuccess={() => { setEditDoctor(null); fetchDoctors(); }}
        onCancel={() => setEditDoctor(null)}
      />
    );
  }

  return (
    <div className="w-full space-y-6">

      {/* ─── Dashboard Header ─── */}
      <div className="bg-gradient-to-r from-white via-blue-50/60 to-sky-50/80 rounded-2xl border border-blue-100 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_4px_20px_-8px_rgba(37,99,235,0.10)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-sky-500 rounded-xl flex items-center justify-center shadow-md shadow-blue-200 shrink-0">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black text-blue-900 leading-tight">All Registered Doctors</h2>
            <p className="text-xs text-blue-400 font-medium mt-0.5">
              {isLoading ? "Fetching..." : `${filtered.length} specialist${filtered.length !== 1 ? "s" : ""} registered`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search doctors..."
              className="h-9 pl-9 pr-4 border border-blue-200/70 rounded-xl text-xs font-semibold bg-white text-blue-800 placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-52 transition-all shadow-sm"
            />
          </div>
          <button
            onClick={fetchDoctors}
            className="flex items-center gap-1.5 h-9 px-4 border border-blue-200 rounded-xl text-xs font-black text-blue-600 bg-white hover:bg-blue-50 transition-all shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Error state */}
      {fetchError && (
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 text-center">
          <p className="text-rose-600 font-semibold text-sm">Failed to load doctors. Is the backend running?</p>
          <button onClick={fetchDoctors} className="mt-2 text-xs text-rose-500 underline">Try again</button>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !fetchError && filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-blue-100 p-16 text-center shadow-sm">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-7 h-7 text-blue-300" />
          </div>
          <p className="text-blue-700 font-black text-lg">
            {doctors.length === 0 ? "No doctors added yet" : "No results found"}
          </p>
          <p className="text-blue-400 text-sm mt-1">
            {doctors.length === 0 ? "Use Add Doctor tab to register your first specialist." : "Try a different search term."}
          </p>
        </div>
      )}

      {/* ─── DOCTOR CARDS GRID ─── */}
      {!isLoading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((doctor) => {
            const grad = getGrad(doctor.specialty);
            const img  = doctor.imageUrl
              ? (doctor.imageUrl.startsWith("http") ? doctor.imageUrl : `${API_BASE}${doctor.imageUrl}`)
              : FALLBACK_IMG;

            return (
              <div
                key={doctor._id}
                className="group bg-white rounded-2xl border border-blue-100/70 overflow-hidden shadow-[0_4px_20px_-8px_rgba(37,99,235,0.10)] hover:shadow-[0_12px_40px_-12px_rgba(37,99,235,0.22)] hover:border-blue-200 transition-all duration-300 flex flex-col"
              >
                {/* Specialty Gradient Top Bar */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${grad} shrink-0`} />

                {/* Card Body */}
                <div className="p-5 flex flex-col flex-1 gap-4">

                  {/* ── Profile Section ── */}
                  <div className="flex flex-col items-center text-center gap-3">
                    {/* Circular Profile Image */}
                    <div className="relative">
                      <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${grad} p-0.5 shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                        <img
                          src={img}
                          alt={doctor.name}
                          onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
                          className="w-full h-full rounded-full object-cover bg-white"
                        />
                      </div>
                      {/* Available dot */}
                      <span
                        className={`absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full border-2 border-white shadow-sm ${doctor.available ? "bg-emerald-500 ring-4 ring-emerald-400/20" : "bg-gray-300"}`}
                        title={doctor.available ? "Available" : "Unavailable"}
                      />
                    </div>

                    {/* Name & Specialty */}
                    <div>
                      <h3 className="font-black text-blue-900 text-base leading-tight">{doctor.name}</h3>
                      <span className={`inline-block mt-1.5 text-[10px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r ${grad} text-white shadow-sm`}>
                        {doctor.specialty}
                      </span>
                    </div>

                    {/* Available Badge */}
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      doctor.available
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-gray-50 text-gray-500 border-gray-200"
                    }`}>
                      {doctor.available ? "● Available" : "○ Unavailable"}
                    </span>
                  </div>

                  {/* ── Stats Row ── */}
                  <div className="grid grid-cols-3 gap-2 bg-blue-50/60 rounded-xl p-3 border border-blue-100/50">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-0.5 mb-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-black text-amber-700">{doctor.rating.toFixed(1)}</span>
                      </div>
                      <p className="text-[9px] text-blue-400 font-medium uppercase tracking-wide">Rating</p>
                    </div>
                    <div className="text-center border-x border-blue-100">
                      <p className="text-xs font-black text-blue-700">{doctor.experience}yr</p>
                      <p className="text-[9px] text-blue-400 font-medium uppercase tracking-wide">Exp</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-black text-emerald-700">${doctor.fee}</p>
                      <p className="text-[9px] text-blue-400 font-medium uppercase tracking-wide">Fee</p>
                    </div>
                  </div>

                  {/* ── Detail Rows ── */}
                  <div className="space-y-2 text-xs flex-1">
                    {/* Category */}
                    <div className="flex items-center gap-2 text-blue-600">
                      <Grid className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="font-semibold truncate">{doctor.category}</span>
                    </div>

                    {/* Location */}
                    {doctor.location && (
                      <div className="flex items-center gap-2 text-blue-500">
                        <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="truncate font-medium">{doctor.location}</span>
                      </div>
                    )}

                    {/* Performance stats */}
                    <div className="flex items-center gap-3">
                      {(doctor.successRate ?? 0) > 0 && (
                        <span className="flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                          <TrendingUp className="w-3 h-3" />
                          {doctor.successRate}%
                        </span>
                      )}
                      {(doctor.patientsTreated ?? 0) > 0 && (
                        <span className="flex items-center gap-1 text-sky-600 font-medium">
                          <Heart className="w-3 h-3 text-sky-400" />
                          {(doctor.patientsTreated ?? 0).toLocaleString()} pts
                        </span>
                      )}
                    </div>

                    {/* Education */}
                    {doctor.education && doctor.education.length > 0 && (
                      <div className="flex items-start gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <p className="font-semibold text-blue-700 truncate">{doctor.education[0].degree}</p>
                          <p className="text-blue-400 truncate text-[10px]">{doctor.education[0].institution} · {doctor.education[0].year}</p>
                          {doctor.education.length > 1 && <p className="text-blue-300 text-[10px]">+{doctor.education.length - 1} more</p>}
                        </div>
                      </div>
                    )}

                    {/* Schedule */}
                    {doctor.timings && doctor.timings.length > 0 && (
                      <div className="flex items-start gap-2">
                        <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <div className="min-w-0 space-y-0.5">
                          {doctor.timings.slice(0, 2).map((t, idx) => (
                            <p key={idx} className="text-blue-500 text-[10px]">
                              <span className="font-bold text-blue-600">{t.day.slice(0, 3)}</span> · {t.time}
                            </p>
                          ))}
                          {doctor.timings.length > 2 && <p className="text-blue-300 text-[10px]">+{doctor.timings.length - 2} more days</p>}
                        </div>
                      </div>
                    )}

                    {/* Treatments */}
                    {doctor.treatments && doctor.treatments.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {doctor.treatments.slice(0, 3).map((tr, idx) => (
                          <span key={idx} className="text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-100 px-2 py-0.5 rounded-md">
                            {tr}
                          </span>
                        ))}
                        {doctor.treatments.length > 3 && (
                          <span className="text-[10px] font-bold text-blue-400 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                            +{doctor.treatments.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Reviews snippet */}
                    {doctor.reviews && doctor.reviews.length > 0 && (
                      <div className="bg-amber-50/60 border border-amber-100/60 rounded-xl p-2.5">
                        <div className="flex items-center gap-1 mb-1">
                          <MessageSquare className="w-3 h-3 text-amber-500" />
                          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wide">Top Review</span>
                        </div>
                        <p className="text-[10px] text-gray-500 italic line-clamp-2">"{doctor.reviews[0].comment}"</p>
                        <p className="text-[9px] text-amber-500 font-bold mt-0.5">— {doctor.reviews[0].name} · ★ {doctor.reviews[0].rating}</p>
                      </div>
                    )}
                  </div>

                  {/* ── Action Buttons ── */}
                  <div className="flex gap-2 pt-1 border-t border-blue-50 mt-auto">
                    <button
                      onClick={() => setEditDoctor(doctor)}
                      className="flex-1 flex items-center justify-center gap-1.5 h-9 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 hover:border-blue-300 rounded-xl text-xs font-black transition-all"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(doctor._id)}
                      className="flex-1 flex items-center justify-center gap-1.5 h-9 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 hover:border-rose-200 rounded-xl text-xs font-black transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Delete Confirmation Modal ─── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 p-7 max-w-sm w-full text-center">
            <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100">
              <AlertTriangle className="w-7 h-7 text-rose-500" />
            </div>
            <h3 className="text-lg font-black text-blue-900 mb-2">Delete Doctor?</h3>
            <p className="text-sm text-blue-400 mb-6">
              {(() => {
                const d = doctors.find(x => x._id === deleteId);
                return d ? `"${d.name}" will be permanently removed from the registry.` : "This action cannot be undone.";
              })()}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 h-11 border border-blue-200 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 h-11 bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 disabled:opacity-60 text-white font-black rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-md shadow-rose-200"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── AddForm Component ─── */
function AddForm({
  onSuccess,
  editData,
  onCancel,
}: {
  onSuccess: () => void;
  editData?: Doctor | null;
  onCancel?: () => void;
}) {
  const isEdit = !!editData;

  const [formData, setFormData] = useState({
    ...EMPTY_FORM,
    ...(editData ? {
      name:           editData.name,
      category:       editData.category ?? "",
      specialty:      editData.specialty,
      experience:     String(editData.experience),
      fee:            String(editData.fee),
      location:       editData.location ?? "",
      bio:            editData.bio ?? "",
      rating:         String(editData.rating),
      reviewCount:    String(editData.reviewCount),
      successRate:    String(editData.successRate ?? 95),
      patientsTreated: String(editData.patientsTreated ?? 0),
    } : {}),
  });

  const [available,    setAvailable]    = useState(editData ? editData.available : true);
  const [image,        setImage]        = useState<File | null>(null);
  const [preview,      setPreview]      = useState<string | null>(
    editData?.imageUrl ? (editData.imageUrl.startsWith("http") ? editData.imageUrl : `${API_BASE}${editData.imageUrl}`) : null
  );
  const [isLoading,    setIsLoading]    = useState(false);
  const [successMsg,   setSuccessMsg]   = useState("");
  const [errorMsg,     setErrorMsg]     = useState("");

  const [dbCategories, setDbCategories] = useState<string[]>([]);
  const [dbSpecialties, setDbSpecialties] = useState<string[]>([]);

  const [education,   setEducation]   = useState<Education[]>(editData?.education  ?? []);
  const [timings,     setTimings]     = useState<Timing[]>  (editData?.timings    ?? []);
  const [treatments,  setTreatments]  = useState<string[]>  (editData?.treatments  ?? []);
  const [reviews,     setReviews]     = useState<Review[]>  (
    editData?.reviews?.map(r => ({ ...r, rating: String(r.rating) })) ?? []
  );
  const [treatmentInput, setTreatmentInput] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const catRes = await fetch(`${API_BASE}/api/categories`);
        const specRes = await fetch(`${API_BASE}/api/specialties`);
        if (catRes.ok) {
          const catData = await catRes.json();
          setDbCategories(catData.map((c: any) => typeof c === "string" ? c : c.name));
        }
        if (specRes.ok) {
          const specData = await specRes.json();
          setDbSpecialties(specData.map((s: any) => typeof s === "string" ? s : s.name));
        }
      } catch (err) {
        console.error("Dropdown data fetch error:", err);
      }
    };
    fetchDropdownData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const addEducation   = () => setEducation(p => [...p, { degree: "", institution: "", year: "" }]);
  const removeEducation = (i: number) => setEducation(p => p.filter((_, idx) => idx !== i));
  const updateEducation = (i: number, field: keyof Education, val: string) =>
    setEducation(p => p.map((row, idx) => idx === i ? { ...row, [field]: val } : row));

  const addTiming   = () => setTimings(p => [...p, { day: "", time: "" }]);
  const removeTiming = (i: number) => setTimings(p => p.filter((_, idx) => idx !== i));
  const updateTiming = (i: number, field: keyof Timing, val: string) =>
    setTimings(p => p.map((row, idx) => idx === i ? { ...row, [field]: val } : row));

  const addTreatment = () => {
    const t = treatmentInput.trim();
    if (t && !treatments.includes(t)) {
      setTreatments(p => [...p, t]);
      setTreatmentInput("");
    }
  };
  const removeTreatment = (i: number) => setTreatments(p => p.filter((_, idx) => idx !== i));

  const addReview    = () => setReviews(p => [...p, { name: "", rating: "5", comment: "", date: "" }]);
  const removeReview = (i: number) => setReviews(p => p.filter((_, idx) => idx !== i));
  const updateReview = (i: number, field: keyof Review, val: string) =>
    setReviews(p => p.map((row, idx) => idx === i ? { ...row, [field]: val } : row));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => { if (v) data.append(k, v); });
      data.append("available", String(available));
      if (image) data.append("image", image);
      data.append("education",  JSON.stringify(education));
      data.append("timings",    JSON.stringify(timings));
      data.append("treatments", JSON.stringify(treatments));
      data.append("reviews",    JSON.stringify(reviews.map(r => ({ ...r, rating: Number(r.rating) }))));
      const url    = isEdit ? `${API_BASE}/api/doctors/${editData!._id}` : `${API_BASE}/api/doctors`;
      const method = isEdit ? "PUT" : "POST";
      const res    = await fetch(url, { method, body: data });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Something went wrong");
      setSuccessMsg(isEdit ? "Doctor updated successfully!" : "Doctor added successfully!");
      if (!isEdit) {
        setFormData(EMPTY_FORM);
        setAvailable(true);
        setImage(null);
        setPreview(null);
        setEducation([]);
        setTimings([]);
        setTreatments([]);
        setReviews([]);
        if (fileRef.current) fileRef.current.value = "";
      }
      setTimeout(onSuccess, 900);
    } catch (err: any) {
      setErrorMsg(err.message || "Request failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const requiredFields = ["name", "category", "specialty", "experience", "fee"] as const;
  const progress = Math.round(requiredFields.filter(k => formData[k]).length / requiredFields.length * 100);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-sky-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
            {isEdit ? <Pencil className="w-5 h-5 text-white" /> : <UserPlus className="w-5 h-5 text-white" />}
          </div>
          <div>
            <h1 className="text-2xl font-black text-blue-900">{isEdit ? "Edit Doctor" : "Add New Doctor"}</h1>
            <p className="text-sm text-blue-400">{isEdit ? "Update specialist information" : "Register a new specialist"}</p>
          </div>
        </div>
        {onCancel && (
          <button onClick={onCancel} className="flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-2 rounded-xl transition-all">
            <X className="w-4 h-4" /> Cancel
          </button>
        )}
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-blue-400 font-medium">Required fields</span>
          <span className="font-black text-blue-600">{progress}%</span>
        </div>
        <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-sky-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-[0_20px_60px_-20px_rgba(37,99,235,0.15)] border border-blue-100 overflow-hidden">

        {/* Image banner */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-600 to-sky-500 px-8 pt-8 pb-14 relative">
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-white rounded-t-3xl" />
          <p className="text-blue-100 text-xs font-black uppercase tracking-widest mb-4">Doctor Photo</p>
          <div className="flex items-end gap-5">
            <div
              onClick={() => fileRef.current?.click()}
              className="w-24 h-24 rounded-full border-4 border-white/30 bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all overflow-hidden shadow-lg relative group shrink-0"
            >
              {preview ? (
                <>
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                    <ImageIcon className="w-5 h-5 text-white" />
                  </div>
                </>
              ) : (
                <ImageIcon className="w-8 h-8 text-white/50" />
              )}
            </div>
            <div className="flex-1 pb-1">
              {image ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span className="text-white text-sm font-medium truncate max-w-[180px]">{image.name}</span>
                  <button type="button" onClick={removeImage} className="text-white/60 hover:text-white ml-auto shrink-0"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="text-sm text-white font-semibold bg-white/15 hover:bg-white/25 border border-white/20 px-4 py-2 rounded-xl transition-all">
                  Upload Photo
                </button>
              )}
              <p className="text-blue-200 text-xs mt-1.5">JPG, PNG · Optional</p>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </div>

        {/* ── FIELDS ── */}
        <div className="px-8 pb-8 space-y-5 pt-2">

          <Field icon={<UserPlus className="w-4 h-4 text-blue-500" />} label="Doctor Name" required>
            <input name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Dr. Aisha Khan" required className="fi" />
          </Field>

          <Field icon={<Grid className="w-4 h-4 text-blue-500" />} label="Category" required>
            <div className="relative">
              <select name="category" value={formData.category} onChange={handleChange} required className="fi appearance-none pr-10">
                <option value="">Select Category</option>
                {dbCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </Field>

          <Field icon={<Stethoscope className="w-4 h-4 text-blue-500" />} label="Specialty" required>
            <div className="relative">
              <select name="specialty" value={formData.specialty} onChange={handleChange} required className="fi appearance-none pr-10">
                <option value="">Select specialty</option>
                {dbSpecialties.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field icon={<Clock className="w-4 h-4 text-blue-500" />} label="Experience (yrs)" required>
              <input name="experience" type="number" min="0" max="60" value={formData.experience} onChange={handleChange} placeholder="e.g. 10" required className="fi" />
            </Field>
            <Field icon={<DollarSign className="w-4 h-4 text-blue-500" />} label="Fee ($)" required>
              <input name="fee" type="number" min="0" value={formData.fee} onChange={handleChange} placeholder="e.g. 150" required className="fi" />
            </Field>
          </div>

          {/* Rating & Reviews */}
          <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4 space-y-4">
            <p className="text-xs font-black uppercase tracking-widest text-amber-600 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Ratings & Reviews
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400" /> Rating (0–5)
                </label>
                <div className="relative">
                  <input name="rating" type="number" min="0" max="5" step="0.1" value={formData.rating} onChange={handleChange} placeholder="e.g. 4.8"
                    className="w-full h-11 px-4 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white transition" />
                  {formData.rating && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`w-3 h-3 ${parseFloat(formData.rating) >= s ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-amber-400" /> Review Count
                </label>
                <input name="reviewCount" type="number" min="0" value={formData.reviewCount} onChange={handleChange} placeholder="e.g. 320"
                  className="w-full h-11 px-4 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white transition" />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 space-y-4">
            <p className="text-xs font-black uppercase tracking-widest text-emerald-700 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> Performance Stats
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-emerald-500" /> Success Rate (%)
                </label>
                <input name="successRate" type="number" min="0" max="100" value={formData.successRate} onChange={handleChange} placeholder="e.g. 95"
                  className="w-full h-11 px-4 border border-emerald-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white transition" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-emerald-500" /> Patients Treated
                </label>
                <input name="patientsTreated" type="number" min="0" value={formData.patientsTreated} onChange={handleChange} placeholder="e.g. 1200"
                  className="w-full h-11 px-4 border border-emerald-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white transition" />
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-blue-800">Availability Status</p>
              <p className="text-xs text-blue-400 mt-0.5">{available ? "Available for bookings" : "Not taking appointments"}</p>
            </div>
            <button type="button" onClick={() => setAvailable(!available)} className="flex items-center gap-2 focus:outline-none">
              <span className={`text-xs font-black ${available ? "text-emerald-600" : "text-gray-400"}`}>{available ? "Available" : "Unavailable"}</span>
              {available ? <ToggleRight className="w-9 h-9 text-emerald-500" /> : <ToggleLeft className="w-9 h-9 text-gray-300" />}
            </button>
          </div>

          <Field icon={<MapPin className="w-4 h-4 text-blue-500" />} label="Clinic / Location">
            <input name="location" value={formData.location} onChange={handleChange} placeholder="e.g. CareConnect Lahore" className="fi" />
          </Field>

          <Field icon={<FileText className="w-4 h-4 text-blue-500" />} label="Short Bio">
            <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Describe expertise..." rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none transition bg-gray-50 focus:bg-white" />
          </Field>

          {/* Education Section */}
          <div className="rounded-2xl border border-sky-100 bg-sky-50/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-black uppercase tracking-widest text-sky-700 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Education
              </p>
              <button type="button" onClick={addEducation}
                className="flex items-center gap-1 text-xs font-black text-sky-600 hover:text-sky-700 bg-sky-100 hover:bg-sky-200 px-3 py-1.5 rounded-lg transition-all">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            {education.length === 0 && <p className="text-xs text-gray-400 text-center py-2">No education added yet.</p>}
            {education.map((edu, i) => (
              <div key={i} className="bg-white rounded-xl border border-sky-100 p-3 space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-sky-500">Entry {i + 1}</span>
                  <button type="button" onClick={() => removeEducation(i)} className="text-red-400 hover:text-red-600 transition-colors"><X className="w-3.5 h-3.5" /></button>
                </div>
                <input value={edu.degree} onChange={e => updateEducation(i, "degree", e.target.value)} placeholder="Degree (e.g. MBBS)" className="fi text-xs" style={{ height: 38 }} />
                <input value={edu.institution} onChange={e => updateEducation(i, "institution", e.target.value)} placeholder="Institution" className="fi text-xs" style={{ height: 38 }} />
                <input value={edu.year} onChange={e => updateEducation(i, "year", e.target.value)} placeholder="Year (e.g. 2010)" className="fi text-xs" style={{ height: 38 }} />
              </div>
            ))}
          </div>

          {/* Timings Section */}
          <div className="rounded-2xl border border-violet-100 bg-violet-50/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-black uppercase tracking-widest text-violet-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Availability Timings
              </p>
              <button type="button" onClick={addTiming}
                className="flex items-center gap-1 text-xs font-black text-violet-600 hover:text-violet-700 bg-violet-100 hover:bg-violet-200 px-3 py-1.5 rounded-lg transition-all">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            {timings.length === 0 && <p className="text-xs text-gray-400 text-center py-2">No timings added yet.</p>}
            {timings.map((t, i) => (
              <div key={i} className="bg-white rounded-xl border border-violet-100 p-3 flex items-center gap-2">
                <div className="relative flex-1">
                  <select value={t.day} onChange={e => updateTiming(i, "day", e.target.value)}
                    className="w-full h-10 px-3 border border-violet-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white appearance-none transition">
                    <option value="">Select day</option>
                    {DAYS.map(d => <option key={d}>{d}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>
                <input value={t.time} onChange={e => updateTiming(i, "time", e.target.value)} placeholder="e.g. 9 AM – 1 PM"
                  className="flex-1 h-10 px-3 border border-violet-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white transition" />
                <button type="button" onClick={() => removeTiming(i)} className="text-red-400 hover:text-red-600 transition-colors shrink-0"><X className="w-4 h-4" /></button>
              </div>
            ))}
          </div>

          {/* Treatments Section */}
          <div className="rounded-2xl border border-teal-100 bg-teal-50/40 p-4 space-y-3">
            <p className="text-xs font-black uppercase tracking-widest text-teal-700 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" /> Treatments Offered
            </p>
            <div className="flex gap-2">
              <input value={treatmentInput} onChange={e => setTreatmentInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTreatment(); } }}
                placeholder="e.g. Angioplasty, ECG..."
                className="flex-1 h-10 px-4 border border-teal-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 bg-white transition" />
              <button type="button" onClick={addTreatment}
                className="flex items-center gap-1 text-xs font-black text-teal-600 hover:text-teal-700 bg-teal-100 hover:bg-teal-200 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            {treatments.length === 0 && <p className="text-xs text-gray-400">Type a treatment and press Add or Enter.</p>}
            {treatments.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {treatments.map((tr, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-xs font-semibold bg-teal-100 text-teal-700 border border-teal-200 px-3 py-1.5 rounded-full">
                    {tr}
                    <button type="button" onClick={() => removeTreatment(i)} className="text-teal-400 hover:text-teal-700 transition-colors"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div className="rounded-2xl border border-orange-100 bg-orange-50/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-black uppercase tracking-widest text-orange-600 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" /> Patient Reviews
              </p>
              <button type="button" onClick={addReview}
                className="flex items-center gap-1 text-xs font-black text-orange-600 hover:text-orange-700 bg-orange-100 hover:bg-orange-200 px-3 py-1.5 rounded-lg transition-all">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            {reviews.length === 0 && <p className="text-xs text-gray-400 text-center py-2">No reviews added yet.</p>}
            {reviews.map((rev, i) => (
              <div key={i} className="bg-white rounded-xl border border-orange-100 p-3 space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-orange-500">Review {i + 1}</span>
                  <button type="button" onClick={() => removeReview(i)} className="text-red-400 hover:text-red-600 transition-colors"><X className="w-3.5 h-3.5" /></button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input value={rev.name} onChange={e => updateReview(i, "name", e.target.value)} placeholder="Reviewer Name" className="fi text-xs" style={{ height: 38 }} />
                  <div className="relative">
                    <select value={rev.rating} onChange={e => updateReview(i, "rating", e.target.value)}
                      className="w-full h-[38px] px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-gray-50 appearance-none transition">
                      {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Star{n !== 1 ? "s" : ""}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <input value={rev.date} onChange={e => updateReview(i, "date", e.target.value)} placeholder="Date (e.g. Jan 2024)" className="fi text-xs" style={{ height: 38 }} />
                <textarea value={rev.comment} onChange={e => updateReview(i, "comment", e.target.value)} placeholder="Review comment..." rows={2}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none transition bg-gray-50 focus:bg-white" />
              </div>
            ))}
          </div>

          {/* Messages */}
          {successMsg && (
            <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <p className="text-sm font-bold text-emerald-700">{successMsg}</p>
            </div>
          )}
          {errorMsg && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <X className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-sm font-bold text-red-700">{errorMsg}</p>
            </div>
          )}

          <button type="submit" disabled={isLoading} style={{ height: "52px" }}
            className="w-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 disabled:opacity-60 text-white font-black rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 text-base">
            {isLoading
              ? <><Loader2 className="w-5 h-5 animate-spin" /> {isEdit ? "Updating..." : "Adding..."}</>
              : isEdit
                ? <><Pencil className="w-5 h-5" /> Update Doctor</>
                : <><UserPlus className="w-5 h-5" /> Add Doctor</>}
          </button>
          <p className="text-center text-xs text-gray-300">* Name, Category, Specialty, Experience &amp; Fee are required</p>
        </div>
      </form>

      <style>{`.fi{width:100%;height:44px;padding:0 16px;border:1px solid #bfdbfe;border-radius:12px;font-size:14px;background:#f0f7ff;outline:none;transition:all .15s;color:#1e40af}.fi:focus{background:#fff;border-color:transparent;box-shadow:0 0 0 2px #7dd3fc}`}</style>
    </div>
  );
}

/* ─── Field wrapper ─── */
export function Field({ icon, label, required = false, children }: {
  icon: React.ReactNode; label: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-blue-500">
        {icon}{label}{required && <span className="text-blue-500">*</span>}
      </label>
      {children}
    </div>
  );
}
