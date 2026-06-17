import { Link, useLocation } from "wouter";
import { User, Heart, Calendar, Star, Settings, LogOut, ChevronRight, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
const TABS = [
  { href: "/account/profile",       label: "Health Profile",      icon: Heart },
  { href: "/account/appointments",  label: "Appointment History",  icon: Calendar },
  { href: "/account/prescriptions", label: "Prescriptions",        icon: User },
  { href: "/account/feedback",      label: "Feedback",             icon: Star },
  { href: "/account/settings",      label: "Settings",             icon: Settings },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { toast } = useToast();
   const { user, logout } = useAuth();
   const fullName = user?.fullName ?? "User";
   const initials = fullName
  .split(" ")
  .map((w: string) => w[0])
  .slice(0, 2)
  .join("")
  .toUpperCase() || "U";

  return (
    <div className="w-full pb-24 pt-10 px-4">
      <div className="container mx-auto max-w-6xl flex flex-col lg:flex-row gap-8">

        {/* ── SIDEBAR ── */}
        <div className="w-full lg:w-72 shrink-0 space-y-5">
          <div className="glass-card p-8 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-sky-200">
                JS
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-sky-600 rounded-xl flex items-center justify-center text-white shadow-md hover:bg-sky-700 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
              <div className="absolute -top-1 -left-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mt-1">{fullName}</h2>
            <p className="text-xs font-semibold text-sky-600 bg-sky-50 px-3 py-1 rounded-full mt-1.5">Premium Patient</p>
            <p className="text-xs text-gray-400 mt-2">Member since Jan 2025</p>
          </div>

          <nav className="glass-card p-3 space-y-1">
            {TABS.map(({ href, label, icon: Icon }) => {
              const isActive = location === href;
              return (
                <Link key={href} href={href}>
                  <span className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-sky-600 text-white shadow-md shadow-sky-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}>
                    <Icon className="w-4 h-4" />
                    {label}
                    {!isActive && <ChevronRight className="w-4 h-4 ml-auto text-gray-300" />}
                  </span>
                </Link>
              );
            })}
            <div className="pt-2 mt-2 border-t border-gray-100">
              <button
                onClick={() => toast({ title: "Signed out", description: "See you next time!" })}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </nav>
        </div>

        {/* ── PAGE CONTENT ── */}
        <div className="flex-1 min-w-0">
          {children}
        </div>

      </div>
    </div>
  );
}
