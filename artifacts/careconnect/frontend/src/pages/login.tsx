import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Stethoscope,
  Loader2,
  ArrowLeft,
  Heart,
  Plus,
  Activity,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

/* ─── Floating healthcare icons decoration ─────────────────────────────────── */
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

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  // Autofill bypass ke liye raw state control
  const [isPassFocused, setIsPassFocused] = useState(false);

  // =========================
  // NORMAL LOGIN VALIDATION
  // =========================
  const validate = () => {
    const e: Record<string, string> = {};
    if (!emailOrPhone.trim()) e.emailOrPhone = "Email or phone is required.";
    if (!password) e.password = "Password is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await login(emailOrPhone.trim(), password);

      toast({
        title: "Welcome back!",
        description: "You are now logged in securely.",
      });

      setLocation("/");
    } catch (err: any) {
      setErrors({
        general: err.message || "Login failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CLEAN GOOGLE LOGIN
  // =========================
  const handleGoogleLogin = async () => {
    if (googleLoading) return;
    setGoogleLoading(true);
    try {
      await loginWithGoogle();

      toast({
        title: "Login Successful",
        description: "Welcome to CareConnect dashboard.",
      });

      setLocation("/");
    } catch (error: any) {
      console.error(error);
      setErrors({ general: error.message || "Google Login failed. Try again." });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12 overflow-hidden">
      
      {/* ── Animated premium gradient background ── */}
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

        {/* Premium Layered Card Structure */}
        <div className="bg-white/75 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden"
          style={{ boxShadow: "0 8px 40px rgba(14,165,233,0.12), 0 2px 8px rgba(14,165,233,0.08), inset 0 1px 0 rgba(255,255,255,0.9)" }}>
          
          {/* Cyan/Emerald top accent bar */}
          <div className="h-1.5 bg-gradient-to-r from-sky-400 via-cyan-400 to-emerald-400" />

          <div className="px-8 pt-8 pb-10">

            {/* Corporate Healthcare Branding Identity */}
            <div className="text-center mb-6">
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
                Welcome back to CareConnect
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
                className="text-sm text-gray-500 font-medium"
              >
                Clinical Authentication Gateway
              </motion.p>

              {/* Trust badges row */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="flex items-center justify-center gap-4 mt-3">
                {[
                  { icon: ShieldCheck, label: "HIPAA Secure" },
                  { icon: Heart, label: "Encrypted" },
                  { icon: CheckCircle2, label: "Verified Access" },
                ].map(({ icon: Icon, label }) => (
                  <span key={label} className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                    <Icon className="w-3 h-3 text-sky-500" /> {label}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* ── Google Login Button with Brand Assets ── */}
            <div className="mb-5">
              <motion.button
                type="button"
                disabled={googleLoading || loading}
                onClick={handleGoogleLogin}
                whileHover={{ scale: 1.01, backgroundColor: "rgba(15, 23, 42, 0.04)" }}
                whileTap={{ scale: 0.99 }}
                className="w-full h-12 rounded-2xl border-2 border-slate-300 bg-white text-slate-800 font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-3 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-slate-500/20"
              >
                {googleLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                ) : (
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.29 1.53-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.57-5.17 3.57-8.79z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.74-2.11-6.68-4.96H1.21v3.15C3.18 21.88 7.31 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.32 14.24A7.16 7.16 0 0 1 4.91 12c0-.79.13-1.57.41-2.24V6.61H1.21A11.94 11.94 0 0 0 0 12c0 1.92.45 3.74 1.21 5.39l4.11-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.18 2.12 1.21 5.39l4.11 3.15c.94-2.85 3.57-4.96 6.68-4.96z"
                    />
                  </svg>
                )}
                <span>Continue with Google</span>
              </motion.button>
            </div>

            {/* Divider with "or" */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-gray-200" />
              <span className="text-xs text-gray-400 font-bold uppercase tracking-widest bg-transparent px-1">Or sign in with email</span>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-200 via-gray-200 to-transparent" />
            </div>

            {/* Main Operational Access Form */}
            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off" row-safe="true">
              
              {/* ── TRICK 1: Invisible Dummy inputs for Browser Autofill Trapping ── */}
              <input type="text" name="prevent_autofill_username" className="absolute top-[-9999px] left-[-9999px] w-0 h-0 opacity-0 pointer-events-none" tabIndex={-1} readOnly />
              <input type="password" name="prevent_autofill_password" className="absolute top-[-9999px] left-[-9999px] w-0 h-0 opacity-0 pointer-events-none" tabIndex={-1} readOnly />

              {/* Identity Node */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
                  Identity Verification
                </label>
                <div className={`relative flex items-center rounded-2xl border-2 transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                  errors.emailOrPhone
                    ? "border-red-400 ring-2 ring-red-100"
                    : "border-gray-200 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100 focus-within:bg-white"
                }`}>
                  <Mail className="absolute left-3.5 w-4 h-4 text-sky-500 shrink-0" strokeWidth={2} />
                  <input
                    type="text"
                    name="user_id_node_val"
                    autoComplete="one-time-code"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="Email or clinic contact number"
                    className="w-full h-12 pl-10 pr-4 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none font-medium"
                  />
                </div>
                {errors.emailOrPhone && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-500 font-medium">
                    {errors.emailOrPhone}
                  </motion.p>
                )}
              </div>

              {/* Password Node */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
                  Security Passkey
                </label>
                <div className={`relative flex items-center rounded-2xl border-2 transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                  errors.password
                    ? "border-red-400 ring-2 ring-red-100"
                    : "border-gray-200 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100 focus-within:bg-white"
                }`}>
                  <Lock className="absolute left-3.5 w-4 h-4 text-sky-500 shrink-0" strokeWidth={2} />
                  <input
                    type={showPass ? "text" : "password"}
                    name="user_pass_node_val"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsPassFocused(true)}
                    onBlur={() => setIsPassFocused(false)}
                    readOnly={!isPassFocused && password === ""}
                    placeholder="••••••••"
                    className="w-full h-12 pl-10 pr-10 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none font-medium"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 text-gray-400 hover:text-sky-500 transition-colors focus:outline-none"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-500 font-medium">
                    {errors.password}
                  </motion.p>
                )}
              </div>

              {/* Server Failure Exception Banner */}
              {errors.general && (
                <motion.div 
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium"
                >
                  <ShieldCheck className="w-4 h-4 shrink-0" /> {errors.general}
                </motion.div>
              )}

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={loading || googleLoading}
                whileHover={{ scale: loading ? 1 : 1.02, boxShadow: "0 0 30px rgba(14,165,233,0.35)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 via-sky-400 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-bold text-base shadow-lg shadow-sky-200 transition-all flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    Verifying Credentials...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Access Dashboard Securely
                  </>
                )}
              </motion.button>

              <p className="text-center text-sm text-gray-500 pt-1">
                New to the system?{" "}
                <Link href="/register">
                  <span className="text-sky-600 font-bold hover:text-sky-500 cursor-pointer transition-colors">
                    Create an account
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
            <Heart className="w-3.5 h-3.5 text-rose-400" /> Trusted Healthcare Network
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}