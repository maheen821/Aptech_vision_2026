import { useParams, useLocation } from "wouter";
import { useGetDoctor, getGetDoctorQueryKey, useCreateAppointment, getListAppointmentsQueryKey } from "@workspace/api-client-react";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Star, MapPin, Clock, Award, BadgeCheck, GraduationCap, ChevronRight,
  Calendar, Phone, Heart, Shield, Users, TrendingUp, Building2,
  Stethoscope, ArrowLeft, Loader2, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const MOCK_DOCTORS: Record<number, any> = {
  1: { id: 1, name: "Dr. Sarah Johnson", specialty: "General Medicine", rating: 4.9, reviewCount: 340, experience: 12, fee: 120, available: true, imageUrl: "/images/team-sarah.jpg", location: "CareConnect Main Center", bio: "Experienced general physician with a focus on preventive care and holistic patient wellness." },
  2: { id: 2, name: "Dr. Rajan Patel", specialty: "Cardiology", rating: 4.8, reviewCount: 520, experience: 15, fee: 200, available: true, imageUrl: "/images/team-rajan.jpg", location: "Heart & Vascular Institute", bio: "Board-certified cardiologist specializing in heart disease prevention and advanced cardiac care." },
  3: { id: 3, name: "Dr. Amanda Lin", specialty: "Neurology", rating: 4.7, reviewCount: 280, experience: 10, fee: 180, available: true, imageUrl: "/images/team-amanda.jpg", location: "Metro Neuro Center", bio: "Neurologist with expertise in headache disorders, epilepsy, and movement disorders." },
  4: { id: 4, name: "Dr. Lin Wei", specialty: "Dermatology", rating: 4.9, reviewCount: 610, experience: 18, fee: 160, available: false, imageUrl: "/images/team-lin.jpg", location: "Skin & Aesthetics Clinic", bio: "Dermatologist specializing in acne, eczema, skin cancer screenings, and cosmetic procedures." },
  5: { id: 5, name: "Dr. Marcus Brown", specialty: "Pulmonology", rating: 4.6, reviewCount: 390, experience: 13, fee: 170, available: true, imageUrl: "/images/hero-doctor.jpg", location: "Lung & Chest Specialists", bio: "Pulmonologist with expertise in asthma, COPD, sleep apnea, and respiratory infections." },
  6: { id: 6, name: "Dr. Elena Vazquez", specialty: "Pediatrics", rating: 4.8, reviewCount: 270, experience: 9, fee: 130, available: true, imageUrl: "/images/doctor-fallback.jpg", location: "Children's Health Center", bio: "Pediatrician dedicated to compassionate care for infants, children, and adolescents." },
  7: { id: 7, name: "Dr. James Thompson", specialty: "Orthopedics", rating: 4.7, reviewCount: 450, experience: 16, fee: 220, available: true, imageUrl: "/images/about-feature-1.jpg", location: "Bone & Joint Institute", bio: "Orthopedic surgeon specializing in sports injuries, joint replacements, and trauma surgery." },
  8: { id: 8, name: "Dr. Priya Sharma", specialty: "ENT", rating: 4.6, reviewCount: 320, experience: 11, fee: 150, available: true, imageUrl: "/images/about-feature-2.jpg", location: "ENT & Hearing Clinic", bio: "ENT specialist treating disorders of the ear, nose, and throat including allergies and sinusitis." },
};

const EDUCATION: Record<string, { degree: string; institution: string; year: string }[]> = {
  default: [
    { degree: "MBBS", institution: "King Edward Medical University", year: "2004" },
    { degree: "FCPS – Specialization", institution: "College of Physicians & Surgeons", year: "2010" },
    { degree: "Fellowship Training", institution: "Johns Hopkins Medicine (USA)", year: "2012" },
  ],
};

const TIMINGS = [
  { day: "Monday", time: "9 AM – 1 PM" },
  { day: "Tuesday", time: "5 PM – 9 PM" },
  { day: "Wednesday", time: "9 AM – 1 PM" },
  { day: "Friday", time: "4 PM – 8 PM" },
  { day: "Saturday", time: "10 AM – 2 PM" },
];

const REVIEWS = [
  { name: "Sarah K.", rating: 5, comment: "Very thorough and knowledgeable. Listened carefully and gave clear explanations. Highly recommend!", date: "April 2026" },
  { name: "James M.", rating: 5, comment: "Excellent doctor. Made me feel completely at ease and the treatment was very effective.", date: "March 2026" },
  { name: "Priya L.", rating: 4, comment: "Professional and caring. The wait time was a bit long but the consultation was worth it.", date: "March 2026" },
  { name: "David A.", rating: 5, comment: "One of the best doctors I've visited. Trusted by my whole family for years.", date: "February 2026" },
];

const TREATS: Record<string, string[]> = {
  "General Physician": ["Fever & Infections", "Chronic Disease Management", "Preventive Care", "Hypertension & Diabetes", "Respiratory Illnesses", "General Health Checkups"],
  "Cardiologist": ["Heart Disease", "Hypertension", "Arrhythmia", "Heart Failure", "Cholesterol Management", "Coronary Artery Disease"],
  "Dermatologist": ["Acne & Breakouts", "Eczema & Psoriasis", "Skin Rashes", "Hair Loss", "Skin Infections", "Anti-ageing Treatments"],
  "Neurologist": ["Migraines & Headaches", "Epilepsy", "Multiple Sclerosis", "Parkinson's Disease", "Neuropathy", "Stroke Management"],
  "Pulmonologist": ["Asthma", "COPD", "Bronchitis", "Lung Infections", "Sleep Apnea", "Respiratory Disorders"],
  "Pediatrician": ["Child Development", "Vaccination Programs", "Growth Disorders", "Newborn Care", "Childhood Infections", "Nutritional Guidance"],
};

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

export default function DoctorProfile() {
  const { id } = useParams<{ id: string }>();
  const doctorId = parseInt(id ?? "0", 10);
  const [, setLocation] = useLocation();

  const { data: apiDoctor, isLoading } = useGetDoctor(doctorId, {
    query: { enabled: !!doctorId, queryKey: getGetDoctorQueryKey(doctorId) },
  });

  const doctor = apiDoctor ?? MOCK_DOCTORS[doctorId];
  const showLoading = isLoading && !doctor;

  const [bookOpen, setBookOpen] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createAppointment = useCreateAppointment({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAppointmentsQueryKey() });
        toast({ title: "Appointment Booked!", description: `Your visit with ${doctor?.name} has been scheduled.` });
        setBookOpen(false);
        setDate(""); setTime(""); setPatientName(""); setPhone("");
        setLocation("/appointments");
      },
      onError: () => toast({ title: "Booking Failed", description: "Please try again.", variant: "destructive" }),
    },
  });

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctor || !date || !time) return;
    createAppointment.mutate({ data: { doctorId: doctor.id, doctorName: doctor.name, specialty: doctor.specialty, date, time, fee: doctor.fee } });
  };

  if (showLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-sky-200 border-t-sky-500 animate-spin" />
          <p className="text-gray-500 font-medium">Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Doctor not found</h2>
          <Button onClick={() => setLocation("/doctors")} variant="outline">Back to Doctors</Button>
        </div>
      </div>
    );
  }

  const treats = TREATS[doctor.specialty] ?? TREATS["General Physician"];
  const education = EDUCATION.default;

  return (
    <div className="w-full pb-24">

      {/* ── HERO BANNER ── */}
      <div className="relative bg-gradient-to-br from-sky-950 via-slate-900 to-emerald-950 overflow-hidden">
        {/* decorative rings */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="container mx-auto px-4 md:px-8 py-10">
          <button
            onClick={() => setLocation("/doctors")}
            className="flex items-center gap-2 text-sky-300/80 hover:text-sky-200 text-sm font-medium mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Doctors
          </button>

          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative shrink-0"
            >
              <div className="w-36 h-36 md:w-44 md:h-44 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl ring-4 ring-sky-400/30">
                <img src={doctor.imageUrl} alt={doctor.name} className="w-full h-full object-cover" />
              </div>
              {doctor.available && (
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  Available
                </div>
              )}
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex-1"
            >
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge className="bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-semibold px-3 py-1">
                  {doctor.specialty}
                </Badge>
                <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold px-3 py-1 flex items-center gap-1">
                  <BadgeCheck className="w-3 h-3" /> Verified
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{doctor.name}</h1>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <StarRow rating={doctor.rating} size={18} />
                  <span className="text-amber-400 font-bold">{doctor.rating}</span>
                  <span className="text-gray-400 text-sm">({doctor.reviewCount} reviews)</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 text-sm text-gray-300 mb-6">
                <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-sky-400" />{doctor.experience}+ Years Experience</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-sky-400" />{doctor.location || "CareConnect Medical Center"}</span>
                <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4 text-sky-400" />CareConnect Hospital</span>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => setBookOpen(true)}
                  className="bg-sky-500 hover:bg-sky-400 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-sky-900/40"
                >
                  <Calendar className="w-4 h-4 mr-2" /> Book Appointment
                </Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-6 py-2.5 rounded-xl">
                  <Phone className="w-4 h-4 mr-2" /> Contact
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="container mx-auto px-4 md:px-8 max-w-6xl mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-8">

            {/* Quick Info Cards */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-sky-500" /> Quick Overview
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { icon: Building2, label: "Hospital", value: "CareConnect Hospital", color: "bg-sky-50 text-sky-600" },
                  { icon: Award, label: "Experience", value: `${doctor.experience}+ Years`, color: "bg-emerald-50 text-emerald-600" },
                  { icon: MapPin, label: "Location", value: doctor.location || "San Francisco, CA", color: "bg-violet-50 text-violet-600" },
                  { icon: Clock, label: "Timing", value: "9 AM – 9 PM", color: "bg-amber-50 text-amber-600" },
                  { icon: Star, label: "Rating", value: `${doctor.rating} / 5.0`, color: "bg-rose-50 text-rose-600" },
                  { icon: Stethoscope, label: "Specialty", value: doctor.specialty, color: "bg-cyan-50 text-cyan-600" },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="glass-card p-4 flex flex-col gap-2 hover:shadow-2xl transition-shadow">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color} shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">{label}</p>
                      <p className="text-sm font-bold text-gray-800 leading-snug">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Education Timeline */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="glass-card p-6 md:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-sky-500" /> Education & Credentials
                </h2>
                <div className="relative pl-6">
                  <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-gradient-to-b from-sky-400 to-emerald-400 rounded-full" />
                  {education.map((edu, i) => (
                    <div key={i} className={`relative mb-7 last:mb-0`}>
                      <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full border-2 border-sky-400 bg-white shadow" />
                      <div className="bg-gradient-to-r from-sky-50 to-white border border-sky-100 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-sky-600 bg-sky-100 px-2 py-0.5 rounded-md">{edu.year}</span>
                        </div>
                        <p className="font-bold text-gray-900">{edu.degree}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{edu.institution}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Specialization / Treats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <div className="glass-card p-6 md:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-sky-500" /> Specialization & Treats
                </h2>
                <p className="text-gray-500 text-sm mb-5">
                  {doctor.bio}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {treats.map((item) => (
                    <div key={item} className="flex items-center gap-2.5 p-3 bg-sky-50/60 border border-sky-100 rounded-xl">
                      <ChevronRight className="w-4 h-4 text-sky-500 shrink-0" />
                      <span className="text-sm font-medium text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Patient Reviews */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" /> Patient Reviews
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {REVIEWS.map((review, i) => (
                  <div key={i} className="glass-card p-5 hover:shadow-2xl transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-emerald-400 flex items-center justify-center text-white font-bold text-sm">
                          {review.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{review.name}</p>
                          <p className="text-xs text-gray-400">{review.date}</p>
                        </div>
                      </div>
                      <StarRow rating={review.rating} size={14} />
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed italic">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">

            {/* Fee Card */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="glass-card p-6 text-center">
                <p className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-1">Consultation Fee</p>
                <p className="text-5xl font-extrabold text-gray-900 mb-1">${doctor.fee}</p>
                <p className="text-sm text-gray-400 mb-5">per session</p>
                <Button
                  onClick={() => setBookOpen(true)}
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl py-3 shadow-md shadow-sky-200"
                >
                  <Calendar className="w-4 h-4 mr-2" /> Book Appointment
                </Button>
              </div>
            </motion.div>

            {/* Available Timings */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
              <div className="glass-card p-6">
                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-500" /> Available Timings
                </h3>
                <div className="space-y-2.5">
                  {TIMINGS.map(({ day, time }) => (
                    <div key={day} className="flex items-center justify-between text-sm py-2 border-b border-gray-100 last:border-0">
                      <span className="font-semibold text-gray-700">{day}</span>
                      <span className="text-sky-600 font-medium bg-sky-50 px-2.5 py-1 rounded-lg text-xs">{time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <div className="glass-card p-6">
                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" /> Success Stats
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "Patients Treated", value: `${doctor.reviewCount * 5}+`, icon: Users, color: "text-sky-500" },
                    { label: "Success Rate", value: "95%", icon: TrendingUp, color: "text-emerald-500" },
                    { label: "Years Active", value: `${doctor.experience}+`, icon: Award, color: "text-violet-500" },
                  ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                        <Icon className={`w-5 h-5 ${color}`} />
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

            {/* Why This Doctor */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
              <div className="glass-card p-6 bg-gradient-to-br from-sky-50/80 to-emerald-50/60">
                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-sky-500" /> Why Choose This Doctor?
                </h3>
                <div className="space-y-3">
                  {[
                    { icon: BadgeCheck, label: "Verified & Certified", color: "text-sky-600 bg-sky-100" },
                    { icon: Star, label: "Top Rated Specialist", color: "text-amber-600 bg-amber-100" },
                    { icon: Award, label: "Years of Expertise", color: "text-violet-600 bg-violet-100" },
                    { icon: Users, label: "Trusted by 1000+ Patients", color: "text-emerald-600 bg-emerald-100" },
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

        {/* ── BIG CTA SECTION ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 rounded-3xl overflow-hidden relative bg-gradient-to-br from-sky-600 to-emerald-600 p-8 md:p-12 text-white text-center"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent)]" />
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Book Appointment with {doctor.name}</h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">Secure your slot today. Same-day appointments available. Trusted by over 1,000 patients.</p>
            <Button
              onClick={() => setBookOpen(true)}
              className="bg-white text-sky-700 hover:bg-sky-50 font-bold px-10 py-3 rounded-2xl text-base shadow-xl"
            >
              Book Now — ${doctor.fee} / session
            </Button>
          </div>
        </motion.div>
      </div>

      {/* ── BOOKING MODAL ── */}
      <Dialog open={bookOpen} onOpenChange={setBookOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Book Appointment</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleBook} className="space-y-5 pt-1">
            {/* Doctor summary */}
            <div className="flex items-center gap-4 p-4 bg-sky-50 border border-sky-100 rounded-2xl">
              <img src={doctor.imageUrl} alt={doctor.name} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <p className="font-bold text-gray-900">{doctor.name}</p>
                <p className="text-sm text-sky-600">{doctor.specialty} · ${doctor.fee}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-semibold text-gray-700">Your Name</Label>
              <Input placeholder="Full name" value={patientName} onChange={e => setPatientName(e.target.value)} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold text-gray-700">Phone Number</Label>
              <Input placeholder="+1 (555) 000-0000" value={phone} onChange={e => setPhone(e.target.value)} className="h-11" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-semibold text-gray-700">Date</Label>
                <Input type="date" required value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="h-11" />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold text-gray-700">Time</Label>
                <Select value={time} onValueChange={setTime} required>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"].map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-emerald-50 p-3 rounded-xl flex items-start gap-2 text-xs text-emerald-700">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              Free cancellation up to 24 hours before your appointment.
            </div>

            <DialogFooter className="gap-2 pt-1">
              <Button type="button" variant="ghost" onClick={() => setBookOpen(false)} className="rounded-xl">Cancel</Button>
              <Button type="submit" className="bg-sky-600 hover:bg-sky-700 rounded-xl px-8" disabled={createAppointment.isPending}>
                {createAppointment.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Confirm Booking
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
