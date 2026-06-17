import { useQuery } from "@tanstack/react-query";
import { Users, UserCheck, Activity, Layers, Award } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

// Data fetching function
const fetchDashboardStats = async () => {
  const res = await fetch("http://localhost:5000/api/admin/dashboard-stats"); // Apni backend port ke hisab se adjust karein
  if (!res.ok) throw new Error("Failed to fetch dashboard stats");
  return res.json();
};

export default function AdminDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["adminStats"],
    queryFn: fetchDashboardStats,
  });

  if (isLoading) return <div className="text-center py-10 font-medium">Loading Dashboard Data...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error loading dashboard data!</div>;

  const { summary, chartData } = data;

  // Stats cards data mapping
  const stats = [
    { title: "Total Users", value: summary.totalUsers, icon: Users, color: "bg-indigo-50 text-indigo-600" },
    { title: "Active Doctors", value: summary.totalDoctors, icon: UserCheck, color: "bg-blue-50 text-blue-600" },
    { title: "Symptoms Tracked", value: summary.totalSymptoms, icon: Activity, color: "bg-emerald-50 text-emerald-600" },
    { title: "Categories", value: summary.totalCategories, icon: Layers, color: "bg-amber-50 text-amber-600" },
    { title: "Specialties", value: summary.totalSpecialties, icon: Award, color: "bg-rose-50 text-rose-600" },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#f43f5e"];

  return (
    <div className="space-y-8">
      {/* Welcome Heading */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Welcome Back, Admin!</h2>
        <p className="text-sm text-slate-500">Here's what's happening across your platform today.</p>
      </div>

      {/* Grid of Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts & Analytical Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Platform Overview</h3>
            <p className="text-xs text-slate-400">Comparison of data available across medical entities</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "none", color: "#fff" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Bar dataKey="total" radius={[6, 6, 0, 0]} barSize={45}>
                  {chartData.map((entry:any, index:any) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Health / Quick Action Info Card */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">System Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-xs text-slate-400">Database</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">Connected</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-xs text-slate-400">Server Port</span>
                <span className="text-xs text-slate-300 font-mono">5000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">CORS Policy</span>
                <span className="text-xs text-blue-400 font-mono">Development (*)</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-800 mt-6">
            <p className="text-xs text-slate-300 leading-relaxed">
              💡 **Tip:** Use the sidebar menu to instantly add new data models or modify existing operational tables.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}