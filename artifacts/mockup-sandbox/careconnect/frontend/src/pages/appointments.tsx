import { useState } from "react";
import { useListAppointments, getListAppointmentsQueryKey } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MapPin, XCircle, RefreshCw, CheckCircle2, Loader2, Star, DollarSign } from "lucide-react";
import { Link } from "wouter";

const FALLBACK_IMG = "/images/doctor-fallback.jpg";

const DOCTOR_IMG_MAP: Record<string, string> = {
  "Dr. Sarah Johnson": "/images/team-sarah.jpg",
  "Dr. Rajan Patel": "/images/team-rajan.jpg",
  "Dr. Amanda Lin": "/images/team-amanda.jpg",
  "Dr. Lin Wei": "/images/team-lin.jpg",
};

const MOCK_APPOINTMENTS = [
  { id: 1, doctorName: "Dr. Sarah Johnson", specialty: "General Medicine", date: "2026-05-20", time: "10:00", fee: 120, paymentStatus: "paid", status: "confirmed", location: "CareConnect Main Center" },
  { id: 2, doctorName: "Dr. Rajan Patel", specialty: "Cardiology", date: "2026-05-28", time: "14:00", fee: 200, paymentStatus: "unpaid", status: "pending", location: "Heart & Vascular Institute" },
  { id: 3, doctorName: "Dr. Amanda Lin", specialty: "Neurology", date: "2026-04-10", time: "11:00", fee: 180, paymentStatus: "paid", status: "completed", location: "Metro Neuro Center" },
  { id: 4, doctorName: "Dr. Lin Wei", specialty: "Dermatology", date: "2026-03-15", time: "09:00", fee: 160, paymentStatus: "paid", status: "cancelled", location: "Skin & Aesthetics Clinic" },
];

type Appointment = {
  id: number;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  fee: number;
  paymentStatus: string;
  status: string;
  location: string;
  imageUrl?: string;
};

type Toast = { id: number; message: string; color: string };

const STATUS_CONFIG: Record<string, { label: string; dot: string; badge: string }> = {
  pending:   { label: "Pending",   dot: "bg-amber-400",   badge: "bg-amber-50 text-amber-700 border-amber-200 shadow-amber-100" },
  confirmed: { label: "Confirmed", dot: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-emerald-100" },
  completed: { label: "Completed", dot: "bg-blue-400",    badge: "bg-blue-50 text-blue-700 border-blue-200 shadow-blue-100" },
  cancelled: { label: "Cancelled", dot: "bg-red-400",     badge: "bg-red-50 text-red-700 border-red-200 shadow-red-100" },
};

export default function Appointments() {
  const { data: apiAppointments, isLoading } = useListAppointments({
    query: { queryKey: getListAppointmentsQueryKey() },
  });

  const [localStatuses, setLocalStatuses] = useState<Record<number, string>>({});
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [nextToastId, setNextToastId] = useState(0);

  const apiAppointmentsAny = apiAppointments as any;

  const baseAppointments: Appointment[] = Array.isArray(apiAppointmentsAny)
    ? apiAppointmentsAny
    : Array.isArray(apiAppointmentsAny?.data)
    ? apiAppointmentsAny.data
    : MOCK_APPOINTMENTS;

  const appointments: Appointment[] = baseAppointments.map((apt: Appointment) => ({
    ...apt,
    status: localStatuses[apt.id] ?? apt.status,
    imageUrl: DOCTOR_IMG_MAP[apt.doctorName] ?? FALLBACK_IMG,
  }));


  const showToast = (message: string, color: string) => {
    const id = nextToastId;
    setNextToastId(n => n + 1);
    setToasts(prev => [...prev, { id, message, color }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const cancel = (id: number) => {
    setLocalStatuses(s => ({ ...s, [id]: "cancelled" }));
    showToast("Appointment cancelled successfully ✔", "emerald");
  };

  const reschedule = (id: number) => {
    showToast("Reschedule request sent ✔", "sky");
  };

  const upcoming = appointments.filter((a: Appointment) => a.status !== "completed" && a.status !== "cancelled");
  const past = appointments.filter((a: Appointment) => a.status === "completed" || a.status === "cancelled");

  return (
    <div className="w-full pb-24 pt-8 px-4 relative">

      {/* ── TOAST STACK ── */}
      <div className="fixed top-5 right-5 z-[999] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div key={t.id}
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              className="pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl shadow-gray-200/50 min-w-[240px]"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <p className="text-sm font-semibold text-gray-800">{t.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="container mx-auto max-w-4xl">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-sky-200">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Appointments</h1>
              <p className="text-gray-500 text-sm">Manage your upcoming and past medical visits</p>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-3 mt-6">
            {[
              { label: "Upcoming", value: upcoming.length, color: "bg-sky-50 text-sky-700 border-sky-200" },
              { label: "Completed", value: appointments.filter(a => a.status === "completed").length, color: "bg-blue-50 text-blue-700 border-blue-200" },
              { label: "Cancelled", value: appointments.filter(a => a.status === "cancelled").length, color: "bg-red-50 text-red-700 border-red-200" },
            ].map(({ label, value, color }) => (
              <div key={label} className={`px-4 py-2 rounded-xl border text-sm font-bold ${color}`}>
                {value} {label}
              </div>
            ))}
          </div>
        </motion.div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-44 rounded-3xl bg-gray-100 animate-pulse" />)}
          </div>
        ) : appointments.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-16 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center mb-5">
              <Calendar className="w-10 h-10 text-sky-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No appointments yet</h3>
            <p className="text-gray-500 mb-6 max-w-sm">You haven't booked any medical visits yet. Browse our specialists to get started.</p>
            <Link href="/doctors">
              <span className="px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-colors cursor-pointer">Find a Doctor</span>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-10">

            {/* Upcoming */}
            {upcoming.length > 0 && (
              <div>
                <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" /> Upcoming &amp; Active
                </h2>
                <div className="space-y-4">
                  <AnimatePresence>
                    {upcoming.map((apt, i) => (
                      <AppointmentCard key={apt.id} apt={apt} index={i}
                        onCancel={() => cancel(apt.id)}
                        onReschedule={() => reschedule(apt.id)} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Past */}
            {past.length > 0 && (
              <div>
                <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-300" /> Past Appointments
                </h2>
                <div className="space-y-4">
                  {past.map((apt, i) => (
                    <AppointmentCard key={apt.id} apt={apt} index={i}
                      onCancel={() => cancel(apt.id)}
                      onReschedule={() => reschedule(apt.id)} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AppointmentCard({ apt, index, onCancel, onReschedule }: { apt: any; index: number; onCancel: () => void; onReschedule: () => void }) {
  const cfg = STATUS_CONFIG[apt.status] ?? STATUS_CONFIG.pending;
  const isCancelled = apt.status === "cancelled";
  const isCompleted = apt.status === "completed";
  const isLocked = isCancelled || isCompleted;

  const formattedDate = (() => {
    try {
      return new Date(apt.date).toLocaleDateString(undefined, { weekday: "short", year: "numeric", month: "short", day: "numeric" });
    } catch { return apt.date; }
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ delay: index * 0.05 }}
      whileHover={!isLocked ? { y: -2, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" } : {}}
      className={`bg-white border rounded-3xl overflow-hidden shadow-sm transition-all duration-300 ${
        isLocked ? "opacity-70 border-gray-100" : "border-gray-100 hover:border-sky-200/60"
      }`}
    >
      <div className="flex flex-col md:flex-row">

        {/* Doctor image panel */}
        <div className="relative md:w-32 shrink-0 bg-gradient-to-br from-sky-50 to-sky-100 flex items-center justify-center p-4 md:p-0">
          <img
            src={apt.imageUrl}
            alt={apt.doctorName}
            onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
            className="w-20 h-20 md:w-full md:h-full object-cover md:rounded-none rounded-2xl"
          />
          {/* Status dot overlay */}
          <div className={`absolute top-2 right-2 w-3 h-3 rounded-full border-2 border-white ${cfg.dot}`} />
        </div>

        {/* Content */}
        <div className="flex-1 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{apt.doctorName}</h3>
              <p className="text-sky-600 text-sm font-semibold">{apt.specialty}</p>
            </div>
            {/* Status badge */}
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm ${cfg.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
              {cfg.label}
            </span>
          </div>

          {/* Details row */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl">
              <Calendar className="w-3.5 h-3.5 text-sky-500" /> {formattedDate}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl">
              <Clock className="w-3.5 h-3.5 text-sky-500" /> {apt.time}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl">
              <MapPin className="w-3.5 h-3.5 text-sky-500" /> {apt.location || "CareConnect Center"}
            </div>
          </div>

          {/* Bottom row: fee + buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Fee</p>
                <p className="text-xl font-extrabold text-gray-900">${apt.fee}</p>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide ${
                apt.paymentStatus === "paid"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}>
                {apt.paymentStatus === "paid" ? "✓ Paid" : "Unpaid"}
              </span>
            </div>

            {!isLocked && (
              <div className="flex items-center gap-2">
                <button
                  onClick={onReschedule}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-sky-200 text-sky-700 bg-sky-50 hover:bg-sky-100 text-xs font-bold transition-all hover:scale-105"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reschedule
                </button>
                <button
                  onClick={onCancel}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 text-xs font-bold transition-all hover:scale-105"
                >
                  <XCircle className="w-3.5 h-3.5" /> Cancel
                </button>
              </div>
            )}

            {isCompleted && (
              <div className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold bg-blue-50 px-3 py-2 rounded-xl border border-blue-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> Visit Completed
              </div>
            )}
            {isCancelled && (
              <div className="flex items-center gap-1.5 text-xs text-red-500 font-semibold bg-red-50 px-3 py-2 rounded-xl border border-red-200">
                <XCircle className="w-3.5 h-3.5" /> Appointment Cancelled
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
