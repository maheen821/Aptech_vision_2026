import { useAuth } from "@/context/AuthContext";
import { Link } from "wouter";
import { Lock } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="p-6 bg-amber-50 rounded-full mb-4">
          <Lock className="w-12 h-12 text-amber-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-6">Please login or register to view this page.</p>
        <div className="flex gap-4">
          <Link href="/login" className="px-6 py-2 bg-sky-600 text-white rounded-lg">Login</Link>
          <Link href="/register" className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg">Register</Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}