import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Plus, Trash2, Pencil, Check, X, Loader2,
  RefreshCw, Search, Award, ChevronDown
} from "lucide-react";

/* ─── REAL MEDICAL ICONS IMPORTS FROM REACT-ICONS ─── */
import { 
  GiHeartOrgan, GiBrain, GiLungs, GiSkeleton, 
  GiStomach, GiBleedingEye, GiTooth, GiKidneys 
} from "react-icons/gi";

import { 
  FaEarListen, FaBabyCarriage, FaChild, FaSyringe, 
  FaFileMedical, FaDroplet, FaThermometer, FaHeartPulse,
  FaStethoscope
} from "react-icons/fa6";

// Backend API URLs
const API_BASE = "http://localhost:5000/api/specialties";
const API_CATEGORIES = "http://localhost:5000/api/categories";

/* ─── TYPES ─── */
interface Specialty {
  _id?: string;
  name: string;
  category: string; 
}

interface Category {
  _id?: string;
  id?: string;
  name: string;
  color: string;
  icon: string;
}

function getSpecialtyId(s: Specialty) {
  return s._id ?? "";
}

// Full Synchronized Icon Map for Dynamic Generation & Frontend Lookups
const iconMap: Record<string, any> = {
  // Gi Pack Icons
  giheartorgan: GiHeartOrgan,
  gibrain: GiBrain,
  gilungs: GiLungs,
  giskeleton: GiSkeleton,
  gistomach: GiStomach,
  gibleedingeye: GiBleedingEye,
  gitooth: GiTooth,
  gikidneys: GiKidneys,

  // Fa6 Pack Icons
  faearlisten: FaEarListen,
  fababycarriage: FaBabyCarriage,
  fachild: FaChild,
  fasyringe: FaSyringe,
  fafilemedical: FaFileMedical,
  fadroplet: FaDroplet,
  fathermometer: FaThermometer,
  faheartpulse: FaHeartPulse,
  fastethoscope: FaStethoscope
};

// Dynamic Icon Renderer Helper (With Case-Insensitive Matching)
const DynamicIcon = ({ 
  iconName, 
  className = "w-4 h-4", 
  style 
}: { 
  iconName: string; 
  className?: string; 
  style?: React.CSSProperties; 
}) => {
  // Database or backend strings match inside the dictionary, falls back to FaStethoscope if missing
  const IconComponent = iconMap[iconName.toLowerCase().trim()] || FaStethoscope;
  return <IconComponent className={className} style={style} />;
};

export default function AdminSpecialties() {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); 
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Form input states
  const [name, setName] = useState("");
  const [category, setCategory] = useState(""); 
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  
  // Inline editing states
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Custom Dropdowns open/close states & Refs for outside click
  const [addDropdownOpen, setAddDropdownOpen] = useState(false);
  const [inlineDropdownOpen, setInlineDropdownOpen] = useState(false);
  const addDropdownRef = useRef<HTMLDivElement>(null);
  const inlineDropdownRef = useRef<HTMLDivElement>(null);

  // Load Data from Backend
  const loadData = async () => {
    setLoading(true);
    try {
      const [specialtiesRes, categoriesRes] = await Promise.all([
        axios.get(API_BASE),
        axios.get(API_CATEGORIES)
      ]);

      setSpecialties(Array.isArray(specialtiesRes.data) ? specialtiesRes.data : specialtiesRes.data.data || []);
      
      const fetchedCats = Array.isArray(categoriesRes.data) ? categoriesRes.data : categoriesRes.data.data || [];
      setCategories(fetchedCats);
      
      if (fetchedCats.length > 0) {
        setCategory(fetchedCats[0].name);
      }
    } catch (err) { 
      console.error("Error loading component data:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    loadData();

    // Outside click to close dropdowns
    const handleClickOutside = (event: MouseEvent) => {
      if (addDropdownRef.current && !addDropdownRef.current.contains(event.target as Node)) {
        setAddDropdownOpen(false);
      }
      if (inlineDropdownRef.current && !inlineDropdownRef.current.contains(event.target as Node)) {
        setInlineDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Add Specialty (POST)
  const addSpecialty = async () => {
    if (!name.trim()) return alert("Please fill the specialty name");
    if (!category) return alert("Please select a category");
    
    setActionLoading(true);
    try {
      await axios.post(API_BASE, { name, category });
      setName(""); 
      if (categories.length > 0) setCategory(categories[0].name);
      setShowAdd(false);
      loadData();
    } catch (err: any) { 
      console.error(err);
      alert(err.response?.data?.message || "Duplicate or Invalid Entry");
    } finally { 
      setActionLoading(false); 
    }
  };

  // Delete Specialty (DELETE)
  const deleteSpecialty = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this specialty?")) return;
    setDeletingId(id);
    try {
      await axios.delete(`${API_BASE}/${id}`);
      loadData();
    } catch (err) { 
      console.error(err); 
    } finally { 
      setDeletingId(null); 
    }
  };

  // Trigger inline Edit
  const startEdit = (s: Specialty) => {
    setEditId(getSpecialtyId(s));
    setEditName(s.name);
    setEditCategory(s.category || (categories[0]?.name || ""));
    setInlineDropdownOpen(false);
  };

  // Save Inline Edit (PUT)
  const saveEdit = async () => {
    if (!editId || !editName.trim()) return;
    setActionLoading(true);
    try {
      await axios.put(`${API_BASE}/${editId}`, { name: editName, category: editCategory });
      setEditId(null);
      loadData();
    } catch (err) { 
      console.error(err); 
    } finally { 
      setActionLoading(false); 
    }
  };

  // Client-side search filters
  const filtered = specialties.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.category && s.category.toLowerCase().includes(search.toLowerCase()))
  );

  // Dynamic Badge Style Generator
 // Frontend component ke andar is function ko bas check kar lein:
const getDynamicBadgeStyle = (catName: string) => {
  const matchedCat = categories.find(c => c.name.toLowerCase() === (catName || "").toLowerCase());
  
  // Agar category database me mili aur usme hex color saved hai
  if (matchedCat && matchedCat.color) {
    return {
      backgroundColor: `${matchedCat.color}15`, // Hex string me 15 lagane se 8% opacity (transparent background) ban jati hai
      color: matchedCat.color,
      borderColor: `${matchedCat.color}30` // Border ko halka opacity mil jata hai
    };
  }
  
  // Fallback styling agar kuch match na kare
  return {
    backgroundColor: "#f1f5f9",
    color: "#475569",
    borderColor: "#e2e8f0"
  };
};
  // Find Category details for UI rendering
  const getCategoryDetails = (catName: string): Category => {
    return categories.find(c => c.name.toLowerCase() === (catName || "").toLowerCase()) || {
      _id: "default",
      name: "General",
      color: "#475569",
      icon: "FaStethoscope"
    };
  };

  const selectedAddCatDetails = getCategoryDetails(category);
  const selectedInlineCatDetails = getCategoryDetails(editCategory);

  return (
    <div className="p-6 md:p-10 bg-gradient-to-tr from-slate-100 via-slate-50 to-blue-50/50 min-h-screen text-slate-800 font-sans antialiased">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl shadow-xl shadow-blue-200">
                <Award className="w-7 h-7" />
              </div>
              Specialties Panel
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Manage clinical and occupational domains dynamically.</p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={loadData}
              className="p-3 text-slate-600 bg-white border border-slate-200/80 rounded-xl shadow-sm hover:bg-slate-50 transition-all active:scale-95"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button 
              onClick={() => setShowAdd(!showAdd)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:opacity-95 text-white font-semibold px-5 py-3 rounded-xl shadow-lg transition-all active:scale-95"
            >
              <Plus className="w-5 h-5" />
              New Specialty
            </button>
          </div>
        </div>

        {/* SEARCH FILTER */}
        <div className="relative mb-8 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors w-5 h-5" />
          <input
            className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all backdrop-blur-sm text-slate-800 placeholder-slate-400"
            placeholder="Search specialties or categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ADD CARD SECTION */}
        {showAdd && (
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 mb-8 shadow-xl shadow-blue-500/5 animate-in zoom-in-95 duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Specialty Name *</label>
                <input
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none bg-white text-slate-800 placeholder-slate-400 transition-all shadow-inner"
                  placeholder="e.g. Cardiology"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2 relative" ref={addDropdownRef}>
                <label className="text-sm font-bold text-slate-700 ml-1">Category / Grouping *</label>
                
                {categories.length === 0 ? (
                  <div className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50 text-slate-400">
                    No categories available. Add one first!
                  </div>
                ) : (
                  <>
                    <div
                      onClick={() => setAddDropdownOpen(!addDropdownOpen)}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm flex items-center justify-between bg-white text-slate-800 transition-all shadow-inner cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-3.5 h-3.5 rounded-full border shadow-sm" 
                          style={{ 
                            backgroundColor: selectedAddCatDetails?.color || "#475569", 
                            borderColor: `${selectedAddCatDetails?.color || "#475569"}50` 
                          }}
                        />
                        <span className="flex items-center gap-1.5 font-medium">
                          <DynamicIcon iconName={selectedAddCatDetails.icon} style={{ color: selectedAddCatDetails.color }} className="w-4 h-4" />
                          {category}
                        </span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${addDropdownOpen ? "rotate-180" : ""}`} />
                    </div>

                    {addDropdownOpen && (
                      <div className="absolute z-30 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150 p-1.5">
                        {categories.map((cat) => (
                          <div
                            key={cat._id || cat.id}
                            onClick={() => {
                              setCategory(cat.name);
                              setAddDropdownOpen(false);
                            }}
                            className={`px-4 py-3 text-sm flex items-center gap-3 cursor-pointer transition-colors rounded-lg ${category === cat.name ? "bg-blue-600 text-white font-bold" : "hover:bg-slate-50 text-slate-700"}`}
                          >
                            <span 
                              className="w-3.5 h-3.5 rounded-full border" 
                              style={{ 
                                backgroundColor: cat.color || "#475569", 
                                borderColor: `${cat.color || "#475569"}50` 
                              }}
                            />
                            <span className="flex items-center gap-2">
                              <DynamicIcon iconName={cat.icon} style={{ color: category === cat.name ? "#ffffff" : cat.color }} className="w-4 h-4" />
                              {cat.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-100">
              <button onClick={() => { setShowAdd(false); setAddDropdownOpen(false); }} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">Discard</button>
              <button onClick={addSpecialty} disabled={actionLoading || categories.length === 0} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-blue-100 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50">
                {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Entry
              </button>
            </div>
          </div>
        )}

        {/* ─── GRADIENT TABLE CONTAINER ─── */}
        <div className="border border-blue-200/80 rounded-[2rem] shadow-xl overflow-hidden bg-gradient-to-b from-blue-50/80 via-sky-50/50 to-white backdrop-blur-md">
          
          {/* Header Row */}
          <div className="hidden sm:grid grid-cols-12 gap-4 bg-gradient-to-r from-blue-100/70 via-sky-50 to-blue-100/70 p-5 text-[11px] font-bold uppercase tracking-[0.15em] text-blue-700 border-b border-blue-200/60">
            <div className="col-span-6">Specialty Field</div>
            <div className="col-span-4">Category Group</div>
            <div className="col-span-2 text-right pr-4">Actions</div>
          </div>

          {/* Dynamic Grid Rows */}
          <div className="divide-y divide-blue-100/70 bg-gradient-to-br from-blue-50/40 via-white to-sky-50/30">
            {loading ? (
              <div className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" /></div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center text-slate-400 font-medium">No specialties matched your parameters.</div>
            ) : filtered.map(s => {
              const isEditing = editId === getSpecialtyId(s);
              const customBadgeStyle = getDynamicBadgeStyle(s.category);
              const currentCatDetails = getCategoryDetails(s.category);

              return (
                <div key={getSpecialtyId(s)} className={`grid grid-cols-1 sm:grid-cols-12 gap-4 items-center p-5 transition-all duration-200 ${isEditing ? "bg-sky-100/60 backdrop-blur-md relative z-10" : "hover:bg-blue-50/40"}`}>
                  {isEditing ? (
                    /* EDITING ACTIVE STATE */
                    <div className="col-span-12 flex flex-col sm:flex-row gap-3 animate-in fade-in duration-150">
                      <input 
                        value={editName} 
                        onChange={(e) => setEditName(e.target.value)} 
                        className="flex-1 border border-blue-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 bg-white text-slate-800 outline-none font-medium shadow-inner" 
                      />
                      
                      {/* INLINE EDITING CUSTOM DROPDOWN */}
                      <div className="sm:w-64 relative" ref={inlineDropdownRef}>
                        <div
                          onClick={() => setInlineDropdownOpen(!inlineDropdownOpen)}
                          className="w-full border border-blue-200 rounded-xl px-4 py-2.5 text-sm flex items-center justify-between bg-white text-slate-800 outline-none font-medium shadow-inner cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-2">
                            <span 
                              className="w-3 h-3 rounded-full border shadow-sm" 
                              style={{ 
                                backgroundColor: selectedInlineCatDetails?.color || "#475569", 
                                borderColor: `${selectedInlineCatDetails?.color || "#475569"}50` 
                              }}
                            />
                            <span className="flex items-center gap-1.5 font-semibold">
                              <DynamicIcon iconName={selectedInlineCatDetails.icon} style={{ color: selectedInlineCatDetails.color }} className="w-4 h-4" />
                              {editCategory}
                            </span>
                          </div>
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        </div>

                        {inlineDropdownOpen && (
                          <div className="absolute z-40 w-full mt-1 bg-white border border-blue-200 rounded-xl shadow-2xl max-h-48 overflow-y-auto overflow-hidden p-1.5">
                            {categories.map((cat) => (
                              <div
                                key={cat._id || cat.id}
                                onClick={() => {
                                  setEditCategory(cat.name);
                                  setInlineDropdownOpen(false);
                                }}
                                className={`px-4 py-2.5 text-sm flex items-center gap-2.5 cursor-pointer transition-colors rounded-lg ${editCategory === cat.name ? "bg-blue-600 text-white font-bold" : "hover:bg-slate-50 text-slate-700"}`}
                              >
                                <span 
                                  className="w-3 h-3 rounded-full border" 
                                  style={{ 
                                    backgroundColor: cat.color || "#475569", 
                                    borderColor: `${cat.color || "#475569"}50` 
                                  }}
                                />
                                <span className="flex items-center gap-1.5">
                                  <DynamicIcon iconName={cat.icon} style={{ color: editCategory === cat.name ? "#ffffff" : cat.color }} className="w-4 h-4" />
                                  {cat.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button onClick={saveEdit} className="p-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 shadow-md transition-all active:scale-95">
                          <Check className="w-5 h-5" />
                        </button>
                        <button onClick={() => { setEditId(null); setInlineDropdownOpen(false); }} className="p-2.5 bg-slate-200 text-slate-600 border border-slate-300 rounded-xl hover:bg-slate-300 transition-all">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* DEFAULT DISPLAY STATE (TABLE) */
                    <>
                      {/* Name Column */}
                      <div className="col-span-12 sm:col-span-6">
                        <span className="text-base font-bold text-slate-800 tracking-tight">{s.name}</span>
                      </div>
                      
                      {/* Category Badge Column with Dynamic Medical Icons */}
                      <div className="col-span-12 sm:col-span-4">
                        <span 
                          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border shadow-sm transition-all duration-200 hover:brightness-95 cursor-default"
                          style={customBadgeStyle}
                        >
                          <DynamicIcon iconName={currentCatDetails.icon} className="w-4 h-4 stroke-[2.5]" />
                          {s.category || "General"}
                        </span>
                      </div>

                      {/* Actions Column */}
                      <div className="col-span-12 sm:col-span-2 flex justify-start sm:justify-end gap-1">
                        <button onClick={() => startEdit(s)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-100/50 rounded-xl transition-all">
                          <Pencil className="w-4.5 h-4.5" />
                        </button>
                        <button 
                          onClick={() => deleteSpecialty(getSpecialtyId(s))} 
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          {deletingId === getSpecialtyId(s) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4.5 h-4.5" />}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}