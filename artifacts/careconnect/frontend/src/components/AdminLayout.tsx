import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, UserPlus, FileText, FolderPlus, Award, 
  LogOut, User, Bell, Calendar, Stethoscope, Sun, Moon, CheckCircle2,
  AlertCircle, Edit3, Trash2 
} from "lucide-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  
  // 🌓 State Management for Theme and Dropdowns
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  // 🔔 Live Notification Data State
  const [notifications, setNotifications] = useState<any[]>([]);

  // 🪝 Refs for handling click-away functionality
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Updated paths to match clean "/admin" indexing
  const menuItems = [
    { name: "Dashboard", path: "/admin/index", icon: LayoutDashboard },
    { name: "Add Doctor", path: "/admin/add-doctor", icon: UserPlus },
    { name: "Symptom Admin", path: "/admin/symptom", icon: FileText },
    { name: "Category Add", path: "/admin/category-add", icon: FolderPlus },
    { name: "Specialty Admin", path: "/admin/specialty-admin", icon: Award },
  ];

  // 🔄 Fetch Notifications Function
  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/notifications"); 
      const data = await response.json();
      if (Array.isArray(data)) {
        setNotifications(data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  // 🔄 Backend Notification API Connect aur Polling Logic
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  // 🖱️ Event listener to close panels on clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Close notification dropdown if clicked outside
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      // Close profile menu dropdown if clicked outside
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ❌ Delete Notification Function
  const handleDeleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Dropdown ko close hone se rokne ke liye
    try {
      const response = await fetch(`http://localhost:5000/api/admin/notifications/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setNotifications((prev) => prev.filter((n) => (n._id || n.id) !== id));
      } else {
        console.error("Failed to delete notification from server");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // 🕒 Pure Pakistan Time Zone (Asia/Karachi) Greeting Fix
  const getGreeting = () => {
    const options = { timeZone: "Asia/Karachi", hour: "2-digit", hour12: false } as const;
    const pkHour = parseInt(new Intl.DateTimeFormat("en-US", options).format(new Date()), 10);

    if (pkHour >= 5 && pkHour < 12) return "Good Morning, Admin ☀️";
    if (pkHour >= 12 && pkHour < 17) return "Good Afternoon, Admin 🌤️";
    if (pkHour >= 17 && pkHour < 21) return "Good Evening, Admin 🌙";
    return "Good Night, Admin 💤";
  };

  // 📅 Current Date Format based on Pakistan Zone
  const formattedDate = new Date().toLocaleDateString("en-US", {
    timeZone: "Asia/Karachi",
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  // ⏳ Human Readable Time Format Helper
  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", { 
      hour: "2-digit", 
      minute: "2-digit",
      hour12: true 
    });
  };

  // Theme Toggler Switch Logic
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className={`flex h-screen font-sans overflow-hidden antialiased transition-colors duration-300 ${
      darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-800"
    }`}>
      
      {/* 1. SIDEBAR */}
      <aside className="w-66 bg-gradient-to-b from-slate-950 via-slate-900 to-black text-slate-200 flex flex-col justify-between border-r border-white/5 hidden md:flex shrink-0">
        <div>
          <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-emerald-400 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Stethoscope className="w-5 h-5 text-slate-950" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight leading-tight">
                <span className="text-sky-400">Care</span><span className="text-emerald-400">Connect</span>
              </span>
              <span className="text-[10px] text-sky-400/60 font-bold tracking-widest uppercase mt-0.5">Control Hub</span>
            </div>
          </div>

          <nav className="px-4 py-6 space-y-1">
            <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Management</p>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <a className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 relative group ${
                    isActive 
                      ? "bg-gradient-to-r from-sky-500 to-emerald-500 text-slate-950 shadow-md shadow-sky-400/10" 
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                  }`}>
                    <Icon className={`h-5 w-5 transition-transform duration-200 group-hover:scale-105 ${
                      isActive ? "text-slate-950" : "text-slate-400 group-hover:text-white"
                    }`} />
                    <span>{item.name}</span>
                    {isActive && (
                      <span className="absolute right-3.5 w-1.5 h-1.5 bg-slate-950 rounded-full" />
                    )}
                  </a>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/5">
          <Link href="/">
            <a className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group">
              <LogOut className="h-5 w-5 text-slate-400 group-hover:text-red-400 transition-colors" />
              <span>Exit Workspace</span>
            </a>
          </Link>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        <header className={`h-20 flex items-center justify-between px-10 z-30 transition-colors duration-300 border-b ${
          darkMode ? "bg-slate-900/60 border-slate-800/80 backdrop-blur-md shadow-xl" : "bg-white border-slate-200/80 shadow-sm"
        }`}>
          
          <div className="flex flex-col">
            <h1 className={`text-xl font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
              {getGreeting()}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Here's what's happening across your platform today.
            </p>
          </div>
          
          <div className="flex items-center gap-5 relative">
            
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl hidden lg:flex border ${
              darkMode ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-50 border-slate-200/60 text-slate-600"
            }`}>
              <Calendar className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-semibold">{formattedDate}</span>
            </div>

            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl transition-all border ${
                darkMode ? "bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700" : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600"
              }`}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* 🔔 Notification Trigger Container */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                className={`p-2 rounded-xl transition-all relative border ${
                  darkMode ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600"
                }`}
              >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900" />
                )}
              </button>

              {showNotifications && (
                <div className={`fixed right-4 md:right-16 top-16 w-84 rounded-2xl border p-4 shadow-2xl z-[9999] animate-in fade-in slide-in-from-top-3 duration-200 max-h-[420px] overflow-y-auto ${
                  darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-100 text-slate-800"
                }`}>
                  <div className="flex justify-between items-center mb-3 border-b pb-2 border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Updates Hub</h4>
                    <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">Live</span>
                  </div>
                  
                  <div className="space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-center text-slate-400 py-4 font-medium">No new notifications available</p>
                    ) : (
                      notifications.map((n: any) => {
                        const notifId = n._id || n.id || Math.random().toString();
                        const notifText = n.text || "No alert description available";
                        const notifType = n.type || "add";
                        const notifTime = n.createdAt || new Date().toISOString();

                        return (
                          <div key={notifId} className={`flex gap-3 items-start p-2.5 rounded-xl transition-colors relative ${
                            darkMode ? "bg-slate-800/40 hover:bg-slate-800/70" : "bg-slate-50 hover:bg-slate-100/80"
                          }`}>
                            
                            {/* Icon Wrapper */}
                            <div className="mt-0.5 shrink-0">
                              {notifType === "delete" && (
                                <div className="p-1 rounded-lg bg-rose-500/10 text-rose-500">
                                  <AlertCircle className="h-4 w-4" />
                                </div>
                              )}
                              {notifType === "update" && (
                                <div className="p-1 rounded-lg bg-amber-500/10 text-amber-500">
                                  <Edit3 className="h-4 w-4" />
                                </div>
                              )}
                              {notifType === "add" && (
                                <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-500">
                                  <CheckCircle2 className="h-4 w-4" />
                                </div>
                              )}
                            </div>

                            {/* English Content Area with right padding for safety */}
                            <div className="flex-1 min-w-0 pr-8">
                              <p className="text-xs font-semibold leading-normal text-slate-700 dark:text-slate-200 break-words text-left">
                                {notifText}
                              </p>
                              <span className="text-[10px] text-slate-400 mt-1 block font-medium text-left">
                                {formatTime(notifTime)}
                              </span>
                            </div>

                            {/* ❌ Always Visible Delete Action Button */}
                            <button
                              onClick={(e) => handleDeleteNotification(notifId, e)}
                              className="absolute right-2 top-3 p-1.5 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all duration-150 shrink-0"
                              title="Delete notification"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />

            {/* 👤 Admin Account Node */}
            <div className="relative" ref={profileMenuRef}>
              <div 
                onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
                className="flex items-center gap-3.5 group cursor-pointer"
              >
                <div className="text-right hidden sm:block">
                  <p className={`text-sm font-bold leading-tight ${darkMode ? "text-slate-200" : "text-slate-800"}`}>System Admin</p>
                  <p className="text-[11px] font-medium text-slate-400 mt-0.5">admin@careconnect.com</p>
                </div>
                <div className="h-10 w-10 rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-700 shadow-md transition-all group-hover:scale-105">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces" 
                    alt="Admin Avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {showProfileMenu && (
                <div className={`absolute right-0 mt-3 w-48 rounded-xl border p-1.5 shadow-xl z-50 ${
                  darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-100 text-slate-800"
                }`}>
                  <button className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg flex items-center gap-2 ${
                    darkMode ? "hover:bg-slate-800" : "hover:bg-slate-50"
                  }`}>
                    <User className="h-4 w-4 text-slate-400" /> Profile Dashboard
                  </button>
                  <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                  <Link href="/">
                    <button className={`w-full text-left px-3 py-2 text-xs font-medium text-red-500 rounded-lg flex items-center gap-2 ${
                      darkMode ? "hover:bg-red-950/20" : "hover:bg-red-50/50"
                    }`}>
                      <LogOut className="h-4 w-4" /> Logout Workspace
                    </button>
                  </Link>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* 3. SCROLLABLE ROUTE VIEW CONTAINER */}
        {/* 🔥 FIX: Center se generic white content box, border aur generic padding hata di gai hai taaki extra wrapper design kharab na kare */}
        <main className={`flex-1 overflow-y-auto p-10 transition-colors duration-300 ${
          darkMode ? "bg-slate-950" : "bg-slate-50/50"
        }`}>
          <div className="max-w-6xl mx-auto min-h-[calc(100vh-12rem)]">
            {children}
          </div>
        </main>
        
      </div>
    </div>
  );
}