import { useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Phone, User, Stethoscope, ShieldCheck, Loader2, CheckCircle2, ArrowLeft, Building2, Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

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

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setTimeout(() => {
      e.target.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  };

  const Field = ({ label, type = "text", value, onChange, placeholder, icon: Icon, error, rightSlot }: any) => (
    <div className="space-y-1.5">
      <label className="text-xs font-bold uppercase tracking-wider text-blue-200/80">{label}</label>
      <div className={`relative flex items-center rounded-xl border transition-all ${
        error
          ? "border-red-400/60 ring-1 ring-red-400/30 bg-white/5"
          : "border-white/15 focus-within:border-blue-400/70 focus-within:ring-2 focus-within:ring-blue-400/20 bg-white/8"
      }`}>
        <Icon className="absolute left-3.5 w-4 h-4 text-blue-300/70" />
        <input
          type={type}
          value={value}
          onChange={(e: any) => onChange(e.target.value)}
          onFocus={handleFocus}
          placeholder={placeholder}
          className="w-full h-12 pl-10 pr-10 bg-transparent text-sm text-white placeholder-white/30 outline-none"
        />
        {rightSlot && <div className="absolute right-3.5">{rightSlot}</div>}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-slate-950">

      {/* Hospital blue background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-950 to-sky-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(56,189,248,0.12),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(37,99,235,0.15),transparent_50%)]" />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-sky-500 to-transparent" />

      {/* Decorative hospital cross patterns */}
      {[...Array(4)].map((_, i) => (
        <motion.div key={i}
          className="absolute opacity-[0.04]"
          style={{ left: `${10 + i * 28}%`, top: `${15 + (i % 2) * 40}%` }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 30 + i * 5, repeat: Infinity, ease: "linear" }}
        >
          <div className="relative w-8 h-8">
            <div className="absolute inset-x-2 inset-0 bg-white rounded-sm" />
            <div className="absolute inset-0 inset-y-2 bg-white rounded-sm" />
          </div>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <Link href="/">
          <span className="inline-flex items-center gap-1.5 text-sm text-blue-300/70 hover:text-blue-200 mb-6 cursor-pointer transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </span>
        </Link>

        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
          style={{ boxShadow: "0 0 60px rgba(56,189,248,0.08), 0 25px 50px rgba(0,0,0,0.4)" }}>

          {/* Blue hospital top bar */}
          <div className="h-1.5 bg-gradient-to-r from-blue-600 via-sky-400 to-blue-500" />

          <div className="px-8 pt-8 pb-10">

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center shadow-xl shadow-blue-900/50 shrink-0">
                <Stethoscope className="w-7 h-7 text-white" strokeWidth={2} />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Create Account</h1>
                <p className="text-sm text-blue-200/60 flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-3.5 h-3.5" /> CareConnect Healthcare Portal
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Full Name" value={fullName} onChange={setFullName} placeholder="Jane Smith" icon={User} error={errors.fullName} />
              <Field label="Email Address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" icon={Mail} error={errors.email} />
              <Field label="Phone Number" type="tel" value={phone} onChange={setPhone} placeholder="+1 234 567 8900" icon={Phone} error={errors.phone} />

              <div className="space-y-1.5">
                <Field
                  label="Password" type={showPass ? "text" : "password"} value={password} onChange={setPassword}
                  placeholder="Min. 6 characters" icon={Lock} error={errors.password}
                  rightSlot={
                    <button type="button" onClick={() => setShowPass(s => !s)} className="text-blue-300/60 hover:text-blue-200 transition-colors">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />
                {password.length > 0 && (
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-300 ${strengthColor[strength]}`} style={{ width: `${(strength / 3) * 100}%` }} />
                    </div>
                    <span className={`text-xs font-semibold ${strength === 1 ? "text-red-400" : strength === 2 ? "text-amber-400" : "text-emerald-400"}`}>
                      {strengthLabel[strength]}
                    </span>
                  </div>
                )}
              </div>

              <Field
                label="Confirm Password" type={showConfirm ? "text" : "password"} value={confirm} onChange={setConfirm}
                placeholder="Re-enter password" icon={Lock} error={errors.confirm}
                rightSlot={
                  <button type="button" onClick={() => setShowConfirm(s => !s)} className="text-blue-300/60 hover:text-blue-200 transition-colors">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />

              {errors.general && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                  <ShieldCheck className="w-4 h-4 shrink-0" /> {errors.general}
                </div>
              )}

              <button
                type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold text-base shadow-lg shadow-blue-900/50 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
                style={{ boxShadow: "0 0 25px rgba(56,189,248,0.2)" }}
              >
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
                  : <><CheckCircle2 className="w-4 h-4" /> Create Account</>
                }
              </button>

              <p className="text-center text-sm text-white/40 pt-1">
                Already have an account?{" "}
                <Link href="/login">
                  <span className="text-sky-400 font-bold hover:text-sky-300 cursor-pointer transition-colors">Login</span>
                </Link>
              </p>
            </form>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-4 mt-5 text-xs text-white/30">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-blue-400/60" /> Secure & Private</span>
          <span>·</span>
          <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-rose-400/60" /> HIPAA-Compliant</span>
          <span>·</span>
          <span className="flex items-center gap-1.5"><Stethoscope className="w-3.5 h-3.5 text-sky-400/60" /> Free to Join</span>
        </div>
      </motion.div>
    </div>
  );
}
