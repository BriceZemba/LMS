
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SupabaseAuthProvider } from "@/hooks/useSupabaseAuth";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Pricing from "./pages/Pricing";
import FAQ from "./pages/FAQ";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CourseDetail from "./pages/CourseDetail";
import AdminPanel from "./pages/AdminPanel";
import CourseManagement from "./pages/CourseManagement";
import QuizManagement from "./pages/QuizManagement";
import PaidCourse from "./pages/PaidCourse";
import MesAchats from "./pages/MesAchats";
import NotFound from "./pages/NotFound";
import Error404 from "./pages/Error404";
import SupabaseAuth from "./pages/SupabaseAuth";
import CourseViewerEnhanced from "./components/course/CourseViewerEnhanced";
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseAuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/home" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/course/:courseId" element={<CourseDetail />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/course-management" element={<CourseManagement />} />
              <Route path="/quiz-management" element={<QuizManagement />} />
              <Route path="/paid-course" element={<PaidCourse />} />
              <Route path="/mes-achats" element={<MesAchats />} />
              <Route path="/supabase-auth" element={<SupabaseAuth />} />
              <Route path="/404" element={<Error404 />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SupabaseAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
