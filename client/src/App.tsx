import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Verify from "@/pages/verify";
import About from "@/pages/about";
import Services from "@/pages/services";
import Gallery from "@/pages/gallery";
import Research from "@/pages/research";
import Education from "@/pages/education";
import Contact from "@/pages/contact";
import StaffLoginPage from "@/pages/stafflogin";
import StaffDashboardPage from "@/pages/staff-dashboard";

function Router() {
  return (
    <Switch base="/AIGI-1">
      <Route path="/" component={Home} />
      <Route path="/verify" component={Verify} />
      <Route path="/about" component={About} />
      <Route path="/services" component={Services} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/research" component={Research} />
      <Route path="/education" component={Education} />
      <Route path="/contact" component={Contact} />
      <Route path="/stafflogin" component={StaffLoginPage} />
      <Route path="/staff/dashboard" component={StaffDashboardPage} />
      <Route path="/staff-dashboard" component={StaffDashboardPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
