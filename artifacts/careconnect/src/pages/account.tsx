import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Settings, Heart, Bell, Shield, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Account() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Profile updated", description: "Your changes have been saved successfully." });
  };

  return (
    <div className="flex flex-col items-center w-full pb-20 pt-10 px-4">
      <div className="container mx-auto max-w-5xl flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-72 shrink-0 space-y-6">
          <div className="glass-card p-8 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-28 h-28 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-full flex items-center justify-center text-white text-4xl font-serif font-bold shadow-inner border-4 border-white">
                JS
              </div>
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-1">Jane Smith</h2>
            <p className="text-sm font-medium text-sky-600 bg-sky-50 px-3 py-1 rounded-full">Premium Patient</p>
          </div>

          <nav className="glass-card overflow-hidden flex flex-col p-3 space-y-1">
            {[
              { id: "profile", label: "Personal Profile", icon: <User className="w-5 h-5" /> },
              { id: "preferences", label: "Preferences", icon: <Settings className="w-5 h-5" /> },
              { id: "saved", label: "Saved Doctors", icon: <Heart className="w-5 h-5" /> },
              { id: "notifications", label: "Notifications", icon: <Bell className="w-5 h-5" /> },
              { id: "security", label: "Security & Privacy", icon: <Shield className="w-5 h-5" /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id 
                    ? "bg-sky-50 text-sky-700 shadow-sm border border-sky-100/50" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className={`${activeTab === tab.id ? "text-sky-500" : "text-gray-400"}`}>
                  {tab.icon}
                </div>
                {tab.label}
              </button>
            ))}
            
            <div className="pt-4 mt-4 border-t border-gray-100">
              <button className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-all">
                <LogOut className="w-5 h-5 text-red-400" />
                Sign Out
              </button>
            </div>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 glass-card p-6 md:p-12 min-h-[600px]">
          {activeTab === "profile" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Personal Information</h2>
                <p className="text-gray-500 text-lg">Update your personal details and contact info.</p>
              </div>

              <form onSubmit={handleSave} className="space-y-8 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-semibold">First Name</Label>
                    <Input defaultValue="Jane" className="h-12 bg-white/70" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-semibold">Last Name</Label>
                    <Input defaultValue="Smith" className="h-12 bg-white/70" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold">Email Address</Label>
                  <Input type="email" defaultValue="jane.smith@example.com" className="h-12 bg-white/70" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-semibold">Phone Number</Label>
                    <Input type="tel" defaultValue="(555) 123-4567" className="h-12 bg-white/70" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-semibold">Date of Birth</Label>
                    <Input type="date" defaultValue="1990-05-15" className="h-12 bg-white/70" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold">Address</Label>
                  <Input defaultValue="123 Healing Way, Apt 4B" className="h-12 bg-white/70" />
                </div>

                <div className="pt-6 flex justify-end border-t border-gray-100">
                  <Button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl px-10 h-12 text-base shadow-md shadow-sky-200">
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          )}

          {activeTab !== "profile" && (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 space-y-4 animate-in fade-in duration-500">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                <Settings className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Under Construction</h3>
              <p className="max-w-xs">This section is currently being updated. Please check back later.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
