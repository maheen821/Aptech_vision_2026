import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Phone, User, Stethoscope, ShieldCheck, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
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

  const Field = ({ label, type = "text", value, onChange, placeholder, icon: Icon, error, rightSlot }: any) => (
    <div className="space-y-1.5">
      <label className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</label>
      <div className={`relative flex items-center rounded-xl border transition-all ${
        error ? "border-red-400 ring-1 ring-red-200" : "border-gray-200 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100"
      }`}>
        <Icon className="absolute left-3.5 w-4 h-4 text-gray-400" />
        <input
          type={type} value={value} onChange={(e: any) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-11 pl-10 pr-10 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
        />
        {rightSlot && <div className="absolute right-3.5">{rightSlot}</div>}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-sky-50" />
      <div className="absolute top-20 -right-40 w-96 h-96 bg-emerald-300/20 rounded-full mix-blend-multiply filter blur-3xl" />
      <div className="absolute -bottom-20 -left-40 w-96 h-96 bg-sky-300/20 rounded-full mix-blend-multiply filter blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <Link href="/">
          <span className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 mb-6 cursor-pointer transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </span>
        </Link>

        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-emerald-100/40 border border-white/60 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-500" />

          <div className="px-8 pt-8 pb-10">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200">
                <Stethoscope className="w-6 h-6 text-white" strokeWidth={2.2} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
                <p className="text-sm text-gray-500">Join CareConnect for free</p>
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
                    <button type="button" onClick={() => setShowPass(s => !s)} className="text-gray-400 hover:text-emerald-500 transition-colors">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />
                {password.length > 0 && (
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-300 ${strengthColor[strength]}`} style={{ width: `${(strength / 3) * 100}%` }} />
                    </div>
                    <span className={`text-xs font-semibold ${strength === 1 ? "text-red-500" : strength === 2 ? "text-amber-500" : "text-emerald-600"}`}>
                      {strengthLabel[strength]}
                    </span>
                  </div>
                )}
              </div>

              <Field
                label="Confirm Password" type={showConfirm ? "text" : "password"} value={confirm} onChange={setConfirm}
                placeholder="Re-enter password" icon={Lock} error={errors.confirm}
                rightSlot={
                  <button type="button" onClick={() => setShowConfirm(s => !s)} className="text-gray-400 hover:text-emerald-500 transition-colors">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />

              {errors.general && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                  <ShieldCheck className="w-4 h-4 shrink-0" /> {errors.general}
                </div>
              )}

              <button
                type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-base shadow-lg shadow-emerald-200 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 mt-1"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</> : <><CheckCircle2 className="w-4 h-4" /> Create Account</>}
              </button>

              <p className="text-center text-sm text-gray-500 pt-1">
                Already have an account?{" "}
                <Link href="/login">
                  <span className="text-sky-600 font-bold hover:underline cursor-pointer">Login</span>
                </Link>
              </p>
            </form>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-5 text-xs text-gray-400">
          <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Secure & Private</span>
          <span>·</span>
          <span className="flex items-center gap-1"><Stethoscope className="w-3.5 h-3.5 text-sky-400" /> HIPAA-Compliant</span>
        </div>
      </motion.div>
    </div>
  );
}
