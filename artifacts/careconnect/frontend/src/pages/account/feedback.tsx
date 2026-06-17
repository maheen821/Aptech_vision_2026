import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Star, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useListAppointments, getListAppointmentsQueryKey } from "@workspace/api-client-react";
import AccountLayout from "./layout";

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
          <Star className={`w-8 h-8 transition-colors ${n <= (hovered || value) ? "text-amber-400 fill-current" : "text-gray-200 fill-current"}`} />
        </button>
      ))}
    </div>
  );
}

export default function AccountFeedback() {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

 const { data, isLoading } = useListAppointments({
  query: { queryKey: getListAppointmentsQueryKey() },
});

const appointments = Array.isArray(data)
  ? data
  : (data as { appointments?: any[]; data?: any[] } | undefined)?.appointments ?? (data as { appointments?: any[]; data?: any[] } | undefined)?.data ?? [];

  const handleFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) { toast({ title: "Please select a rating", variant: "destructive" }); return; }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setRating(0);
      setReview("");
      toast({ title: "Thank you!", description: "Your feedback has been submitted successfully." });
      setTimeout(() => setSubmitted(false), 3000);
    }, 1200);
  };

  return (
    <AccountLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <div className="glass-card p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Leave Feedback</h2>
          <p className="text-gray-500 text-sm mb-8">Help others by sharing your CareConnect experience.</p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 py-12 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <Star className="w-8 h-8 text-emerald-500 fill-current" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Feedback Received!</h3>
                <p className="text-gray-500 text-sm mt-1">Thank you for helping us improve.</p>
              </div>
            </motion.div>
          ) : (
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
          )}
        </div>
      </motion.div>
    </AccountLayout>
  );
}
