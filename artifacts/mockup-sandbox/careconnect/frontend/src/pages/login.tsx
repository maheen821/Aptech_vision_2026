import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Stethoscope, ShieldCheck, Loader2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

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
      toast({ title: "Welcome back!", description: "You are now logged in." });
      setLocation("/");
    } catch (err: any) {
      setErrors({ general: err.message || "Login failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-emerald-50" />
      <div className="absolute top-20 -left-40 w-96 h-96 bg-sky-300/20 rounded-full mix-blend-multiply filter blur-3xl" />
      <div className="absolute -bottom-20 -right-40 w-96 h-96 bg-emerald-300/20 rounded-full mix-blend-multiply filter blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Back link */}
        <Link href="/">
          <span className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-sky-600 mb-6 cursor-pointer transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </span>
        </Link>

        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-sky-100/40 border border-white/60 overflow-hidden">
          {/* Top gradient bar */}
          <div className="h-1.5 bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-500" />

          <div className="px-8 pt-8 pb-10">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-sky-200">
                <Stethoscope className="w-6 h-6 text-white" strokeWidth={2.2} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
                <p className="text-sm text-gray-500">Sign in to your CareConnect account</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email / Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Email or Phone</label>
                <div className={`relative flex items-center rounded-xl border transition-all ${
                  errors.emailOrPhone ? "border-red-400 ring-1 ring-red-200" : "border-gray-200 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100"
                }`}>
                  <Mail className="absolute left-3.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={emailOrPhone}
                    onChange={e => setEmailOrPhone(e.target.value)}
                    placeholder="you@example.com or phone"
                    className="w-full h-12 pl-10 pr-4 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
                  />
                </div>
                {errors.emailOrPhone && <p className="text-xs text-red-500">{errors.emailOrPhone}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Password</label>
                <div className={`relative flex items-center rounded-xl border transition-all ${
                  errors.password ? "border-red-400 ring-1 ring-red-200" : "border-gray-200 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100"
                }`}>
                  <Lock className="absolute left-3.5 w-4 h-4 text-gray-400" />
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-12 pl-10 pr-10 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
                  />
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    className="absolute right-3.5 text-gray-400 hover:text-sky-500 transition-colors">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>

              {errors.general && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                  <ShieldCheck className="w-4 h-4 shrink-0" /> {errors.general}
                </div>
              )}

              <button
                type="submit" disabled={loading}
                className="w-full h-13 py-3.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-700 hover:to-cyan-600 text-white font-bold text-base shadow-lg shadow-sky-200 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Logging in...</> : <><ShieldCheck className="w-4 h-4" /> Login Securely</>}
              </button>

              <p className="text-center text-sm text-gray-500 pt-1">
                Don't have an account?{" "}
                <Link href="/register">
                  <span className="text-sky-600 font-bold hover:underline cursor-pointer">Register</span>
                </Link>
              </p>
            </form>
          </div>
        </div>

        {/* Trust strip */}
        <div className="flex items-center justify-center gap-4 mt-5 text-xs text-gray-400">
          <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Secure & Private</span>
          <span>·</span>
          <span className="flex items-center gap-1"><Stethoscope className="w-3.5 h-3.5 text-sky-400" /> HIPAA-Compliant</span>
        </div>
      </motion.div>
    </div>
  );
}
