import { Link } from "wouter";
import { Phone } from "lucide-react";

export function EmergencyFAB() {
  return (
    <Link href="/emergency">
      <div className="fixed bottom-6 right-6 z-[80] flex flex-col items-center gap-1.5 cursor-pointer group">
        {/* Outer pulsing rings */}
        <div className="relative">
          <span className="absolute inset-0 rounded-full bg-red-500 opacity-25 animate-ping" style={{ animationDuration: "1.4s" }} />
          <span className="absolute inset-0 m-[-6px] rounded-full bg-red-400 opacity-15 animate-ping" style={{ animationDuration: "1.4s", animationDelay: "0.3s" }} />

          {/* Button */}
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-2xl shadow-red-500/50 group-hover:scale-110 group-hover:shadow-red-500/70 transition-all duration-200 border-4 border-white">
            <Phone className="w-7 h-7 text-white" strokeWidth={2.2} />
          </div>
        </div>

        {/* Label */}
        <div className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md whitespace-nowrap tracking-wide">
          Emergency Call
        </div>
      </div>
    </Link>
  );
}
