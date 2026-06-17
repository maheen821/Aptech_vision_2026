import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Edit2,
  CheckCircle2,
  User,
  Mail,
  Phone,
  Calendar,
  Heart,
  Droplets,
  Ruler,
  Weight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import AccountLayout from "./layout";
import { useAuth } from "@/context/AuthContext";

export default function AccountProfile() {
  const { toast } = useToast();
  const { user } = useAuth();

  const [editing, setEditing] = useState(false);

  if (!user) return null;

  const [age, setAge] = useState("35 years");
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [height, setHeight] = useState("165 cm");
  const [weight, setWeight] = useState("62 kg");
  const [allergies, setAllergies] = useState("Dust Allergy");
  const [history, setHistory] = useState(
    "No major surgeries. Mild seasonal allergies."
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    setEditing(false);

    toast({
      title: "Profile Updated ✨",
      description: "Your health profile was saved successfully.",
    });
  };

  const initials = user.fullName
    ?.split(" ")
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <AccountLayout>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-6"
      >
        {/* TOP HERO CARD */}
        <div className="relative overflow-hidden rounded-[32px] border border-sky-100 bg-gradient-to-br from-sky-500 via-cyan-500 to-emerald-500 p-8 shadow-2xl shadow-sky-100">

          {/* glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/20 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            {/* LEFT */}
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-28 h-28 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white text-4xl font-black shadow-xl">
                  {initials}
                </div>

                <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-2xl bg-white text-sky-600 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>

              <div>
                <p className="text-white/80 text-sm font-medium">
                  CareConnect Member
                </p>

                <h1 className="text-3xl font-black text-white mt-1">
                  {user.fullName}
                </h1>

                <div className="flex flex-wrap gap-2 mt-4">

                  <div className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-semibold">
                    Premium Profile
                  </div>

                  <div className="px-3 py-1.5 rounded-full bg-emerald-400/20 backdrop-blur-md border border-white/20 text-white text-xs font-semibold">
                    Active Member
                  </div>

                </div>
              </div>
            </div>

            {/* RIGHT */}
            <Button
              onClick={() => setEditing(!editing)}
              className={`rounded-2xl px-6 h-12 text-sm font-bold shadow-lg transition-all ${
                editing
                  ? "bg-white text-sky-700 hover:bg-sky-50"
                  : "bg-white/15 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white"
              }`}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {editing ? "Cancel Editing" : "Edit Profile"}
            </Button>
          </div>
        </div>

        {/* MAIN CARD */}
        <form onSubmit={handleSave}>
          <div className="bg-white border border-gray-100 rounded-[32px] shadow-sm overflow-hidden">

            {/* SECTION HEADER */}
            <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-sky-600" />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-gray-900">
                    Health Profile
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Manage your personal & medical information
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8">

              {/* BASIC INFO */}
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-gray-400 mb-5">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* FULL NAME */}
                  <InfoInput
                    icon={User}
                    label="Full Name"
                    value={user.fullName}
                    disabled
                  />

                  {/* EMAIL */}
                  <InfoInput
                    icon={Mail}
                    label="Email Address"
                    value={user.email}
                    disabled
                  />

                  {/* PHONE */}
                  <InfoInput
                    icon={Phone}
                    label="Phone Number"
                    value={user.phone}
                    disabled
                  />

                  {/* DOB */}
                  <InfoInput
                    icon={Calendar}
                    label="Date of Birth"
                    type="date"
                    disabled={!editing}
                  />
                </div>
              </div>

              {/* HEALTH STATS */}
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-gray-400 mb-5">
                  Health Statistics
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

                  <HealthCard
                    icon={Heart}
                    color="from-rose-500 to-pink-600"
                    title="Age"
                    value={age}
                    editing={editing}
                    onChange={setAge}
                  />

                  <HealthCard
                    icon={Droplets}
                    color="from-red-500 to-rose-600"
                    title="Blood Group"
                    value={bloodGroup}
                    editing={editing}
                    onChange={setBloodGroup}
                  />

                  <HealthCard
                    icon={Ruler}
                    color="from-sky-500 to-cyan-600"
                    title="Height"
                    value={height}
                    editing={editing}
                    onChange={setHeight}
                  />

                  <HealthCard
                    icon={Weight}
                    color="from-emerald-500 to-green-600"
                    title="Weight"
                    value={weight}
                    editing={editing}
                    onChange={setWeight}
                  />
                </div>
              </div>

              {/* MEDICAL DETAILS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* ALLERGIES */}
                <div className="rounded-3xl border border-amber-100 bg-amber-50/50 p-6">
                  <Label className="text-xs font-black uppercase tracking-widest text-amber-600">
                    Known Allergies
                  </Label>

                  {editing ? (
                    <Input
                      value={allergies}
                      onChange={(e) => setAllergies(e.target.value)}
                      className="mt-3 h-12 rounded-2xl border-amber-200 bg-white"
                    />
                  ) : (
                    <div className="mt-3 p-4 rounded-2xl bg-white border border-amber-100 text-gray-700 font-semibold">
                      {allergies}
                    </div>
                  )}
                </div>

                {/* HISTORY */}
                <div className="rounded-3xl border border-sky-100 bg-sky-50/50 p-6">
                  <Label className="text-xs font-black uppercase tracking-widest text-sky-600">
                    Medical History
                  </Label>

                  {editing ? (
                    <textarea
                      rows={4}
                      value={history}
                      onChange={(e) => setHistory(e.target.value)}
                      className="w-full mt-3 rounded-2xl border border-sky-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-300 resize-none"
                    />
                  ) : (
                    <div className="mt-3 p-4 rounded-2xl bg-white border border-sky-100 text-gray-700 leading-relaxed">
                      {history}
                    </div>
                  )}
                </div>
              </div>

              {/* SAVE BUTTON */}
              {editing && (
                <div className="flex justify-end pt-2">
                  <Button className="h-12 px-8 rounded-2xl bg-gradient-to-r from-sky-600 to-emerald-500 hover:from-sky-700 hover:to-emerald-600 text-white font-bold shadow-xl shadow-sky-100">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </div>
        </form>
      </motion.div>
    </AccountLayout>
  );
}

/* INFO INPUT */
function InfoInput({
  icon: Icon,
  label,
  value,
  type = "text",
  disabled,
}: any) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-black uppercase tracking-wider text-gray-400">
        {label}
      </Label>

      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-500" />

        <Input
          type={type}
          defaultValue={value}
          disabled={disabled}
          className={`h-12 rounded-2xl pl-11 border-gray-200 ${
            disabled
              ? "bg-gray-50 text-gray-600"
              : "bg-white"
          }`}
        />
      </div>
    </div>
  );
}

/* HEALTH CARD */
function HealthCard({
  icon: Icon,
  color,
  title,
  value,
  editing,
  onChange,
}: any) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-xl transition-all"
    >
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg`}>
        <Icon className="w-5 h-5" />
      </div>

      <p className="text-xs font-black uppercase tracking-widest text-gray-400 mt-5">
        {title}
      </p>

      {editing ? (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-3 rounded-2xl"
        />
      ) : (
        <h3 className="text-2xl font-black text-gray-900 mt-2">
          {value}
        </h3>
      )}

      <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-gray-50" />
    </motion.div>
  );
}