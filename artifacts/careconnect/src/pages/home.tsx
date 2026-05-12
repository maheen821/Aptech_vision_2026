import { useListDoctors, getListDoctorsQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Star, ShieldCheck, Clock, CalendarCheck } from "lucide-react";

export default function Home() {
  const { data: doctors, isLoading } = useListDoctors({}, { query: { queryKey: getListDoctorsQueryKey({}) } });

  const stats = [
    { label: "Active Patients", value: "10,000+" },
    { label: "Expert Doctors", value: "500+" },
    { label: "Appointments", value: "25,000+" },
    { label: "Satisfaction", value: "4.9/5" }
  ];

  const steps = [
    { title: "Check Symptoms", desc: "Use our smart checker to identify potential issues.", icon: <ShieldCheck className="w-8 h-8 text-sky-500" /> },
    { title: "Find a Doctor", desc: "Match with top-rated specialists in your area.", icon: <Star className="w-8 h-8 text-emerald-500" /> },
    { title: "Book Instantly", desc: "Schedule an appointment at your convenience.", icon: <CalendarCheck className="w-8 h-8 text-sky-500" /> }
  ];

  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="w-full min-h-[85vh] flex items-center pt-20 pb-32 px-4 md:px-6 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-20 -left-40 w-96 h-96 bg-sky-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 -right-40 w-96 h-96 bg-emerald-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-40 w-96 h-96 bg-blue-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

        <div className="container mx-auto max-w-6xl relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 text-center lg:text-left space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/50 text-sky-700 text-sm font-semibold shadow-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              Your Smart Healthcare Assistant
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-gray-900 leading-tight">
              Clinical confidence. <br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-emerald-500">
                Approachable care.
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
              Welcome to CareConnect. Find doctors, check symptoms, and book appointments seamlessly. Premium healthcare that feels human.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/symptom">
                <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full bg-sky-600 hover:bg-sky-700 shadow-lg shadow-sky-200 transition-all hover:scale-105">
                  Check Symptoms
                </Button>
              </Link>
              <Link href="/doctors">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full bg-white/50 backdrop-blur border-white/60 hover:bg-white/80 transition-all">
                  Find a Doctor
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 w-full max-w-lg lg:max-w-none"
          >
            <div className="relative">
              <div className="glass-card p-4 relative z-10 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <img src="https://images.unsplash.com/photo-1638202993928-7267aad84c31?auto=format&fit=crop&q=80&w=800&h=600" alt="Doctor consulting patient" className="rounded-2xl object-cover w-full h-[400px] shadow-sm" />
              </div>
              
              <div className="absolute -left-12 top-20 glass-card p-4 flex items-center gap-4 z-20 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Star className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Top Rated</p>
                  <p className="text-xs text-gray-500">Specialists</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="w-full py-12 px-4 border-y border-white/40 bg-white/40 backdrop-blur-sm">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center space-y-2">
                <h3 className="text-4xl md:text-5xl font-bold text-sky-600 font-serif">{stat.value}</h3>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="w-full py-24 px-4 container mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">How CareConnect Works</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Three simple steps to better health. We've designed a seamless experience for you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="glass-card p-8 text-center space-y-4 hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-16 h-16 mx-auto bg-white rounded-2xl shadow-sm flex items-center justify-center border border-sky-100">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
              <p className="text-gray-600">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="w-full py-24 px-4 bg-sky-50/50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Featured Specialists</h2>
              <p className="text-gray-500">Highly rated doctors available for you.</p>
            </div>
            <Link href="/doctors">
              <Button variant="ghost" className="text-sky-600 hover:text-sky-700 font-semibold">View All Doctors →</Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="glass-card h-80 animate-pulse bg-white/40" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {doctors?.slice(0, 3).map((doctor, i) => (
                <motion.div 
                  key={doctor.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card overflow-hidden group"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img src={doctor.imageUrl} alt={doctor.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-gray-900 flex items-center gap-1 shadow-sm">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      {doctor.rating}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{doctor.name}</h3>
                    <p className="text-sky-600 font-medium mb-4">{doctor.specialty}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {doctor.experience} yrs exp</span>
                      <span className="font-bold text-emerald-600">${doctor.fee}/visit</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center glass-card p-12 md:p-20 bg-gradient-to-br from-sky-500 to-emerald-400 border-none relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 relative z-10">Ready to take control of your health?</h2>
          <p className="text-sky-50 text-lg mb-10 max-w-2xl mx-auto relative z-10">Join thousands of patients who have already transformed their healthcare experience with CareConnect.</p>
          <div className="relative z-10">
            <Link href="/account">
              <Button size="lg" className="h-14 px-10 rounded-full bg-white text-sky-600 hover:bg-gray-50 hover:text-sky-700 text-lg font-bold shadow-xl">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
