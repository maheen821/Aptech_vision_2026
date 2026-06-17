import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Plus, Trash2, Pencil, Check, X, Loader2,
  Stethoscope, RefreshCw, Search, ChevronDown
} from "lucide-react";

// Real Anatomy Organ aur Medical Icons (React-Icons) ko import kiya gaya hai
import { 
  GiHeartOrgan, GiBrain, GiLungs, GiSkeleton, 
  GiStomach, GiBleedingEye, GiTooth, GiKidneys 
} from "react-icons/gi";
import { 
  FaBabyCarriage, FaChild, FaSyringe, FaFileMedical, 
  FaDroplet, FaThermometer, FaHeartPulse, FaEarListen 
} from "react-icons/fa6";

const API_BASE = "http://localhost:5000/api";

/* ─── TYPES ─── */
interface Symptom {
  _id?: string;
  name: string;
  category: string;
}

interface Category {
  _id?: string;
  name: string;
  color: string;
  icon: string;
}

// Mapping structure runtime dynamic icons render karne k liye (React Icons Matching)
const iconMap: Record<string, any> = {
  GiHeartOrgan, GiBrain, GiLungs, GiSkeleton, 
  GiStomach, GiBleedingEye, GiTooth, GiKidneys,
  FaBabyCarriage, FaChild, FaSyringe, FaFileMedical, 
  FaDroplet, FaThermometer, FaHeartPulse, FaEarListen
};

function getSymptomId(s: Symptom) {
  return s._id ?? "";
}

export default function AdminSymptoms() {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // States for Custom Dropdowns
  const [addDropdownOpen, setAddDropdownOpen] = useState(false);
  const [editDropdownOpen, setEditDropdownOpen] = useState(false);
  const addDropdownRef = useRef<HTMLDivElement>(null);
  const editDropdownRef = useRef<HTMLDivElement>(null);

  const loadSymptoms = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/symptoms`);
      const data = await res.json();
      setSymptoms(Array.isArray(data) ? data : data.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const loadCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : data.data || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    loadSymptoms();
    loadCategories();

    const handleClickOutside = (event: MouseEvent) => {
      if (addDropdownRef.current && !addDropdownRef.current.contains(event.target as Node)) {
        setAddDropdownOpen(false);
      }
      if (editDropdownRef.current && !editDropdownRef.current.contains(event.target as Node)) {
        setEditDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addSymptom = async () => {
    if (!name.trim() || !category) return alert("Please fill all fields");
    setActionLoading(true);
    try {
      await axios.post(`${API_BASE}/symptoms`, { name, category });
      setName(""); setCategory(""); setShowAdd(false);
      loadSymptoms();
    } catch (err) { console.error(err); } finally { setActionLoading(false); }
  };

  const deleteSymptom = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this symptom?")) return;
    setDeletingId(id);
    try {
      await axios.delete(`${API_BASE}/symptoms/${id}`);
      loadSymptoms();
    } catch (err) { console.error(err); } finally { setDeletingId(null); }
  };

  const startEdit = (s: Symptom) => {
    setEditId(getSymptomId(s));
    setEditName(s.name);
    setEditCategory(s.category);
  };

  const saveEdit = async () => {
    if (!editId) return;
    setActionLoading(true);
    try {
      await axios.put(`${API_BASE}/symptoms/${editId}`, { name: editName, category: editCategory });
      setEditId(null);
      setEditDropdownOpen(false);
      loadSymptoms();
    } catch (err) { console.error(err); } finally { setActionLoading(false); }
  };

  const filtered = symptoms.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  const getCategory = (name: string) => categories.find(c => c.name === name);

  return (
    <div className="p-6 md:p-10 bg-gradient-to-tr from-slate-100 via-slate-50 to-blue-50/50 min-h-screen text-slate-800 font-sans antialiased">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl shadow-xl shadow-blue-200">
                <Stethoscope className="w-7 h-7" />
              </div>
              Symptoms Central
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Manage clinical database with precision.</p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={loadSymptoms}
              className="p-3 text-slate-600 bg-white border border-slate-200/80 rounded-xl shadow-sm hover:bg-slate-50 transition-all active:scale-95"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button 
              onClick={() => setShowAdd(!showAdd)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:opacity-95 text-white font-semibold px-5 py-3 rounded-xl shadow-lg transition-all active:scale-95"
            >
              <Plus className="w-5 h-5" />
              New Entry
            </button>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="relative mb-8 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors w-5 h-5" />
          <input
            className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all backdrop-blur-sm text-slate-800 placeholder-slate-400"
            placeholder="Search symptoms, categories, or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ADD FORM CARD */}
        {showAdd && (
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 mb-8 shadow-xl shadow-blue-500/5 animate-in zoom-in-95 duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Symptom Name</label>
                <input
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none bg-white text-slate-800 placeholder-slate-400 transition-all shadow-inner"
                  placeholder="e.g. Migraine"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2" ref={addDropdownRef}>
                <label className="text-sm font-bold text-slate-700 ml-1">Category</label>
                <div className="relative">
                  <div
                    onClick={() => setAddDropdownOpen(!addDropdownOpen)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white text-slate-800 flex justify-between items-center cursor-pointer transition-all hover:border-slate-300 shadow-sm"
                  >
                    <span className={category ? "text-slate-800 font-medium" : "text-slate-400"}>
                      {category || "Choose category..."}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${addDropdownOpen ? "rotate-180" : ""}`} />
                  </div>

                  {addDropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 p-1.5">
                      {categories.length === 0 ? (
                        <div className="py-2 px-4 text-xs text-slate-400">No categories found</div>
                      ) : (
                        categories.map(c => {
                          const DropdownIcon = c.icon && iconMap[c.icon] ? iconMap[c.icon] : FaHeartPulse;
                          return (
                            <div
                              key={c._id}
                              onClick={() => {
                                setCategory(c.name);
                                setAddDropdownOpen(false);
                              }}
                              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-colors ${category === c.name ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-slate-50"}`}
                            >
                              <DropdownIcon className="w-4 h-4" style={{ color: category === c.name ? "#fff" : c.color }} />
                              {c.name}
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-100">
              <button onClick={() => setShowAdd(false)} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">Discard</button>
              <button onClick={addSymptom} disabled={actionLoading} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-blue-100 flex items-center gap-2 transition-all active:scale-95">
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Confirm Entry
              </button>
            </div>
          </div>
        )}

        {/* ─── MODERN LIGHT SKY BLUE GRADIENT TABLE CONTAINER ─── */}
        <div className="border border-blue-200/80 rounded-[2rem] shadow-xl overflow-hidden bg-gradient-to-b from-blue-50/80 via-sky-50/50 to-white backdrop-blur-md">
          
          {/* Header Row */}
          <div className="hidden sm:grid grid-cols-12 gap-4 bg-gradient-to-r from-blue-100/70 via-sky-50 to-blue-100/70 p-5 text-[11px] font-bold uppercase tracking-[0.15em] text-blue-700 border-b border-blue-200/60">
            <div className="col-span-6">Symptom Details</div>
            <div className="col-span-4">Classification Box</div>
            <div className="col-span-2 text-right pr-4">Actions</div>
          </div>

          {/* Dynamic Grid Rows */}
          <div className="divide-y divide-blue-100/70 bg-gradient-to-br from-blue-50/40 via-white to-sky-50/30">
            {loading ? (
              <div className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" /></div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center text-slate-400 font-medium">No symptoms matched your search criteria.</div>
            ) : filtered.map(s => {
              const cat = getCategory(s.category);
              
              // Real Anatomical Organ Icon dynamically lagaya gaya hai
              const RowIcon = cat?.icon && iconMap[cat.icon] ? iconMap[cat.icon] : FaHeartPulse;
              const isEditing = editId === getSymptomId(s);
              const catColor = cat?.color || "#3b82f6";

              return (
                <div key={getSymptomId(s)} className={`grid grid-cols-1 sm:grid-cols-12 gap-4 items-center p-5 transition-all duration-200 ${isEditing ? "bg-sky-100/60 backdrop-blur-md" : "hover:bg-blue-50/40"}`}>
                  {isEditing ? (
                    <div className="col-span-12 flex flex-col sm:flex-row gap-3 animate-in fade-in duration-150">
                      <input value={editName} onChange={(e) => setEditName(e.target.value)} className="flex-1 border border-blue-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 bg-white text-slate-800 outline-none font-medium shadow-inner" />
                      
                      {/* Custom Dropdown for Editing Row */}
                      <div className="relative sm:w-64" ref={editDropdownRef}>
                        <div
                          onClick={() => setEditDropdownOpen(!editDropdownOpen)}
                          className="w-full border border-blue-200 rounded-xl px-4 py-2.5 text-sm bg-white text-slate-800 flex justify-between items-center cursor-pointer font-medium shadow-sm"
                        >
                          <span>{editCategory || "Select..."}</span>
                          <ChevronDown className="w-4 h-4 text-slate-500" />
                        </div>
                        
                        {editDropdownOpen && (
                          <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-48 overflow-y-auto p-1.5 animate-in fade-in duration-100">
                            {categories.map(c => {
                              const EditMenuIcon = c.icon && iconMap[c.icon] ? iconMap[c.icon] : FaHeartPulse;
                              return (
                                <div
                                  key={c._id}
                                  onClick={() => {
                                    setEditCategory(c.name);
                                    setEditDropdownOpen(false);
                                  }}
                                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-colors ${editCategory === c.name ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-slate-50"}`}
                                >
                                  <EditMenuIcon className="w-4 h-4 mr-1" style={{ color: editCategory === c.name ? "#fff" : c.color }} />
                                  {c.name}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button onClick={saveEdit} className="p-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 shadow-md transition-all active:scale-95"><Check className="w-5 h-5" /></button>
                        <button onClick={() => setEditId(null)} className="p-2.5 bg-slate-200 text-slate-600 border border-slate-300 rounded-xl hover:bg-slate-300 transition-all"><X className="w-5 h-5" /></button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Name Column */}
                      <div className="col-span-12 sm:col-span-6">
                        <span className="text-base font-bold text-slate-800 tracking-tight">{s.name}</span>
                      </div>
                      
                      {/* Premium Real-Organ Badges */}
                      <div className="col-span-12 sm:col-span-4">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-black tracking-wide uppercase border transform transition-all duration-200 hover:brightness-105 shadow-sm cursor-default"
                          style={{ 
                            backgroundColor: `${catColor}15`, 
                            borderColor: `${catColor}35`,
                            color: catColor
                          }}>
                          <RowIcon className="w-4 h-4 stroke-[1.5]" />
                          {s.category}
                        </span>
                      </div>

                      {/* Actions Column */}
                      <div className="col-span-12 sm:col-span-2 flex justify-start sm:justify-end gap-1">
                        <button onClick={() => startEdit(s)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-100/50 rounded-xl transition-all"><Pencil className="w-4.5 h-4.5" /></button>
                        <button 
                          onClick={() => deleteSymptom(getSymptomId(s))} 
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          {deletingId === getSymptomId(s) ? <Loader2 className="w-4 h-4 animate-spin text-red-500" /> : <Trash2 className="w-4.5 h-4.5" />}
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