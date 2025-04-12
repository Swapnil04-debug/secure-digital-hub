
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import AccountDetail from "./pages/AccountDetail";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
import Contact from "./pages/Contact";
import DatabaseUsers from "./pages/DatabaseUsers";
import Services from "./pages/Services";
import PersonalBanking from "./pages/PersonalBanking";
import BusinessBanking from "./pages/BusinessBanking";
import Loans from "./pages/Loans";
import Investments from "./pages/Investments";
import ApplicationStatus from "./pages/ApplicationStatus";
import { AuthProvider } from "./context/AuthContext";
import { BankProvider } from "./context/BankContext";
import { TooltipProvider } from "@radix-ui/react-tooltip";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BankProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/accounts/:id" element={<AccountDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/database-users" element={<DatabaseUsers />} />
              <Route path="/services" element={<Services />} />
              <Route path="/personal-banking" element={<PersonalBanking />} />
              <Route path="/business-banking" element={<BusinessBanking />} />
              <Route path="/loans" element={<Loans />} />
              <Route path="/investments" element={<Investments />} />
              <Route path="/application-status" element={<ApplicationStatus />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </BankProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
