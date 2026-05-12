import { useListAppointments, getListAppointmentsQueryKey, useUpdateAppointment, useDeleteAppointment } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Calendar, Clock, MapPin, MoreVertical, XCircle, CheckCircle2, FileText, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Appointments() {
  const { data: appointments, isLoading } = useListAppointments({
    query: { queryKey: getListAppointmentsQueryKey() }
  });

  return (
    <div className="flex flex-col items-center w-full pb-20 pt-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-3">My Appointments</h1>
          <p className="text-lg text-gray-600">Manage your upcoming and past medical visits.</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass-card h-40 animate-pulse bg-white/40" />
            ))}
          </div>
        ) : !appointments || appointments.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-16 text-center flex flex-col items-center justify-center max-w-2xl mx-auto"
          >
            <div className="w-24 h-24 bg-sky-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Calendar className="w-12 h-12 text-sky-400" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">No appointments yet</h3>
            <p className="text-gray-500 mb-8 max-w-md">You haven't booked any medical visits yet. Explore our directory of specialists to get started.</p>
            <Button asChild className="bg-sky-600 hover:bg-sky-700 rounded-xl px-8 h-12">
              <a href="/doctors">Find a Doctor</a>
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {appointments.map((apt, i) => (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <AppointmentCard appointment={apt} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

function AppointmentCard({ appointment }: { appointment: any }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const updateApt = useUpdateAppointment({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAppointmentsQueryKey() });
        toast({ title: "Appointment confirmed", description: "Your appointment status has been updated." });
      }
    }
  });

  const deleteApt = useDeleteAppointment({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAppointmentsQueryKey() });
        toast({ title: "Appointment cancelled", description: "Your appointment has been successfully cancelled." });
      }
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

  const isPast = new Date(appointment.date) < new Date();
  const isCancelled = appointment.status === 'cancelled';

  return (
    <div className={`glass-card p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6 transition-all ${isCancelled ? 'opacity-60 bg-gray-50/50' : 'hover:shadow-2xl hover:border-white/60'}`}>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-3">
          <Badge variant="outline" className={`capitalize px-3 py-1 font-semibold ${getStatusColor(appointment.status)}`}>
            {appointment.status}
          </Badge>
          <span className="text-sm font-bold text-sky-600 uppercase tracking-wider">{appointment.specialty}</span>
        </div>
        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">{appointment.doctorName}</h3>
        
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-4 text-sm text-gray-600">
          <div className="flex items-center gap-2 font-medium bg-white/50 px-3 py-1.5 rounded-lg border border-gray-100">
            <Calendar className="w-4 h-4 text-sky-500" />
            {new Date(appointment.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
          <div className="flex items-center gap-2 font-medium bg-white/50 px-3 py-1.5 rounded-lg border border-gray-100">
            <Clock className="w-4 h-4 text-sky-500" />
            {appointment.time}
          </div>
          <div className="flex items-center gap-2 font-medium text-gray-500">
            <MapPin className="w-4 h-4" />
            CareConnect Main Center
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between md:flex-col md:items-end gap-6 md:border-l md:border-gray-100 md:pl-8 py-2">
        <div className="text-left md:text-right">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total Fee</p>
          <div className="text-3xl font-bold text-gray-900">${appointment.fee}</div>
          <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide mt-1 bg-emerald-50 inline-block px-2 py-0.5 rounded">{appointment.paymentStatus}</div>
        </div>
        
        {!isCancelled && !isPast && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 w-10 p-0 rounded-full border-gray-200 hover:bg-gray-50 hover:text-gray-900 shadow-sm">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
              {appointment.status === 'pending' && (
                <DropdownMenuItem 
                  className="py-3 cursor-pointer rounded-lg mb-1"
                  onClick={() => updateApt.mutate({ id: appointment.id, data: { status: 'confirmed' } })}
                  disabled={updateApt.isPending}
                >
                  {updateApt.isPending ? <Loader2 className="w-4 h-4 mr-3 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-3 text-emerald-500" />}
                  <span className="font-medium">Confirm Appointment</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="py-3 cursor-pointer rounded-lg mb-1">
                <FileText className="w-4 h-4 mr-3 text-sky-500" />
                <span className="font-medium">View Details</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600 focus:bg-red-50 focus:text-red-700 py-3 cursor-pointer rounded-lg"
                onClick={() => deleteApt.mutate({ id: appointment.id })}
                disabled={deleteApt.isPending}
              >
                {deleteApt.isPending ? <Loader2 className="w-4 h-4 mr-3 animate-spin" /> : <XCircle className="w-4 h-4 mr-3" />}
                <span className="font-medium">Cancel Appointment</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
