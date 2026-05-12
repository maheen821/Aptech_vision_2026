import { Link, useLocation } from "wouter";
import { Menu, X, Stethoscope } from "lucide-react";
import { useState, useEffect } from "react";

const navLinks = [
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
                      : link.highlight
                        ? "text-emerald-600 hover:bg-emerald-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/70"
                  }`}>
                    {link.highlight && (
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

            <Link href="/appointments">
              <span className="ml-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-[13px] font-semibold rounded-xl shadow-sm shadow-sky-300/40 cursor-pointer transition-colors">
                Book Now
              </span>
            </Link>
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
                        : link.highlight
                          ? "text-emerald-600 bg-emerald-50/60"
                          : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.highlight && <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2.5" />}
                    {link.label}
                  </span>
                </Link>
              );
            })}
            <Link href="/appointments">
              <span
                className="mt-2 flex items-center justify-center px-4 py-3 bg-sky-600 text-white text-sm font-semibold rounded-xl cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Book Appointment
              </span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
