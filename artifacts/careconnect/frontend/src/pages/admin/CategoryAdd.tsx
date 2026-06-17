import { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus, Trash2, Pencil, Check, X, Loader2,
  FolderPlus, Layers, Palette, FolderCheck, RefreshCw, Search, ListFilter
} from "lucide-react";

// Real Anatomy Organ aur Medical Icons
import { 
  GiHeartOrgan, GiBrain, GiLungs, GiSkeleton, 
  GiStomach, GiBleedingEye, GiTooth, GiKidneys 
} from "react-icons/gi";
import { 
  FaBabyCarriage, FaChild, FaSyringe, FaFileMedical, 
  FaDroplet, FaThermometer, FaHeartPulse, FaEarListen 
} from "react-icons/fa6";

const API_BASE = "http://localhost:5000/api";

/* ─── EXTENDED PREMIUM MEDICAL LIGHT PALETTE PRESETS ─── */
const COLOR_PRESETS = [
  "#0ea5e9", // Sky Blue - Diagnostic / General
  "#ef4444", // Red - Cardiology
  "#f97316", // Orange - Endocrinology
  "#eab308", // Yellow - Dental
  "#22c55e", // Green - General
  "#06b6d4", // Cyan - Pulmonology
  "#3b82f6", // Blue - Neurology
  "#6366f1", // Indigo - Urology
  "#8b5cf6", // Violet - Orthopedics
  "#ec4899", // Pink - Gynecology
  "#f43f5e", // Rose - Pediatrics
  "#14b8a6", // Teal - Dermatology
  "#d97706", // Deep Amber - Geriatrics
  "#10b981", // Mint Green - Therapy
  "#0f172a", // Dark Slate - Premium Clinical
  "#64748b"  // Slate - Fallback
];

/* ─── ANATOMICAL & MEDICAL ICON PRESETS ─── */
const ICON_PRESETS = [
  { name: "GiHeartOrgan",    label: "Heart (Cardio)",    Icon: GiHeartOrgan },
  { name: "GiBrain",          label: "Brain (Neuro)",      Icon: GiBrain },
  { name: "GiLungs",          label: "Lungs (Pulmo)",      Icon: GiLungs },
  { name: "GiSkeleton",       label: "Bone (Ortho)",       Icon: GiSkeleton },
  { name: "GiStomach",        label: "Stomach (Gastro)",   Icon: GiStomach },
  { name: "GiKidneys",        label: "Kidneys (Uro)",      Icon: GiKidneys },
  { name: "GiBleedingEye",    label: "Eye (Ophth)",        Icon: GiBleedingEye },
  { name: "FaEarListen",      label: "Ear (ENT)",          Icon: FaEarListen },
  { name: "GiTooth",          label: "Tooth (Dental)",     Icon: GiTooth },
  { name: "FaBabyCarriage",    label: "Maternity (Gyne)",   Icon: FaBabyCarriage },
  { name: "FaChild",          label: "Child (Ped)",        Icon: FaChild },
  { name: "FaSyringe",        label: "Syringe (Diab)",     Icon: FaSyringe },
  { name: "FaFileMedical",    label: "Skin (Derm)",        Icon: FaFileMedical },
  { name: "FaDroplet",        label: "Blood Drops",        Icon: FaDroplet },
  { name: "FaThermometer",    label: "Fever/Flu",          Icon: FaThermometer },
  { name: "FaHeartPulse",     label: "Pulse / General",    Icon: FaHeartPulse }
];

const globalIconMap: Record<string, any> = {
  giheartorgan: GiHeartOrgan,
  gibrain: GiBrain,
  gilungs: GiLungs,
  giskeleton: GiSkeleton,
  gistomach: GiStomach,
  gibleedingeye: GiBleedingEye,
  gitooth: GiTooth,
  gikidneys: GiKidneys,
  faearlisten: FaEarListen,
  fababycarriage: FaBabyCarriage,
  fachild: FaChild,
  fasyringe: FaSyringe,
  fafilemedical: FaFileMedical,
  fadroplet: FaDroplet,
  fathermometer: FaThermometer,
  faheartpulse: FaHeartPulse
};

const resolveIcon = (iconName: string) => {
  if (!iconName) return FaHeartPulse;
  const safeKey = iconName.toLowerCase().trim();
  return globalIconMap[safeKey] || FaHeartPulse;
};

interface Category {
  _id?: string;
  id?: string; 
  name: string;
  color: string;
  icon: string;
}

export default function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Tab View State: 'view' ya 'add'
  const [activeTab, setActiveTab] = useState<"view" | "add">("view");

  // Form State
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("FaHeartPulse");
  const [selectedColor, setSelectedColor] = useState("#3b82f6");

  // Inline Editing State
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState("");
  const [editColor, setEditColor] = useState("");

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/categories`);
      setCategories(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const createCategory = async () => {
    if (!name.trim()) return alert("Please enter a category name");
    setActionLoading(true);
    try {
      await axios.post(`${API_BASE}/categories`, {
        name,
        icon: selectedIcon,
        color: selectedColor
      });
      setName("");
      setSelectedIcon("FaHeartPulse");
      setSelectedColor("#3b82f6");
      loadCategories();
      setActiveTab("view"); 
    } catch (err) {
      console.error(err);
      alert("Error adding category");
    } finally {
      setActionLoading(false);
    }
  };

  const startEdit = (cat: Category) => {
    const targetId = cat._id || cat.id || null;
    setEditId(targetId);
    setEditName(cat.name);
    setEditIcon(cat.icon || "FaHeartPulse");
    setEditColor(cat.color || "#3b82f6");
  };

  const saveEdit = async () => {
    if (!editId || !editName.trim()) return;
    setActionLoading(true);
    try {
      await axios.put(`${API_BASE}/categories/${editId}`, {
        name: editName,
        icon: editIcon,
        color: editColor
      });
      setEditId(null);
      loadCategories();
    } catch (err) {
      console.error(err);
      alert("Error updating category");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!id || !window.confirm("Are you sure you want to delete this category?")) return;
    setDeletingId(id);
    try {
      await axios.delete(`${API_BASE}/categories/${id}`);
      loadCategories();
    } catch (err) {
      console.error(err);
      alert("Error processing deletion");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 md:p-10 bg-slate-50/70 min-h-screen text-slate-800 font-sans tracking-normal antialiased">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* LIGHT CLINICAL HEADER PANEL */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 transition-all">
          <div className="flex items-center gap-5">
            {/* MEDICAL CLINIC BLUE BOX */}
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center border border-blue-500 shadow-md shrink-0">
              <Layers className="w-7 h-7 text-white stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
                Medical Taxonomy
              </h1>
              <p className="text-slate-500 text-sm md:text-base mt-1 font-medium">
                Manage clinical specialties, anatomical tags, and biological configurations.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE ACTIONS */}
          <div className="flex items-center flex-wrap lg:flex-nowrap gap-4 w-full lg:w-auto justify-start lg:justify-end border-t border-slate-100 lg:border-none pt-4 lg:pt-0">
            <div className="bg-slate-100 p-1.5 rounded-xl flex items-center w-full sm:w-auto gap-2 shadow-inner">
              <button
                onClick={() => setActiveTab("view")}
                className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap grow sm:grow-0 ${
                  activeTab === "view"
                    ? "bg-white text-blue-600 shadow-md border border-slate-200/80 scale-[1.02]"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                <ListFilter className="w-4 h-4 stroke-[2.5]" />
                View Categories
              </button>
              <button
                onClick={() => setActiveTab("add")}
                className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap grow sm:grow-0 ${
                  activeTab === "add"
                    ? "bg-white text-blue-600 shadow-md border border-slate-200/80 scale-[1.02]"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                Add Category
              </button>
            </div>

            <button 
              onClick={loadCategories}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-bold border border-slate-200 shadow-sm transition-all active:scale-95 hover:border-slate-300 w-full sm:w-auto"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-500' : 'text-slate-500'}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* MAIN INTERFACE CONTAINER */}
        <div className="w-full">
          
          {/* VIEW TAB PANEL */}
          {activeTab === "view" && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* FILTER REGISTRY BOX */}
              <div className="bg-white rounded-xl p-3 border border-slate-200 flex items-center gap-4 shadow-sm focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all">
                <div className="pl-2 text-slate-400">
                  <Search className="w-5 h-5" />
                </div>
                <input 
                  type="text"
                  placeholder="Search catalog registry..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none text-base text-slate-800 placeholder-slate-400 outline-none focus:ring-0"
                />
                <span className="text-xs font-extrabold bg-blue-50 text-blue-600 border border-blue-100 px-4 py-1.5 rounded-lg whitespace-nowrap shadow-sm">
                  {filteredCategories.length} Records
                </span>
              </div>

              {/* HOSPITAL REGISTRY TABLE */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
                <div className="hidden sm:grid grid-cols-12 gap-4 bg-slate-50/80 px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <div className="col-span-6">System Specimen Identity</div>
                  <div className="col-span-4">Visual Anchor Label</div>
                  <div className="col-span-2 text-right">Modifier Options</div>
                </div>

                <div className="divide-y divide-slate-100">
                  {loading ? (
                    <div className="py-24 text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
                      <span className="text-sm text-slate-500 mt-3 block font-bold tracking-wide">Syncing Clinical Matrix...</span>
                    </div>
                  ) : filteredCategories.length === 0 ? (
                    <div className="py-20 text-center">
                      <div className="text-slate-400 text-base font-bold">No operational categories found.</div>
                    </div>
                  ) : filteredCategories.map((cat) => {
                    const catId = cat._id || cat.id || "";
                    const isEditing = editId === catId;
                    const RowIcon = resolveIcon(cat.icon);

                    {/* DYNAMIC BACKGROUND & BADGE STYLING (MATCHED TO PRIMARY COLOR) */}
                    const dynamicBadgeStyle = {
                      backgroundColor: `${cat.color || "#3b82f6"}15`,
                      color: cat.color || "#3b82f6",
                      borderColor: `${cat.color || "#3b82f6"}30`
                    };

                    const dynamicRowStyle = {
                      backgroundColor: isEditing ? `${cat.color || "#3b82f6"}08` : undefined,
                      borderLeft: `4px solid ${cat.color || "transparent"}`
                    };

                    return (
                      <div 
                        key={catId} 
                        style={dynamicRowStyle}
                        className={`grid grid-cols-1 sm:grid-cols-12 gap-4 items-center px-6 py-4.5 transition-all relative ${isEditing ? "" : "hover:bg-slate-50/60"}`}
                      >
                        
                        {isEditing ? (
                          /* INLINE WORKSPACE WRAPPER */
                          <div className="col-span-12 flex flex-col gap-4 py-2 animate-fadeIn">
                            <div className="flex gap-3">
                              <input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="flex-1 border border-slate-300 bg-white rounded-xl px-4 py-2.5 text-base font-bold text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                              />
                              <div className="flex gap-2">
                                <button onClick={saveEdit} className="px-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md transition-all active:scale-95 flex items-center justify-center"><Check className="w-5 h-5 stroke-[3]" /></button>
                                <button onClick={() => setEditId(null)} className="px-3.5 bg-white text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all active:scale-95 flex items-center justify-center"><X className="w-5 h-5 stroke-[2.5]" /></button>
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-3.5 bg-white p-4 rounded-xl border border-slate-200/80 shadow-inner">
                              <div className="flex flex-wrap gap-2.5">
                                {COLOR_PRESETS.map((c) => (
                                  <button key={c} type="button" onClick={() => setEditColor(c)} className="w-6 h-6 rounded-full relative border border-slate-300/40 transition-all hover:scale-120 shadow-sm" style={{ backgroundColor: c }}>
                                    {editColor === c && <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-white shadow-md animate-scaleUp" />}
                                  </button>
                                ))}
                              </div>
                              <div className="flex flex-wrap gap-2 max-h-[90px] overflow-y-auto custom-scrollbar pt-3 border-t border-slate-150">
                                {ICON_PRESETS.map(({ name: iName, Icon }) => (
                                  <button key={iName} type="button" onClick={() => setEditIcon(iName)} className={`p-2.5 rounded-xl transition-all hover:scale-105 ${editIcon.toLowerCase() === iName.toLowerCase() ? "bg-blue-600 text-white shadow-md scale-105" : "bg-slate-50 text-slate-500 border border-slate-200 hover:text-slate-800 hover:bg-slate-100"}`}>
                                    <Icon className="w-4 h-4" />
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* STRUCTURAL VIEW MODE */
                          <>
                            {/* Name Block */}
                            <div className="col-span-12 sm:col-span-6 flex items-center gap-4">
                              <div className="w-3.5 h-3.5 rounded-full border-2 border-white shadow-md shrink-0 transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: cat.color }} />
                              <span className="text-base font-bold text-slate-800 tracking-tight">{cat.name}</span>
                            </div>

                            {/* Dynamic Table Row Background Look Badge */}
                            <div className="col-span-12 sm:col-span-4">
                              <span
                                className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border shadow-sm transition-all duration-200"
                                style={dynamicBadgeStyle}
                              >
                                <RowIcon className="w-4 h-4 stroke-[2.5]" />
                                {cat.name || "General"}
                              </span>
                            </div>

                            {/* Controls */}
                            <div className="col-span-12 sm:col-span-2 flex justify-start sm:justify-end gap-1.5">
                              <button
                                onClick={() => startEdit(cat)}
                                className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded-xl transition-all shadow-none hover:shadow-sm"
                                title="Edit Node"
                              >
                                <Pencil className="w-4.5 h-4.5 stroke-[2]" />
                              </button>
                              <button
                                onClick={() => deleteCategory(catId)}
                                className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-xl transition-all shadow-none hover:shadow-sm"
                                title="Delete Node"
                              >
                                {deletingId === catId ? <Loader2 className="w-4.5 h-4.5 animate-spin text-red-500" /> : <Trash2 className="w-4.5 h-4.5 stroke-[2]" />}
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
          )}

          {/* ADD TAB PANEL */}
          {activeTab === "add" && (
            <div className="max-w-xl mx-auto bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6 animate-fadeIn">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-wider flex items-center gap-2.5 border-b border-slate-100 pb-4">
                <FolderPlus className="w-5 h-5 text-blue-600 stroke-[2.5]" /> Add Structural Element
              </h3>

              <div className="space-y-5">
                {/* Name Input */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider">
                    Nomenclature / Name
                  </label>
                  <input
                    className="w-full border border-slate-200 bg-slate-50/80 rounded-xl px-4 py-3 text-base focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-slate-800 font-bold placeholder-slate-400 shadow-inner transition-all"
                    placeholder="e.g., Cardiology, Endocrinology"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* Vector Icon Presets */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FolderCheck className="w-4 h-4 text-blue-500" /> Biological Vector Anchor
                  </label>
                  <div className="grid grid-cols-4 gap-2.5 bg-slate-50 p-3 rounded-xl max-h-[160px] overflow-y-auto border border-slate-200 shadow-inner custom-scrollbar">
                    {ICON_PRESETS.map(({ name: iconName, label, Icon }) => (
                      <button
                        key={iconName}
                        type="button"
                        title={label}
                        onClick={() => setSelectedIcon(iconName)}
                        className={`p-3 rounded-xl flex items-center justify-center border transition-all active:scale-95 ${
                          selectedIcon === iconName
                            ? "bg-blue-600 text-white border-transparent shadow-md scale-105"
                            : "bg-white text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-800 hover:border-slate-300"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Palette Matrix */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="w-4 h-4 text-blue-500" /> Architectural Chromatid Tag
                  </label>
                  <div className="flex flex-wrap gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-inner">
                    {COLOR_PRESETS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className="w-6 h-6 rounded-full relative transition-all hover:scale-120 border border-slate-300/40 shadow-sm"
                        style={{ backgroundColor: color }}
                      >
                        {selectedColor === color && (
                          <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-white shadow-md animate-scaleUp" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  onClick={createCategory}
                  disabled={actionLoading}
                  className="w-full mt-3 flex items-center justify-center gap-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-40 text-white font-black text-xs md:text-sm py-3.5 uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-[0.99]"
                >
                  {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5 stroke-[3]" />}
                Add Category
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* LIGHT SCROLLBARS & PREMIUM ANIMATIONS */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.02); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleUp {
          from { transform: scale(0.6); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.25s ease-out forwards; }
        .animate-scaleUp { animation: scaleUp 0.15s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}</style>
    </div>
  );
}