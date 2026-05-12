import { Link } from "wouter";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-white/50 backdrop-blur-md border-t border-white/40 pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-16">
          <div className="col-span-1 md:col-span-1 lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-emerald-500">
                🏥 CareConnect
              </span>
            </Link>
            <p className="text-gray-500 max-w-sm">
              Smart Healthcare Assistant for everyone. We bring clinical confidence blended with approachable warmth to your healthcare journey.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 font-serif">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-gray-500 hover:text-sky-600 transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-gray-500 hover:text-sky-600 transition-colors">About</Link></li>
              <li><Link href="/services" className="text-gray-500 hover:text-sky-600 transition-colors">Services</Link></li>
              <li><Link href="/doctors" className="text-gray-500 hover:text-sky-600 transition-colors">Doctors</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 font-serif">Contact</h4>
            <ul className="space-y-3 text-gray-500">
              <li>1-800-CARE-NOW</li>
              <li>hello@careconnect.app</li>
              <li>123 Healing Way<br/>San Francisco, CA 94105</li>
            </ul>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-sky-600 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-sky-600 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-sky-600 transition-colors">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-400 text-sm">
            © 2026 CareConnect. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0 text-sm text-gray-400">
            <a href="#" className="hover:text-gray-600">Privacy Policy</a>
            <a href="#" className="hover:text-gray-600">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
