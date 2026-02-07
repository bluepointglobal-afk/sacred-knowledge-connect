import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { OfflineBanner } from "@/components/OfflineBanner";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import Matching from "./pages/Matching";
import Teachers from "./pages/Teachers";
import TeacherProfile from "./pages/TeacherProfile";
import Bundles from "./pages/Bundles";
import BundleDetail from "./pages/BundleDetail";
import Business from "./pages/Business";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EnrollmentDetail from "./pages/EnrollmentDetail";
import HowItWorks from "./pages/HowItWorks";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Offline from "./pages/Offline";
import TeacherEarnings from "./pages/TeacherEarnings";
import EscrowDashboard from "./pages/EscrowDashboard";
import BecomeTeacher from "./pages/BecomeTeacher";
import TeacherCourseNew from "./pages/TeacherCourseNew";
import TeacherCourseAvailability from "./pages/TeacherCourseAvailability";
import SmartMatching from "./pages/SmartMatching";
import Halaqahs from "./pages/Halaqahs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <OfflineBanner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/matching" element={<Matching />} />
            <Route path="/smart-matching" element={<SmartMatching />} />
            <Route path="/halaqahs" element={<Halaqahs />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/teachers/:id" element={<TeacherProfile />} />
            <Route path="/bundles" element={<Bundles />} />
            <Route path="/bundles/:id" element={<BundleDetail />} />
            <Route path="/business" element={<Business />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/enrollments/:id" element={<EnrollmentDetail />} />
            <Route path="/become-teacher" element={<BecomeTeacher />} />
            <Route path="/teacher/courses/new" element={<TeacherCourseNew />} />
            <Route path="/teacher/courses/:id/availability" element={<TeacherCourseAvailability />} />
            <Route path="/teacher/earnings" element={<TeacherEarnings />} />
            <Route path="/escrow" element={<EscrowDashboard />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/offline" element={<Offline />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
