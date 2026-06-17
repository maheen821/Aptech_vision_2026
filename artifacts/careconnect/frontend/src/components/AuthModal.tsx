import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Phone, Lock, User, X, Stethoscope, ShieldCheck, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

function InputField({
  label, type = "text", value, onChange, placeholder, icon: Icon, rightSlot, error,
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; icon: React.ElementType; rightSlot?: React.ReactNode; error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</label>
      <div className={`relative flex items-center rounded-xl border transition-all duration-200 bg-white/70 ${
        error ? "border-red-400 ring-1 ring-red-300" : "border-gray-200 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-200"
      }`}>
        <Icon className="absolute left-3.5 w-4 h-4 text-gray-400" />
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-11 pl-10 pr-10 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none rounded-xl"
          autoComplete="off"
        />
        {rightSlot && <div className="absolute right-3">{rightSlot}</div>}
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}

function PasswordField({ label, value, onChange, placeholder, error }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; error?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <InputField
      label={label} type={show ? "text" : "password"} value={value} onChange={onChange}
      placeholder={placeholder} icon={Lock} error={error}
      rightSlot={
        <button type="button" onClick={() => setShow(s => !s)} className="text-gray-400 hover:text-sky-500 transition-colors">
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      }
    />
  );
}

function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const { login, closeAuthModal } = useAuth();
  const { toast } = useToast();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
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
      closeAuthModal();
    } catch (err: any) {
      setErrors({ general: err.message || "Login failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField
        label="Email or Phone" value={emailOrPhone} onChange={setEmailOrPhone}
        placeholder="you@example.com or +1234567890" icon={Mail} error={errors.emailOrPhone}
      />
      <PasswordField label="Password" value={password} onChange={setPassword} placeholder="Enter your password" error={errors.password} />

      {errors.general && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          <ShieldCheck className="w-4 h-4 shrink-0" /> {errors.general}
        </div>
      )}

      <button
        type="submit" disabled={loading}
        className="w-full h-12 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-700 hover:to-cyan-600 text-white font-bold text-sm shadow-lg shadow-sky-200 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Logging in...</> : <><ShieldCheck className="w-4 h-4" /> Login Securely</>}
      </button>

      <p className="text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <button type="button" onClick={onSwitch} className="text-sky-600 font-bold hover:underline">Register</button>
      </p>
    </form>
  );
}

function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const { register, closeAuthModal } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
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

  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabel = ["", "Weak", "Good", "Strong"];
  const strengthColor = ["", "bg-red-400", "bg-amber-400", "bg-emerald-500"];

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(fullName.trim(), email.trim(), phone.trim(), password);
      toast({ title: `Welcome, ${fullName.split(" ")[0]}!`, description: "Your account has been created." });
      closeAuthModal();
    } catch (err: any) {
      setErrors({ general: err.message || "Registration failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      <InputField label="Full Name" value={fullName} onChange={setFullName} placeholder="Jane Smith" icon={User} error={errors.fullName} />
      <InputField label="Email Address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" icon={Mail} error={errors.email} />
      <InputField label="Phone Number" type="tel" value={phone} onChange={setPhone} placeholder="+1 234 567 8900" icon={Phone} error={errors.phone} />

      <div className="space-y-1.5">
        <PasswordField label="Password" value={password} onChange={setPassword} placeholder="Minimum 6 characters" error={errors.password} />
        {password.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-300 ${strengthColor[passwordStrength]}`} style={{ width: `${(passwordStrength / 3) * 100}%` }} />
            </div>
            <span className={`text-xs font-semibold ${passwordStrength === 1 ? "text-red-500" : passwordStrength === 2 ? "text-amber-500" : "text-emerald-600"}`}>
              {strengthLabel[passwordStrength]}
            </span>
          </div>
        )}
      </div>

      <PasswordField label="Confirm Password" value={confirm} onChange={setConfirm} placeholder="Re-enter your password" error={errors.confirm} />

      {errors.general && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          <ShieldCheck className="w-4 h-4 shrink-0" /> {errors.general}
        </div>
      )}

      <button
        type="submit" disabled={loading}
        className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-200 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</> : <><CheckCircle2 className="w-4 h-4" /> Create Account</>}
      </button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <button type="button" onClick={onSwitch} className="text-sky-600 font-bold hover:underline">Login</button>
      </p>
    </form>
  );
}

export function AuthModal() {
  const { authModalOpen, authModalTab, closeAuthModal, openAuthModal } = useAuth();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeAuthModal(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeAuthModal]);

  return (
    <AnimatePresence>
      {authModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={closeAuthModal}
          />

          {/* Card */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="relative w-full max-w-md bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-sky-200/30 border border-white/60 overflow-hidden"
          >
            {/* Top gradient bar */}
            <div className="h-1 bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-500" />

            {/* Header */}
            <div className="px-7 pt-7 pb-5 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center shadow-md shadow-sky-200">
                  <Stethoscope className="w-5 h-5 text-white" strokeWidth={2.2} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {authModalTab === "login" ? "Welcome Back" : "Join CareConnect"}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {authModalTab === "login" ? "Sign in to your account" : "Create your free account"}
                  </p>
                </div>
              </div>
              <button
                onClick={closeAuthModal}
                className="w-8 h-8 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tab switcher */}
            <div className="px-7 mb-5">
              <div className="flex p-1 gap-1 bg-gray-100/80 rounded-2xl">
                {(["login", "register"] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => openAuthModal(tab)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 capitalize ${
                      authModalTab === tab
                        ? "bg-white text-sky-700 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab === "login" ? "Login" : "Register"}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="px-7 pb-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={authModalTab}
                  initial={{ opacity: 0, x: authModalTab === "login" ? -16 : 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: authModalTab === "login" ? 16 : -16 }}
                  transition={{ duration: 0.18 }}
                >
                  {authModalTab === "login"
                    ? <LoginForm onSwitch={() => openAuthModal("register")} />
                    : <RegisterForm onSwitch={() => openAuthModal("login")} />
                  }
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom trust strip */}
            <div className="px-7 pb-6 flex items-center justify-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Secure & Private</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Stethoscope className="w-3.5 h-3.5 text-sky-400" /> HIPAA-Compliant</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
