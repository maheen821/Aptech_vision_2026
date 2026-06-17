import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Shield, User, Bell, CheckCircle2, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AccountLayout from "./layout";

export default function AccountSettings() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    appointments: true,
    promotions: false,
    updates: true,
  });

  return (
    <AccountLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <div className="space-y-5">

          {/* ── Change Password ── */}
          <div className="glass-card p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
                <Shield className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Change Password</h3>
                <p className="text-xs text-gray-400">Keep your account secure</p>
              </div>
            </div>
            <form
              onSubmit={e => { e.preventDefault(); toast({ title: "Password updated successfully" }); }}
              className="space-y-4 max-w-md"
            >
              {[
                { label: "Current Password",    placeholder: "••••••••" },
                { label: "New Password",         placeholder: "••••••••" },
                { label: "Confirm New Password", placeholder: "••••••••" },
              ].map(({ label, placeholder }) => (
                <div key={label} className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</Label>
                  <Input type="password" placeholder={placeholder} className="h-11" />
                </div>
              ))}
              <Button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl gap-2">
                <Shield className="w-4 h-4" /> Update Password
              </Button>
            </form>
          </div>

          {/* ── Update Email ── */}
          <div className="glass-card p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <User className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Update Email</h3>
                <p className="text-xs text-gray-400">Change your login email address</p>
              </div>
            </div>
            <form
              onSubmit={e => { e.preventDefault(); toast({ title: "Email updated successfully" }); }}
              className="space-y-4 max-w-md"
            >
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">New Email</Label>
                <Input type="email" defaultValue="jane.smith@example.com" className="h-11" />
              </div>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2">
                <CheckCircle2 className="w-4 h-4" /> Save Email
              </Button>
            </form>
          </div>

          {/* ── Notification Preferences ── */}
          <div className="glass-card p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Bell className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Notification Preferences</h3>
                <p className="text-xs text-gray-400">Choose what alerts you receive</p>
              </div>
            </div>
            <div className="space-y-4 max-w-md">
              {[
                { key: "appointments", label: "Appointment Reminders", desc: "Get notified before your visits"       },
                { key: "promotions",   label: "Promotions & Offers",   desc: "Deals and special health packages"     },
                { key: "updates",      label: "Platform Updates",      desc: "New features and announcements"        },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                  </div>
                  <Switch
                    checked={notifications[key as keyof typeof notifications]}
                    onCheckedChange={v => setNotifications(n => ({ ...n, [key]: v }))}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ── Sign Out ── */}
          <div className="glass-card p-6 border-red-100">
            <h3 className="font-bold text-gray-900 mb-1">Sign Out</h3>
            <p className="text-sm text-gray-500 mb-4">You will be signed out from all devices.</p>
            <Button
              onClick={() => toast({ title: "Signed out", description: "See you next time!" })}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 rounded-xl gap-2"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          </div>

        </div>
      </motion.div>
    </AccountLayout>
  );
}
