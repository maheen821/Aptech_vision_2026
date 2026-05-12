import { motion } from "framer-motion";
import { Heart, Brain, Eye, Stethoscope, Baby, Activity, Bone, Ear } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const services = [
  { name: "General Medicine", icon: <Stethoscope className="w-8 h-8" />, desc: "Comprehensive care for everyday health concerns and routine check-ups." },
  { name: "Cardiology", icon: <Heart className="w-8 h-8" />, desc: "Expert heart care, from preventive screenings to complex treatments." },
  { name: "Neurology", icon: <Brain className="w-8 h-8" />, desc: "Specialized care for disorders of the brain and nervous system." },
  { name: "Dermatology", icon: <Eye className="w-8 h-8" />, desc: "Advanced skin care for medical and cosmetic dermatology needs." },
  { name: "Pediatrics", icon: <Baby className="w-8 h-8" />, desc: "Compassionate care for infants, children, and adolescents." },
  { name: "Orthopedics", icon: <Bone className="w-8 h-8" />, desc: "Treatment for bone, joint, and muscle conditions." },
  { name: "ENT", icon: <Ear className="w-8 h-8" />, desc: "Specialized care for ear, nose, and throat conditions." },
  { name: "Pulmonology", icon: <Activity className="w-8 h-8" />, desc: "Expert care for respiratory and lung-related conditions." },
];

export default function Services() {
  return (
    <div className="flex flex-col items-center w-full pb-20 pt-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">Medical Services</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Comprehensive healthcare coverage across multiple specialties to meet all your medical needs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-6 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300 group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-sky-50 to-white text-sky-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-sky-100 group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.name}</h3>
              <p className="text-gray-500 text-sm mb-6 flex-1">{service.desc}</p>
              <Link href={`/doctors?specialty=${service.name}`} className="w-full mt-auto">
                <Button variant="outline" className="w-full border-sky-200 text-sky-700 hover:bg-sky-50 bg-white/50">
                  Find Specialists
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
