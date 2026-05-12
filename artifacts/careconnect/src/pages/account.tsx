import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  User, Settings, Heart, Calendar, Star, LogOut,
  Edit2, Shield, Bell, Camera, ChevronRight, CheckCircle2, Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useListAppointments, getListAppointmentsQueryKey } from "@workspace/api-client-react";
import { motion as m } from "framer-motion";

const TABS = [
  { id: "profile", label: "Health Profile", icon: Heart },
  { id: "appointments", label: "Appointment History", icon: Calendar },
  { id: "feedback", label: "Feedback", icon: Star },
  { id: "settings", label: "Settings", icon: Settings },
];

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`w-8 h-8 transition-colors ${n <= (hovered || value) ? "text-amber-400 fill-current" : "text-gray-200 fill-current"}`}
          />
        </button>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
  };
  return (
    <Badge variant="outline" className={`capitalize text-xs font-semibold px-2.5 py-0.5 ${map[status] ?? ""}`}>
      {status}
    </Badge>
  );
}

export default function Account() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notifications, setNotifications] = useState({ appointments: true, promotions: false, updates: true });

  const { data: appointments, isLoading: aptsLoading } = useListAppointments({
    query: { queryKey: getListAppointmentsQueryKey() },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setEditing(false);
    toast({ title: "Profile saved", description: "Your health profile has been updated." });
  };

  const handleFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) { toast({ title: "Please select a rating", variant: "destructive" }); return; }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setRating(0);
      setReview("");
      toast({ title: "Thank you!", description: "Your feedback has been submitted successfully." });
    }, 1200);
  };

  return (
    <div className="w-full pb-24 pt-10 px-4">
      <div className="container mx-auto max-w-6xl flex flex-col lg:flex-row gap-8">

        {/* ── SIDEBAR ── */}
        <div className="w-full lg:w-72 shrink-0 space-y-5">
          {/* Avatar Card */}
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
            <h2 className="text-xl font-bold text-gray-900 mt-1">Jane Smith</h2>
            <p className="text-xs font-semibold text-sky-600 bg-sky-50 px-3 py-1 rounded-full mt-1.5">Premium Patient</p>
            <p className="text-xs text-gray-400 mt-2">Member since Jan 2025</p>
          </div>

          {/* Nav */}
          <nav className="glass-card p-3 space-y-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === id
                    ? "bg-sky-600 text-white shadow-md shadow-sky-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                {activeTab !== id && <ChevronRight className="w-4 h-4 ml-auto text-gray-300" />}
              </button>
            ))}
            <div className="pt-2 mt-2 border-t border-gray-100">
              <button
                onClick={() => toast({ title: "Signed out", description: "You have been logged out." })}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </nav>
        </div>

        {/* ── CONTENT ── */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >

              {/* ── HEALTH PROFILE ── */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  {/* Profile header card */}
                  <div className="glass-card p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Health Profile</h2>
                        <p className="text-gray-500 text-sm mt-0.5">Your personal medical information</p>
                      </div>
                      <Button
                        onClick={() => setEditing(!editing)}
                        variant={editing ? "default" : "outline"}
                        className="gap-2 rounded-xl"
                      >
                        <Edit2 className="w-4 h-4" /> {editing ? "Cancel" : "Edit Profile"}
                      </Button>
                    </div>

                    <form onSubmit={handleSave}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {[
                          { label: "Full Name", value: "Jane Smith", type: "text" },
                          { label: "Date of Birth", value: "1990-05-15", type: "date" },
                          { label: "Phone Number", value: "(555) 123-4567", type: "tel" },
                          { label: "Email Address", value: "jane.smith@example.com", type: "email" },
                        ].map(({ label, value, type }) => (
                          <div key={label} className="space-y-1.5">
                            <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</Label>
                            <Input type={type} defaultValue={value} disabled={!editing} className={`h-11 ${editing ? "bg-white" : "bg-gray-50 text-gray-600"}`} />
                          </div>
                        ))}
                      </div>

                      {/* Medical info */}
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { label: "Age", value: "35 years" },
                          { label: "Blood Group", value: "O+" },
                          { label: "Height / Weight", value: "165 cm / 62 kg" },
                        ].map(({ label, value }) => (
                          <div key={label} className={`p-4 rounded-2xl border text-center ${editing ? "border-sky-200 bg-sky-50/50" : "border-gray-100 bg-gray-50/60"}`}>
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">{label}</p>
                            <p className="font-bold text-gray-900">{value}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-5 space-y-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Known Allergies</Label>
                          <Input defaultValue="Penicillin, Pollen" disabled={!editing} className={`h-11 ${editing ? "bg-white" : "bg-gray-50 text-gray-600"}`} />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Medical History</Label>
                          <textarea
                            defaultValue="Mild asthma (2018). Appendectomy (2020). No current chronic conditions."
                            disabled={!editing}
                            rows={3}
                            className={`w-full rounded-xl border px-3 py-2.5 text-sm resize-none outline-none focus:ring-2 focus:ring-sky-300 transition ${editing ? "bg-white border-gray-200" : "bg-gray-50 border-gray-100 text-gray-600"}`}
                          />
                        </div>
                      </div>

                      {editing && (
                        <div className="mt-6 flex justify-end">
                          <Button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl px-8 gap-2">
                            <CheckCircle2 className="w-4 h-4" /> Save Changes
                          </Button>
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              )}

              {/* ── APPOINTMENT HISTORY ── */}
              {activeTab === "appointments" && (
                <div className="glass-card p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Appointment History</h2>
                  <p className="text-gray-500 text-sm mb-6">All your past and upcoming medical visits.</p>

                  {aptsLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => <div key={i} className="h-20 rounded-2xl bg-gray-100 animate-pulse" />)}
                    </div>
                  ) : !appointments?.length ? (
                    <div className="text-center py-16 text-gray-400">
                      <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="font-medium">No appointments found.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {appointments.map((apt) => (
                        <div key={apt.id} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all">
                          <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
                            <Calendar className="w-5 h-5 text-sky-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 text-sm truncate">{apt.doctorName}</p>
                            <p className="text-xs text-gray-500">{apt.specialty} · {apt.date} at {apt.time}</p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-sm font-bold text-gray-900">${apt.fee}</span>
                            <StatusBadge status={apt.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── FEEDBACK ── */}
              {activeTab === "feedback" && (
                <div className="glass-card p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Leave Feedback</h2>
                  <p className="text-gray-500 text-sm mb-8">Help others by sharing your CareConnect experience.</p>

                  <form onSubmit={handleFeedback} className="space-y-6 max-w-xl">
                    <div>
                      <Label className="text-sm font-bold text-gray-700 block mb-3">Overall Rating</Label>
                      <StarPicker value={rating} onChange={setRating} />
                      {rating > 0 && (
                        <p className="text-sm text-amber-600 font-medium mt-2">
                          {["", "Poor", "Fair", "Good", "Very Good", "Excellent!"][rating]}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-sm font-bold text-gray-700">Select Doctor (optional)</Label>
                      <select className="w-full h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-sky-300">
                        <option value="">-- Choose a doctor --</option>
                        {appointments?.map(apt => (
                          <option key={apt.id} value={apt.doctorId}>{apt.doctorName}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-sm font-bold text-gray-700">Your Review</Label>
                      <textarea
                        rows={4}
                        placeholder="Share your experience with us..."
                        value={review}
                        onChange={e => setReview(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm resize-none outline-none focus:ring-2 focus:ring-sky-300 transition"
                      />
                    </div>

                    <Button type="submit" disabled={submitting} className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl px-8 gap-2">
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
                      Submit Feedback
                    </Button>
                  </form>
                </div>
              )}

              {/* ── SETTINGS ── */}
              {activeTab === "settings" && (
                <div className="space-y-5">
                  {/* Change Password */}
                  <div className="glass-card p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center"><Shield className="w-5 h-5 text-sky-600" /></div>
                      <div>
                        <h3 className="font-bold text-gray-900">Change Password</h3>
                        <p className="text-xs text-gray-400">Keep your account secure</p>
                      </div>
                    </div>
                    <form onSubmit={e => { e.preventDefault(); toast({ title: "Password updated" }); }} className="space-y-4 max-w-md">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Current Password</Label>
                        <Input type="password" placeholder="••••••••" className="h-11" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">New Password</Label>
                        <Input type="password" placeholder="••••••••" className="h-11" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Confirm New Password</Label>
                        <Input type="password" placeholder="••••••••" className="h-11" />
                      </div>
                      <Button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl gap-2">
                        <Shield className="w-4 h-4" /> Update Password
                      </Button>
                    </form>
                  </div>

                  {/* Update Email */}
                  <div className="glass-card p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center"><User className="w-5 h-5 text-emerald-600" /></div>
                      <div>
                        <h3 className="font-bold text-gray-900">Update Email</h3>
                        <p className="text-xs text-gray-400">Change your login email address</p>
                      </div>
                    </div>
                    <form onSubmit={e => { e.preventDefault(); toast({ title: "Email updated" }); }} className="space-y-4 max-w-md">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">New Email</Label>
                        <Input type="email" defaultValue="jane.smith@example.com" className="h-11" />
                      </div>
                      <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Save Email
                      </Button>
                    </form>
                  </div>

                  {/* Notifications */}
                  <div className="glass-card p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><Bell className="w-5 h-5 text-amber-600" /></div>
                      <div>
                        <h3 className="font-bold text-gray-900">Notification Preferences</h3>
                        <p className="text-xs text-gray-400">Choose what alerts you receive</p>
                      </div>
                    </div>
                    <div className="space-y-4 max-w-md">
                      {[
                        { key: "appointments", label: "Appointment Reminders", desc: "Get notified before your visits" },
                        { key: "promotions", label: "Promotions & Offers", desc: "Deals and special health packages" },
                        { key: "updates", label: "Platform Updates", desc: "New features and announcements" },
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

                  {/* Logout */}
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
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
