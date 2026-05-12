import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useListDoctors, getListDoctorsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "wouter";
import { Star, Loader2, Sparkles } from "lucide-react";

const commonSymptoms = ["Fever", "Headache", "Skin rash", "Cough", "Stomach pain", "Fatigue", "Dizziness", "Nausea"];

export default function Symptom() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const { data: doctors } = useListDoctors({ specialty: result || undefined }, { 
    query: { 
      queryKey: getListDoctorsQueryKey({ specialty: result || undefined }),
      enabled: !!result
    } 
  });

  const handleAnalyze = () => {
    setAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      setAnalyzing(false);
      // Mock logic to determine specialty
      if (selectedSymptoms.includes("Skin rash")) setResult("Dermatology");
      else if (selectedSymptoms.includes("Stomach pain") || selectedSymptoms.includes("Nausea")) setResult("General Medicine");
      else if (selectedSymptoms.includes("Cough")) setResult("Pulmonology");
      else if (selectedSymptoms.includes("Dizziness")) setResult("Neurology");
      else setResult("General Medicine");
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center w-full pb-20 pt-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100 text-sky-700 text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" /> AI-Powered Analysis
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">Symptom Checker</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Tell us how you're feeling, and our intelligent system will recommend the right specialist for you.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-8">
            <div className="glass-card p-6 md:p-8 space-y-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 font-serif">1. Select your symptoms</h3>
                <div className="flex flex-wrap gap-3">
                  {commonSymptoms.map(sym => (
                    <label key={sym} className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full cursor-pointer hover:bg-sky-50 hover:border-sky-200 transition-all has-[:checked]:bg-sky-100 has-[:checked]:border-sky-300 has-[:checked]:shadow-sm">
                      <Checkbox 
                        checked={selectedSymptoms.includes(sym)}
                        onCheckedChange={(c) => {
                          if (c) setSelectedSymptoms([...selectedSymptoms, sym]);
                          else setSelectedSymptoms(selectedSymptoms.filter(s => s !== sym));
                        }}
                      />
                      <span className="text-sm font-medium text-gray-700">{sym}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 font-serif">2. Describe how you feel</h3>
                <Textarea 
                  placeholder="E.g., I've had a headache for 3 days and feel slightly dizzy when I stand up..." 
                  className="bg-white/80 min-h-[140px] resize-none focus-visible:ring-sky-500"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <Button 
                className="w-full bg-sky-600 hover:bg-sky-700 text-lg h-14 shadow-lg shadow-sky-200 rounded-xl"
                onClick={handleAnalyze}
                disabled={analyzing || (selectedSymptoms.length === 0 && description.trim().length === 0)}
              >
                {analyzing ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing Symptoms...</> : "Analyze Symptoms"}
              </Button>
            </div>
          </div>

          <div className="h-full">
            <AnimatePresence mode="wait">
              {analyzing ? (
                <motion.div 
                  key="analyzing"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="glass-card p-12 h-full min-h-[400px] flex flex-col items-center justify-center text-center space-y-6"
                >
                  <div className="relative">
                    <div className="absolute inset-0 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin"></div>
                    <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-sky-500 animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900">Analyzing your symptoms</h3>
                    <p className="text-gray-500">Finding the best medical match for your condition...</p>
                  </div>
                </motion.div>
              ) : result ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-6 md:p-8 h-full space-y-8"
                >
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 text-center border border-emerald-100 shadow-sm relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-200/50 rounded-full blur-xl"></div>
                    <div className="relative z-10">
                      <p className="text-emerald-800 font-medium mb-2 uppercase tracking-wider text-sm">Recommended Specialty</p>
                      <h2 className="text-4xl font-serif font-bold text-emerald-700">{result}</h2>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900 font-serif">Available Specialists</h3>
                      <Link href={`/doctors?specialty=${result}`}>
                        <Button variant="link" className="text-sky-600 p-0 h-auto">View All</Button>
                      </Link>
                    </div>
                    
                    <div className="space-y-4">
                      {doctors?.slice(0, 3).map(doc => (
                        <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-white/60 rounded-xl hover:bg-white transition-colors border border-gray-100 shadow-sm">
                          <div className="flex items-center gap-4 flex-1">
                            <img src={doc.imageUrl} alt={doc.name} className="w-14 h-14 rounded-full object-cover shadow-sm" />
                            <div>
                              <h4 className="font-bold text-gray-900">{doc.name}</h4>
                              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <span className="flex items-center text-yellow-500 font-medium"><Star className="w-3.5 h-3.5 fill-current mr-1"/> {doc.rating}</span>
                                <span>•</span>
                                <span className="font-medium text-emerald-600">${doc.fee}</span>
                              </div>
                            </div>
                          </div>
                          <Link href={`/doctors?specialty=${result}`}>
                            <Button size="sm" className="w-full sm:w-auto bg-sky-50 text-sky-700 hover:bg-sky-100">Book Visit</Button>
                          </Link>
                        </div>
                      ))}
                      {(!doctors || doctors.length === 0) && (
                        <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                          <p className="text-gray-500">No specialists available right now.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="glass-card p-12 h-full min-h-[400px] flex flex-col items-center justify-center text-center space-y-6 bg-gradient-to-br from-gray-50/50 to-sky-50/20"
                >
                  <div className="w-24 h-24 bg-white shadow-sm rounded-full flex items-center justify-center text-4xl mb-2">🩺</div>
                  <h3 className="text-2xl font-serif font-bold text-gray-900">Awaiting Information</h3>
                  <p className="text-gray-500 max-w-sm leading-relaxed">Select your symptoms or describe how you feel to get a personalized specialty recommendation.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
