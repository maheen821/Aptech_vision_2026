import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/symptom", label: "⭐ Symptom Checker", highlight: true },
    { href: "/doctors", label: "Doctors" },
    { href: "/appointments", label: "Appointments" },
    { href: "/account", label: "Account" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-white/30 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <span className="text-2xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-emerald-500">
              🏥 CareConnect
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <div className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                  location === link.href 
                    ? "bg-sky-100 text-sky-700" 
                    : link.highlight 
                      ? "text-emerald-600 hover:bg-emerald-50" 
                      : "text-gray-600 hover:bg-gray-100/50 hover:text-sky-600"
                }`}>
                  {link.label}
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-gray-100 p-4 absolute top-20 left-0 w-full shadow-lg">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <div 
                  className={`block px-4 py-3 rounded-2xl text-base font-medium ${
                    location === link.href 
                      ? "bg-sky-100 text-sky-700" 
                      : link.highlight 
                        ? "text-emerald-600 bg-emerald-50/50" 
                        : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
