import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import { AuthProvider } from "@/context/AuthContext";
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

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route>
        <Layout>
          <Switch>
            <Route path="/" component={Index} />
            <Route path="/about" component={About} />
            <Route path="/services" component={Services} />
            <Route path="/symptom" component={Symptom} />
            <Route path="/doctors" component={Doctors} />
            <Route path="/appointments" component={Appointments} />
            <Route path="/emergency" component={Emergency} />
              <Route path="/account">
          <Redirect to="/account/profile" />
        </Route>
          <Route path="/account/profile" component={AccountProfile} />
        <Route path="/account/appointments" component={AccountAppointments} />
        <Route path="/account/prescriptions" component={AccountPrescriptions} />
        <Route path="/account/feedback" component={AccountFeedback} />
        <Route path="/account/settings" component={AccountSettings} />

            <Route path="/doctor/:id" component={DoctorProfile} />
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
