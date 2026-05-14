import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Eye, EyeOff, Mail, Lock, Phone, User, Stethoscope,
  ShieldCheck, Loader2, CheckCircle2, ArrowLeft,
  Heart, Cross, Pill, Activity, Plus
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

/* ─── Field component defined OUTSIDE RegisterPage ──────────────────────────
   This is critical: defining it inside causes re-mount on every keystroke,
   which breaks focus and closes the keyboard. -------------------------------- */
interface FieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: React.ElementType;
  error?: string;
  rightSlot?: React.ReactNode;
}

function Field({ label, type = "text", value, onChange, placeholder, icon: Icon, error, rightSlot }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
        {label}
      </label>
      <div className={`relative flex items-center rounded-2xl border-2 transition-all duration-200 bg-white/80 backdrop-blur-sm ${
        error
          ? "border-red-400 ring-2 ring-red-100"
          : "border-gray-200 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100 focus-within:bg-white"
      }`}>
        <Icon className="absolute left-3.5 w-4 h-4 text-sky-500 shrink-0" />
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full h-12 pl-10 pr-10 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none font-medium"
        />
        {rightSlot && <div className="absolute right-3.5">{rightSlot}</div>}
      </div>
      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-500 font-medium">
          {error}
        </motion.p>
      )}
    </div>
  );
}

/* ─── Floating icon decoration ─────────────────────────────────────────────── */
const FLOATERS = [
  { Icon: Heart, x: "8%", y: "12%", size: 28, color: "text-rose-400/30", delay: 0 },
  { Icon: Plus, x: "88%", y: "8%", size: 22, color: "text-sky-400/40", delay: 0.4 },
  { Icon: Activity, x: "6%", y: "72%", size: 24, color: "text-cyan-400/30", delay: 0.8 },
  { Icon: Stethoscope, x: "90%", y: "65%", size: 30, color: "text-blue-400/25", delay: 0.2 },
  { Icon: Plus, x: "50%", y: "5%", size: 18, color: "text-sky-300/30", delay: 1 },
  { Icon: Heart, x: "80%", y: "40%", size: 20, color: "text-rose-300/25", delay: 0.6 },
  { Icon: Activity, x: "14%", y: "40%", size: 18, color: "text-cyan-300/30", delay: 1.2 },
  { Icon: Plus, x: "70%", y: "88%", size: 22, color: "text-blue-300/30", delay: 0.3 },
];

/* ─── Main page ─────────────────────────────────────────────────────────────── */
export default function RegisterPage() {
  const { register } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = "Full name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Please enter a valid email.";
    if (!/^\+?[\d\s\-()]{7,15}$/.test(phone)) e.phone = "Please enter a valid phone number.";
    if (password.length < 6) e.password = "Password must be at least 6 characters.";
    if (password !== confirm) e.confirm = "Passwords do not match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabel = ["", "Weak", "Good", "Strong"];
  const strengthColor = ["", "bg-red-400", "bg-amber-400", "bg-emerald-500"];
  const strengthText = ["", "text-red-500", "text-amber-500", "text-emerald-600"];

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(fullName.trim(), email.trim(), phone.trim(), password);
      toast({ title: `Welcome, ${fullName.split(" ")[0]}!`, description: "Your account has been created." });
      setLocation("/");
    } catch (err: any) {
      setErrors({ general: err.message || "Registration failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12 overflow-hidden">

      {/* ── Animated gradient background ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-cyan-50" />
      <motion.div
        className="absolute inset-0 opacity-60"
        animate={{ background: [
          "radial-gradient(ellipse at 20% 30%, rgba(56,189,248,0.18) 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(14,165,233,0.12) 0%, transparent 55%)",
          "radial-gradient(ellipse at 70% 20%, rgba(56,189,248,0.18) 0%, transparent 60%), radial-gradient(ellipse at 30% 80%, rgba(14,165,233,0.12) 0%, transparent 55%)",
          "radial-gradient(ellipse at 20% 30%, rgba(56,189,248,0.18) 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(14,165,233,0.12) 0%, transparent 55%)",
        ]}}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "linear-gradient(rgba(14,165,233,1) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      {/* ── Floating healthcare icons ── */}
      {FLOATERS.map(({ Icon, x, y, size, color, delay }, i) => (
        <motion.div key={i}
          className={`absolute pointer-events-none ${color}`}
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }}
          transition={{ delay, duration: 3 + i * 0.3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        >
          <Icon style={{ width: size, height: size }} />
        </motion.div>
      ))}

      {/* ── Main card ── */}
      <motion.div
        initial={{ opacity: 0, y: 36, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-lg z-10"
      >
        {/* Back link */}
        <Link href="/">
          <motion.span
            whileHover={{ x: -3 }}
            className="inline-flex items-center gap-1.5 text-sm text-sky-500 hover:text-sky-700 mb-5 cursor-pointer transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </motion.span>
        </Link>

        {/* Glassmorphism card */}
        <div className="bg-white/75 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden"
          style={{ boxShadow: "0 8px 40px rgba(14,165,233,0.12), 0 2px 8px rgba(14,165,233,0.08), inset 0 1px 0 rgba(255,255,255,0.9)" }}>

          {/* Cyan top accent bar */}
          <div className="h-1.5 bg-gradient-to-r from-sky-400 via-cyan-400 to-sky-500" />

          <div className="px-8 pt-8 pb-10">

            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
                className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center shadow-xl shadow-sky-200/60 mb-4"
              >
                <Stethoscope className="w-8 h-8 text-white" strokeWidth={2} />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-gray-900 mb-1"
              >
                Create Your CareConnect Account
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
                className="text-sm text-gray-500 font-medium"
              >
                Join Smart Healthcare System
              </motion.p>

              {/* Trust badges row */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="flex items-center justify-center gap-4 mt-3">
                {[
                  { icon: ShieldCheck, label: "HIPAA Secure" },
                  { icon: Heart, label: "Free to Join" },
                  { icon: CheckCircle2, label: "Instant Access" },
                ].map(({ icon: Icon, label }) => (
                  <span key={label} className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                    <Icon className="w-3 h-3 text-sky-500" /> {label}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-sky-200 to-transparent" />
              <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Personal Info</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              <Field
                label="Full Name"
                value={fullName}
                onChange={setFullName}
                placeholder="Jane Smith"
                icon={User}
                error={errors.fullName}
              />

              <Field
                label="Email Address"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="you@example.com"
                icon={Mail}
                error={errors.email}
              />

              <Field
                label="Phone Number"
                type="tel"
                value={phone}
                onChange={setPhone}
                placeholder="+1 234 567 8900"
                icon={Phone}
                error={errors.phone}
              />

              <div className="flex items-center gap-3 pt-1 pb-0.5">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Security</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
              </div>

              <div className="space-y-1.5">
                <Field
                  label="Password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={setPassword}
                  placeholder="Min. 6 characters"
                  icon={Lock}
                  error={errors.password}
                  rightSlot={
                    <button type="button" onClick={() => setShowPass(s => !s)}
                      className="text-gray-400 hover:text-sky-500 transition-colors">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />
                {password.length > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex items-center gap-2 px-1">
                    <div className="flex-1 flex gap-1">
                      {[1, 2, 3].map(n => (
                        <div key={n} className={`h-1 flex-1 rounded-full transition-all duration-300 ${n <= strength ? strengthColor[strength] : "bg-gray-100"}`} />
                      ))}
                    </div>
                    <span className={`text-xs font-bold ${strengthText[strength]}`}>
                      {strengthLabel[strength]}
                    </span>
                  </motion.div>
                )}
              </div>

              <Field
                label="Confirm Password"
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={setConfirm}
                placeholder="Re-enter password"
                icon={Lock}
                error={errors.confirm}
                rightSlot={
                  <button type="button" onClick={() => setShowConfirm(s => !s)}
                    className="text-gray-400 hover:text-sky-500 transition-colors">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />

              {errors.general && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                  <ShieldCheck className="w-4 h-4 shrink-0" /> {errors.general}
                </motion.div>
              )}

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02, boxShadow: "0 0 30px rgba(14,165,233,0.35)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-bold text-base shadow-lg shadow-sky-200 transition-all flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
              >
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
                  : <><CheckCircle2 className="w-4 h-4" /> Create Account</>
                }
              </motion.button>

              <p className="text-center text-sm text-gray-500 pt-1">
                Already have an account?{" "}
                <Link href="/login">
                  <span className="text-sky-600 font-bold hover:text-sky-500 cursor-pointer transition-colors">
                    Sign in
                  </span>
                </Link>
              </p>
            </form>
          </div>
        </div>

        {/* Bottom trust strip */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-5 mt-5 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" /> 256-bit SSL Encryption
          </span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-400" /> Trusted by 10,000+ patients
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
