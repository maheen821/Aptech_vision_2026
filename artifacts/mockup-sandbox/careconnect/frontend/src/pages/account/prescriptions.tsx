import { motion } from "framer-motion";
import {
  Clock, Stethoscope, FileText, Pill, Download, CheckCircle2, AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AccountLayout from "./layout";

const PRESCRIPTIONS = [
  {
    id: 1,
    doctor: "Dr. Sarah Mitchell",
    specialty: "General Physician",
    date: "2025-04-20",
    diagnosis: "Seasonal Allergic Rhinitis",
    avatar: "SM",
    avatarColor: "from-sky-500 to-sky-700",
    status: "active",
    notes: "Patient presented with runny nose, sneezing, and itchy eyes. Advised to avoid outdoor exposure during high pollen season. Increase fluid intake and rest. Follow-up in 2 weeks if symptoms persist.",
    medicines: [
      { name: "Cetirizine 10mg",           dose: "1 tablet",           frequency: "Once daily (morning)",        duration: "14 days",   type: "Antihistamine"       },
      { name: "Fluticasone Nasal Spray",   dose: "2 sprays per nostril", frequency: "Once daily",                duration: "14 days",   type: "Corticosteroid"      },
    ],
    refills: 1,
  },
  {
    id: 2,
    doctor: "Dr. James Patel",
    specialty: "Cardiologist",
    date: "2025-03-05",
    diagnosis: "Mild Hypertension (Stage 1)",
    avatar: "JP",
    avatarColor: "from-rose-500 to-pink-700",
    status: "active",
    notes: "Blood pressure recorded at 142/90 mmHg. Recommend lifestyle changes including low-sodium diet, regular walking 30 min/day, stress reduction. Avoid caffeine. Return for BP check in 1 month.",
    medicines: [
      { name: "Amlodipine 5mg",   dose: "1 tablet", frequency: "Once daily (evening)",     duration: "30 days", type: "Calcium Channel Blocker" },
      { name: "Aspirin 81mg",     dose: "1 tablet", frequency: "Once daily with food",      duration: "30 days", type: "Antiplatelet"            },
    ],
    refills: 2,
  },
  {
    id: 3,
    doctor: "Dr. Emily Chen",
    specialty: "Dermatologist",
    date: "2025-01-18",
    diagnosis: "Mild Eczema (Atopic Dermatitis)",
    avatar: "EC",
    avatarColor: "from-violet-500 to-purple-700",
    status: "completed",
    notes: "Skin examination showed dry, inflamed patches on forearms and neck. Avoid harsh soaps and hot water. Use fragrance-free moisturizer immediately after bathing. Wear cotton clothing.",
    medicines: [
      { name: "Hydrocortisone Cream 1%",     dose: "Thin layer",      frequency: "Twice daily on affected areas", duration: "7 days",    type: "Topical Steroid" },
      { name: "Cerave Moisturizing Cream",   dose: "Apply liberally", frequency: "3-4 times daily",               duration: "Ongoing",   type: "Emollient"       },
    ],
    refills: 0,
  },
];

export default function AccountPrescriptions() {
  const { toast } = useToast();

  return (
    <AccountLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">My Prescriptions</h2>
              <p className="text-gray-500 text-sm mt-0.5">Doctor prescriptions, medicines & clinical notes</p>
            </div>
            <span className="bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold px-3 py-1.5 rounded-full">
              {PRESCRIPTIONS.length} Records
            </span>
          </div>

          {PRESCRIPTIONS.map((rx, i) => (
            <motion.div
              key={rx.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/60">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${rx.avatarColor} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                    {rx.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{rx.doctor}</p>
                    <p className="text-xs text-gray-500">{rx.specialty}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-gray-400 font-medium flex items-center gap-1 justify-end">
                      <Clock className="w-3 h-3" /> {rx.date}
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
                    rx.status === "active"
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                      : "bg-gray-100 text-gray-500 border border-gray-200"
                  }`}>
                    {rx.status === "active" ? "✓ Active" : "Completed"}
                  </span>
                  <button
                    onClick={() => toast({ title: "Downloading prescription PDF..." })}
                    className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-100 flex items-center justify-center transition-colors"
                    title="Download PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div className="flex items-center gap-3 p-3 bg-sky-50 rounded-2xl border border-sky-100">
                  <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
                    <Stethoscope className="w-4 h-4 text-sky-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-sky-500">Diagnosis</p>
                    <p className="font-bold text-gray-900 text-sm">{rx.diagnosis}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> Doctor's Notes
                  </p>
                  <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-4">
                    <p className="text-sm text-gray-700 leading-relaxed italic">"{rx.notes}"</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5" /> Prescribed Medicines
                  </p>
                  <div className="space-y-2.5">
                    {rx.medicines.map((med, j) => (
                      <div key={j} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl hover:border-sky-200 transition-colors">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center shrink-0">
                            <Pill className="w-4 h-4 text-sky-700" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 text-sm">{med.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{med.type}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
                          <span className="flex items-center gap-1 bg-sky-50 text-sky-700 border border-sky-100 px-2.5 py-1 rounded-full font-semibold whitespace-nowrap">
                            💊 {med.dose}
                          </span>
                          <span className="flex items-center gap-1 bg-violet-50 text-violet-700 border border-violet-100 px-2.5 py-1 rounded-full font-semibold whitespace-nowrap">
                            🔄 {med.frequency}
                          </span>
                          <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-full font-semibold whitespace-nowrap">
                            📅 {med.duration}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {rx.status === "active" && (
                  <div className={`flex items-center gap-2 p-3 rounded-xl text-xs font-semibold ${
                    rx.refills > 0
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-gray-50 text-gray-500 border border-gray-100"
                  }`}>
                    {rx.refills > 0
                      ? <><CheckCircle2 className="w-4 h-4" /> {rx.refills} refill{rx.refills !== 1 ? "s" : ""} remaining</>
                      : <><AlertCircle className="w-4 h-4" /> No refills remaining — contact your doctor</>
                    }
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AccountLayout>
  );
}
