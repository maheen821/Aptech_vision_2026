import { Link } from "wouter";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Mail, Phone, MapPin, Heart, ArrowRight, Stethoscope } from "lucide-react";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/doctors", label: "Find Doctors" },
];

const supportLinks = [
  { href: "/symptom", label: "Symptom Checker" },
  { href: "/appointments", label: "Book Appointment" },
  { href: "/account", label: "My Account" },
];

const socialLinks = [
  { icon: FaFacebook, href: "#", label: "Facebook", color: "hover:bg-blue-600" },
  { icon: FaInstagram, href: "#", label: "Instagram", color: "hover:bg-pink-600" },
  { icon: FaLinkedin, href: "#", label: "LinkedIn", color: "hover:bg-sky-700" },
  { icon: FaTwitter, href: "#", label: "Twitter", color: "hover:bg-sky-500" },
];

export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden">
      {/* Top wave divider */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-emerald-400 to-sky-600" />

      {/* Main footer body */}
      <div className="bg-gradient-to-br from-gray-950 via-slate-900 to-gray-900 text-white pt-16 pb-0">
        <div className="container mx-auto px-4 md:px-8">

          {/* Top section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-14 border-b border-white/10">

            {/* Brand column */}
            <div className="lg:col-span-1">
              <Link href="/" className="inline-flex items-center gap-2 mb-5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-sky-500/30">
                  <Stethoscope className="w-5 h-5 text-white" strokeWidth={2.2} />
                </div>
                <span className="text-2xl font-black tracking-tight">
                  <span className="text-sky-400">Care</span><span className="text-emerald-400">Connect</span>
                </span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Smart Healthcare Assistant for everyone. Connecting you with the best doctors, faster and smarter.
              </p>

              {/* Social icons */}
              <div className="flex gap-3">
                {socialLinks.map(({ icon: Icon, href, label, color }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className={`w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 ${color}`}
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-widest text-sky-400 mb-5">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href}>
                      <span className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2 group cursor-pointer">
                        <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-sky-400" />
                        {label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-widest text-sky-400 mb-5">Patient Care</h4>
              <ul className="space-y-3">
                {supportLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href}>
                      <span className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2 group cursor-pointer">
                        <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-sky-400" />
                        {label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-widest text-sky-400 mb-5">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4 text-sky-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Phone</p>
                    <p className="text-gray-300 text-sm font-medium">1-800-CARE-NOW</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4 text-sky-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Email</p>
                    <p className="text-gray-300 text-sm font-medium">hello@careconnect.app</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-sky-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Address</p>
                    <p className="text-gray-300 text-sm font-medium">123 Healing Way<br />San Francisco, CA 94105</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm flex items-center gap-1.5">
              © 2026 CareConnect. All rights reserved. Made with
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-current" />
              for better health.
            </p>
            <div className="flex items-center gap-6 text-xs text-gray-600">
              <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-gray-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
