import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Quote, Heart, Lightbulb, Zap, Users, Award, CheckCircle } from "lucide-react";
import { Link } from "wouter";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

const fadeUp = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const fadeLeft = { hidden: { opacity: 0, x: -32 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6 } } };
const fadeRight = { hidden: { opacity: 0, x: 32 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6 } } };

const CARDS = [
  {
    color: "from-sky-600 to-sky-800",
    accent: "bg-sky-100 text-sky-700",
    icon: <Heart className="w-6 h-6" />,
    tag: "Introduction",
    title: "What is CareConnect?",
    text: "CareConnect helps patients find the right doctors easily using smart, intuitive technology. We bridge the gap between healthcare providers and the people who need them — making quality medical care accessible to everyone, everywhere.",
    image: "/images/about-feature-1.jpg",
    imageAlt: "Hospital consultation scene",
  },
  {
    color: "from-emerald-600 to-teal-700",
    accent: "bg-emerald-100 text-emerald-700",
    icon: <Lightbulb className="w-6 h-6" />,
    tag: "Mission",
    title: "Our Mission",
    text: "To provide fast, reliable, and affordable healthcare access for every person. We believe no one should struggle to find a trusted doctor. Our mission is to put that power in your hands — in just a few clicks.",
    image: "/images/about-feature-2.jpg",
    imageAlt: "Doctor helping patient",
  },
  {
    color: "from-violet-600 to-purple-800",
    accent: "bg-violet-100 text-violet-700",
    icon: <Zap className="w-6 h-6" />,
    tag: "Vision",
    title: "Our Vision",
    text: "We are building the next generation of AI-powered healthcare infrastructure — a future where intelligent systems help patients get the right diagnosis, the right doctor, and the right care at exactly the right time.",
    image: "/images/about-feature-3.jpg",
    imageAlt: "Futuristic AI healthcare",
  },
  {
    color: "from-rose-500 to-pink-700",
    accent: "bg-rose-100 text-rose-700",
    icon: <CheckCircle className="w-6 h-6" />,
    tag: "How It Works",
    title: "Simple 3-Step Process",
    text: "Enter your symptoms into our AI checker, receive smart doctor recommendations tailored to your condition, then instantly book an appointment online. No phone calls. No waiting rooms. Just seamless, modern healthcare.",
    image: "/images/about-feature-4.jpg",
    imageAlt: "AI workflow diagram",
  },
];

const TEAM = [
  { name: "Dr. Amanda Clarke", role: "Chief Medical Officer", image: "/images/team-amanda.jpg" },
  { name: "Rajan Mehta", role: "CEO & Co-founder", image: "/images/team-rajan.jpg" },
  { name: "Dr. Lin Zhou", role: "Head of AI Research", image: "/images/team-lin.jpg" },
  { name: "Sarah Osei", role: "Product Designer", image: "/images/team-sarah.jpg" },
];

const STATS = [
  { value: 50, suffix: "+", label: "Verified Doctors", icon: <Users className="w-6 h-6" /> },
  { value: 1000, suffix: "+", label: "Patients Served", icon: <Heart className="w-6 h-6" /> },
  { value: 500, suffix: "+", label: "Appointments", icon: <Award className="w-6 h-6" /> },
  { value: 98, suffix: "%", label: "Satisfaction Rate", icon: <CheckCircle className="w-6 h-6" /> },
];

export default function About() {
  return (
    <div className="w-full overflow-x-hidden pb-24">

      {/* ── HERO ── */}
      <div className="relative h-[420px] md:h-[500px] overflow-hidden">
        <img
          src="/images/about-hero.jpg"
          alt="Hospital"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-sky-950/70 to-emerald-950/60" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-emerald-400 to-sky-600" />

        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block bg-white/10 border border-white/20 text-sky-300 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5">
              About CareConnect
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Smart Healthcare<br />
              <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">for Everyone</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto">
              We're building the future of healthcare — where finding the right care is effortless, transparent, and always accessible.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── CONTENT CARDS ── */}
      <div className="container mx-auto max-w-6xl px-4 md:px-8 mt-16 space-y-10">
        {CARDS.map((card, i) => {
          const isEven = i % 2 === 0;
          return (
            <motion.div
              key={card.tag}
              variants={isEven ? fadeLeft : fadeRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="glass-card overflow-hidden flex flex-col md:flex-row group hover:shadow-2xl transition-shadow duration-500"
            >
              {/* Image side */}
              <div className={`relative w-full md:w-2/5 h-56 md:h-auto shrink-0 overflow-hidden ${isEven ? "" : "md:order-2"}`}>
                <img
                  src={card.image}
                  alt={card.imageAlt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-40`} />
                <div className={`absolute top-4 left-4 flex items-center gap-2 ${card.accent} text-xs font-bold px-3 py-1.5 rounded-full`}>
                  {card.icon}
                  {card.tag}
                </div>
              </div>

              {/* Text side */}
              <div className={`flex flex-col justify-center p-8 md:p-10 flex-1 ${isEven ? "" : "md:order-1"}`}>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{card.title}</h2>
                <p className="text-gray-600 leading-relaxed text-base md:text-lg">{card.text}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── STATS ── */}
      <div className="mt-20 bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(14,165,233,0.15),transparent_60%)]" />
        <div className="container mx-auto max-w-5xl relative">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white text-center mb-12"
          >
            Trusted by Thousands
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mx-auto mb-4">
                  {stat.icon}
                </div>
                <div className="text-4xl font-extrabold text-white mb-1">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TEAM ── */}
      <div className="container mx-auto max-w-6xl px-4 md:px-8 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-sky-50 text-sky-600 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">Our People</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Meet the Team</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">The passionate people driving better healthcare through technology.</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {TEAM.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 text-center group hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="relative mx-auto w-20 h-20 mb-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-20 h-20 rounded-2xl object-cover shadow-md group-hover:shadow-sky-200 transition-shadow"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">{member.name}</h3>
              <p className="text-xs text-sky-600 font-medium bg-sky-50 px-2 py-0.5 rounded-full inline-block">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── QUOTE ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="container mx-auto max-w-4xl px-4 md:px-8 mt-20"
      >
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-sky-600 via-sky-700 to-emerald-700 p-10 md:p-16 text-center text-white">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_70%)]" />
          <Quote className="w-14 h-14 text-white/20 mx-auto mb-6" />
          <blockquote className="relative text-2xl md:text-4xl font-bold leading-snug mb-6">
            "Healthcare is for everyone, everywhere."
          </blockquote>
          <p className="text-white/60 font-medium">— CareConnect Founding Philosophy</p>
          <div className="mt-8">
            <Link href="/services">
              <span className="inline-block bg-white text-sky-700 font-bold px-8 py-3 rounded-2xl cursor-pointer hover:bg-sky-50 transition-colors shadow-xl">
                Explore Our Services
              </span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
