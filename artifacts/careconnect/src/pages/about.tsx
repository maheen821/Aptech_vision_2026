import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="flex flex-col items-center w-full pb-20">
      <section className="w-full pt-24 pb-16 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-6"
          >
            Our Mission is Your Health
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            We're building the future of healthcare—one where finding the right care is effortless, transparent, and always accessible.
          </motion.p>
        </div>
      </section>

      <section className="container mx-auto max-w-5xl px-4 grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8"
        >
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Why CareConnect?</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Navigating healthcare can be overwhelming. We started CareConnect to remove the friction between patients and providers. By combining intuitive technology with a curated network of top specialists, we make taking care of your health simple.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            Our platform isn't just about booking appointments—it's about building long-term relationships with healthcare professionals you can trust.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8 py-4"
        >
          {[
            { title: "Patient-First Approach", desc: "Every feature is designed around your needs and comfort." },
            { title: "Vetted Professionals", desc: "We rigorously verify all doctors in our network." },
            { title: "Transparent Pricing", desc: "No hidden fees. You know the cost before you book." },
            { title: "Secure & Private", desc: "Your health data is protected with enterprise-grade security." },
          ].map((val, i) => (
            <div key={i} className="flex gap-5 items-start">
              <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center shrink-0 shadow-sm border border-sky-200">
                <span className="text-sky-600 font-bold text-lg">{i + 1}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{val.title}</h3>
                <p className="text-gray-600">{val.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
