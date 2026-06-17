import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useListAppointments, getListAppointmentsQueryKey } from "@workspace/api-client-react";
import AccountLayout from "./layout";

function StatusBadge({ status = "unknown" }: { status?: string }) {
  const map: Record<string, string> = {
    confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    pending:   "bg-amber-100 text-amber-700 border-amber-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
    unknown:   "bg-gray-100 text-gray-500 border-gray-200",
  };
  return (
    <Badge variant="outline" className={`capitalize text-xs font-semibold px-2.5 py-0.5 ${map[status] ?? ""}`}>
      {status}
    </Badge>
  );
}

type Appointment = {
  id: string | number;
  doctorName?: string;
  specialty?: string;
  date?: string;
  time?: string;
  notes?: string;
  fee?: string | number;
  status?: string;
};

export default function AccountAppointments() {
 const { data, isLoading } = useListAppointments({
  query: { queryKey: getListAppointmentsQueryKey() },
});

const response = data as { data?: Appointment[]; appointments?: Appointment[] } | Appointment[];
const appointments: Appointment[] = Array.isArray(response)
  ? response
  : response?.data ?? response?.appointments ?? [];
  return (
    <AccountLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <div className="glass-card p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Appointment History</h2>
          <p className="text-gray-500 text-sm mb-6">All your past and upcoming medical visits.</p>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 rounded-2xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : !appointments?.length ? (
            <div className="text-center py-16 text-gray-400">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No appointments found.</p>
              <p className="text-sm mt-1">Book your first appointment from the Doctors page.</p>
            </div>
          ) : (
            <div className="space-y-3">
             {(appointments ?? []).map((apt: any, i: number) => (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-sky-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">{apt.doctorName}</p>
                    <p className="text-xs text-gray-500">{apt.specialty} · {apt.date} at {apt.time}</p>
                    {apt.notes && <p className="text-xs text-gray-400 mt-0.5 truncate">{apt.notes}</p>}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-bold text-gray-900">${apt.fee}</span>
                    <StatusBadge status={apt.status} />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AccountLayout>
  );
}
