import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import { AuthProvider, useAuth } from "@/context/AuthContext"; // useAuth import kiya
import NotFound from "@/pages/not-found";

import Index from "@/pages";
import About from "@/pages/about";
import Services from "@/pages/services";
import Symptom from "@/pages/symptom";
import Doctors from "@/pages/doctors";
import Appointments from "@/pages/appointments";
import AccountProfile from "@/pages/account/profile";
import AccountAppointments from "@/pages/account/appointments";
import AccountPrescriptions from "@/pages/account/prescriptions";
import AccountFeedback from "@/pages/account/feedback";
import AccountSettings from "@/pages/account/settings";
import DoctorProfile from "@/pages/doctor-profile";
import Emergency from "@/pages/emergency";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import AdminDashboard from "@/pages/admin/index";
import AddDoctor from "@/pages/admin/AddDoctor";
import symptomAdmin from "@/pages/admin/SymptomAdmin";
import categoryAdd from "@/pages/admin/CategoryAdd";
import SpecialtyAdmin from "@/pages/admin/SpecialtyAdmin";
import { AdminLayout } from "./components/AdminLayout";

const queryClient = new QueryClient();

// PROTECTED ROUTE COMPONENT
// 1. Updated ProtectedRoute with Modern Design
function ProtectedRoute({ component: Component, ...rest }: any) {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-sky-100/50 border border-gray-100 p-8 text-center space-y-6">
          {/* Icon Section */}
          <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto">
            <span className="text-3xl">🔐</span>
          </div>
          
          {/* Text Section */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Authentication Required</h2>
            <p className="text-gray-500">
              Please login or register to access this page and continue with your health journey.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <a href="/login" className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold transition-all">
              Login to your account
            </a>
            <a href="/register" className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold transition-all">
              Create an account
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <Component {...rest} />;
}
function Router() {
  return (
    <Switch>
      {/* Admin Routes */}
      <Route path="/admin/:subpath*">
        <AdminLayout>
          <Switch>
            <Route path="/admin/index" component={AdminDashboard} />
            <Route path="/admin/add-doctor" component={AddDoctor} />
            <Route path="/admin/symptom" component={symptomAdmin} />
            <Route path="/admin/category-add" component={categoryAdd} />
            <Route path="/admin/specialty-admin" component={SpecialtyAdmin} />
            <Route component={NotFound} />
          </Switch>
        </AdminLayout>
      </Route>

      {/* Public & Protected Main Routes */}
      <Route>
        <Layout>
          <Switch>
            <Route path="/" component={Index} />
            <Route path="/about" component={About} />
            <Route path="/services" component={Services} />
            <Route path="/login" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />

            {/* Protected Routes - Yahan wrap kar diya hai */}
            <Route path="/appointments" component={() => <ProtectedRoute component={Appointments} />} />
             <Route path="/symptom" component={() => <ProtectedRoute component={Symptom} />} />
              <Route path="/doctors" component={() => <ProtectedRoute component={Doctors} />} />
              <Route path="/doctor/:id" component={() => <ProtectedRoute component={DoctorProfile} />} />
                   <Route path="/emergency" component={() => <ProtectedRoute component={Emergency} />} />
            <Route path="/account">
               <Redirect to="/account/profile" />
            </Route>

            <Route path="/account/profile" component={() => <ProtectedRoute component={AccountProfile} />} />
            <Route path="/account/appointments" component={() => <ProtectedRoute component={AccountAppointments} />} />
            <Route path="/account/prescriptions" component={() => <ProtectedRoute component={AccountPrescriptions} />} />
            <Route path="/account/feedback" component={() => <ProtectedRoute component={AccountFeedback} />} />
            <Route path="/account/settings" component={() => <ProtectedRoute component={AccountSettings} />} />

            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;