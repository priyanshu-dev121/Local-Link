import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Services from "./pages/Services";
import ProviderProfile from "./pages/ProviderProfile";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import VerifyOTP from "./pages/VerifyOTP";
import Dashboard from "./pages/Dashboard";
import ProviderDashboard from "./pages/ProviderDashboard";
import ServiceDetails from "./pages/ServiceDetails";
import HowItWorks from "./pages/HowItWorks";
import Centers from "./pages/Centers";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Terms from "./pages/Terms";
import AboutUs from "./pages/AboutUs";
import Press from "./pages/Press";
import { ChatBot } from "./components/ChatBot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/service/:id" element={<ServiceDetails />} />
          <Route path="/centers" element={<Centers />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/press" element={<Press />} />
          <Route path="/provider/:id" element={<ProviderProfile />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/booking/:serviceId" element={<Booking />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<VerifyOTP />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/provider-dashboard" element={<ProviderDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatBot />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
