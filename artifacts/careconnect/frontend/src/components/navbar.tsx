import { Link, useLocation } from "wouter";
import { Menu, X, Stethoscope, User, LogOut, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast"; // Hook import kiya

const guestLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
];

const authLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/symptom", label: "Symptom Checker", highlight: true },
  { href: "/doctors", label: "Doctors" },
  { href: "/appointments", label: "Appointments" },
  { href: "/account", label: "Account" },
];

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const { toast } = useToast(); // Toast initialized

  const navLinks = user ? authLinks : guestLinks;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Centralized clean signout function
  const handleSignOut = async () => {
    try {
      await logout();
      setProfileOpen(false);
      setIsOpen(false);
      
      // Modern interactive notification
      toast({
        title: "Signed Out",
        description: "You have been securely logged out of your session.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong while signing out.",
      });
    }
  };

  const initials = user
    ? user.fullName.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
    : "";

  return (
    <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled
        ? "bg-white/85 backdrop-blur-xl shadow-md shadow-sky-100/40 border-b border-gray-100"
        : "bg-white/60 backdrop-blur-lg border-b border-white/40"
    }`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-[68px]">

          {/* Logo */}
          <Link href="/">
            <span className="flex items-center gap-2.5 cursor-pointer group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center shadow-md shadow-sky-300/40 group-hover:shadow-sky-400/50 transition-shadow">
                <Stethoscope className="w-5 h-5 text-white" strokeWidth={2.2} />
              </div>
              <span className="text-lg font-bold tracking-tight">
                <span className="text-sky-600">Care</span><span className="text-gray-900">Connect</span>
              </span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <span className={`relative px-3.5 py-2 rounded-xl text-[13.5px] font-medium cursor-pointer transition-all duration-150 ${
                    isActive
                      ? "text-sky-700 bg-sky-50"
                      : (link as any).highlight
                        ? "text-emerald-600 hover:bg-emerald-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/70"
                  }`}>
                    {(link as any).highlight && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-white" />
                    )}
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-sky-500" />
                    )}
                  </span>
                </Link>
              );
            })}

            {/* Guest: Login + Register buttons */}
            {!user && (
              <div className="flex items-center gap-2 ml-2">
                <Link href="/login">
                  <span className="px-4 py-2 text-[13px] font-semibold text-sky-700 border border-sky-200 rounded-xl hover:bg-sky-50 transition-colors cursor-pointer">
                    Login
                  </span>
                </Link>
                <Link href="/register">
                  <span className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-[13px] font-semibold rounded-xl shadow-sm shadow-sky-300/40 cursor-pointer transition-colors">
                    Register
                  </span>
                </Link>
              </div>
            )}

            {/* Logged-in: Profile dropdown */}
            {user && (
              <div className="relative ml-2" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(p => !p)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {initials}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs text-gray-400 leading-none">Welcome,</p>
                    <p className="text-sm font-bold text-gray-800 leading-tight">{user.fullName.split(" ")[0]}</p>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100 bg-sky-50/60">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-sm font-bold text-gray-800 truncate">{user.fullName}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <div className="py-1.5">
                      <Link href="/account">
                        <span
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-sky-50 hover:text-sky-700 cursor-pointer transition-colors"
                        >
                          <User className="w-4 h-4" /> My Account
                        </span>
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden absolute top-[68px] left-0 w-full bg-white/98 backdrop-blur-xl border-b border-gray-100 shadow-xl shadow-gray-200/50 p-4">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const isActive = location === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <span
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium cursor-pointer transition-colors ${
                      isActive
                        ? "bg-sky-50 text-sky-700"
                        : (link as any).highlight
                          ? "text-emerald-600 bg-emerald-50/60"
                          : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {(link as any).highlight && <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2.5" />}
                    {link.label}
                  </span>
                </Link>
              );
            })}

            {/* Mobile: Guest buttons */}
            {!user && (
              <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100">
                <Link href="/login">
                  <span onClick={() => setIsOpen(false)} className="flex-1 block py-3 text-center border border-sky-200 text-sky-700 text-sm font-semibold rounded-xl hover:bg-sky-50 transition-colors cursor-pointer">
                    Login
                  </span>
                </Link>
                <Link href="/register">
                  <span onClick={() => setIsOpen(false)} className="flex-1 block py-3 text-center bg-sky-600 text-white text-sm font-semibold rounded-xl hover:bg-sky-700 transition-colors cursor-pointer">
                    Register
                  </span>
                </Link>
              </div>
            )}

            {/* Mobile: Logged in user info + logout */}
            {user && (
              <div className="mt-2 pt-2 border-t border-gray-100 space-y-1.5">
                <div className="flex items-center gap-3 px-4 py-3 bg-sky-50 rounded-xl">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{user.fullName}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}