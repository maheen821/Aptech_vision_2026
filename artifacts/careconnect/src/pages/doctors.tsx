import { useState } from "react";
import { useListDoctors, getListDoctorsQueryKey, useCreateAppointment } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MapPin, Search, Clock, Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

export default function Doctors() {
  const searchParams = new URLSearchParams(window.location.search);
  const initialSpecialty = searchParams.get("specialty") || "all";
  
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState(initialSpecialty);
  
  const { data: doctors, isLoading } = useListDoctors(
    { search: search || undefined, specialty: specialty !== "all" ? specialty : undefined },
    { query: { queryKey: getListDoctorsQueryKey({ search: search || undefined, specialty: specialty !== "all" ? specialty : undefined }) } }
  );

  const specialties = ["all", "General Medicine", "Cardiology", "Neurology", "Dermatology", "Pediatrics", "Orthopedics", "ENT", "Pulmonology"];

  return (
    <div className="flex flex-col items-center w-full pb-20 pt-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-3">Find a Doctor</h1>
            <p className="text-lg text-gray-600 max-w-xl">Browse our network of top-rated specialists and book your appointment instantly.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input 
                placeholder="Search by name..." 
                className="pl-10 h-12 bg-white/70 backdrop-blur border-gray-200 rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={specialty} onValueChange={setSpecialty}>
              <SelectTrigger className="w-full sm:w-56 h-12 bg-white/70 backdrop-blur border-gray-200 rounded-xl">
                <SelectValue placeholder="Specialty" />
              </SelectTrigger>
              <SelectContent>
                {specialties.map(s => (
                  <SelectItem key={s} value={s}>{s === "all" ? "All Specialties" : s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="glass-card h-96 animate-pulse bg-white/40" />
            ))}
          </div>
        ) : !doctors || doctors.length === 0 ? (
          <div className="glass-card p-16 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-sky-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-600 text-lg">We couldn't find any specialists matching your search criteria. Try adjusting your filters.</p>
            <Button variant="outline" className="mt-6" onClick={() => { setSearch(""); setSpecialty("all"); }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor, i) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <DoctorCard doctor={doctor} />
              </motion.div>
            ))}
          </div>
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
        toast({ 
          title: "Appointment Booked!", 
          description: `Your visit with ${doctor.name} has been scheduled.`,
        });
        setOpen(false);
        setLocation("/appointments");
      },
      onError: () => {
        toast({ title: "Booking Failed", description: "There was an error booking your appointment. Please try again.", variant: "destructive" });
      }
    }
  });

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;
    createAppointment.mutate({
      data: {
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        date,
        time,
        fee: doctor.fee
      }
    });
  };

  return (
    <div className="glass-card flex flex-col overflow-hidden group h-full">
      <div className="p-6 pb-0 flex gap-5">
        <div className="relative">
          <img src={doctor.imageUrl} alt={doctor.name} className="w-24 h-24 rounded-2xl object-cover shadow-sm border border-gray-100" />
          {doctor.available && (
            <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 leading-tight">{doctor.name}</h3>
          <p className="text-sky-600 font-semibold text-sm mb-2">{doctor.specialty}</p>
          <div className="flex items-center gap-1.5 text-sm font-bold text-gray-800 bg-yellow-50/80 w-fit px-2 py-0.5 rounded-md">
            <Star className="w-4 h-4 text-yellow-500 fill-current" /> {doctor.rating} 
            <span className="text-gray-500 font-normal">({doctor.reviewCount})</span>
          </div>
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <p className="text-sm text-gray-600 line-clamp-3 mb-6 flex-1">{doctor.bio || "Experienced specialist dedicated to providing top-quality healthcare with a patient-first approach."}</p>
        
        <div className="space-y-3 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
          <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-sky-500"><Clock className="w-4 h-4" /></div>
            {doctor.experience} years experience
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-sky-500"><MapPin className="w-4 h-4" /></div>
            {doctor.location || "CareConnect Medical Center"}
          </div>
        </div>
      </div>

      <div className="p-6 pt-0 mt-auto">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-0.5">Consultation</p>
            <div className="font-bold text-gray-900 text-2xl">${doctor.fee}</div>
          </div>
          <button
            onClick={() => setLocation(`/doctor/${doctor.id}`)}
            className="text-sm font-semibold text-sky-600 hover:text-sky-700 underline underline-offset-2 transition-colors"
          >
            View Profile
          </button>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-200 rounded-xl">
              Book Visit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-3xl">
            <DialogHeader className="pt-2">
              <DialogTitle className="font-serif text-2xl">Book Appointment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleBook} className="space-y-6 pt-2">
              <div className="flex items-center gap-4 p-4 bg-sky-50/50 border border-sky-100 rounded-2xl">
                <img src={doctor.imageUrl} alt={doctor.name} className="w-14 h-14 rounded-full object-cover shadow-sm" />
                <div>
                  <p className="font-bold text-gray-900 text-lg">{doctor.name}</p>
                  <p className="text-sm font-medium text-sky-700">{doctor.specialty} • ${doctor.fee}</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold">Select Date</Label>
                  <Input 
                    type="date" 
                    required 
                    value={date} 
                    onChange={e => setDate(e.target.value)} 
                    min={new Date().toISOString().split('T')[0]} 
                    className="h-12 bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold">Select Time</Label>
                  <Select value={time} onValueChange={setTime} required>
                    <SelectTrigger className="h-12 bg-white">
                      <SelectValue placeholder="Choose an available slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"].map(t => (
                        <SelectItem key={t} value={t}>{t} - {parseInt(t) + 1}:00</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600 leading-relaxed">
                  By confirming, you agree to our cancellation policy. Free cancellation up to 24 hours before the appointment time.
                </p>
              </div>

              <DialogFooter className="gap-2 sm:gap-0 pt-2">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl">Cancel</Button>
                <Button type="submit" className="bg-sky-600 hover:bg-sky-700 rounded-xl px-8" disabled={createAppointment.isPending}>
                  {createAppointment.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Confirm Booking
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
