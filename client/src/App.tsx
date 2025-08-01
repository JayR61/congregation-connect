
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { ThemeProvider } from "./context/ThemeContext";
import { SettingsProvider } from "./context/SettingsContext";
import Layout from "./components/layout/Layout";
import { initializeSecurity } from "./lib/security";
import React from "react";

// Pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import TaskDetail from "./pages/TaskDetail";
import Members from "./pages/Members";
import MemberDetail from "./pages/MemberDetail";
import Finance from "./pages/Finance";
import Documents from "./pages/Documents";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Mentorship from "./pages/Mentorship";
import Volunteers from "./pages/Volunteers";
import Resources from "./pages/Resources";
import SocialMedia from "./pages/SocialMedia";
import Programmes from "./pages/Programmes";
import Projects from "./pages/Projects";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  // Initialize security on app start
  React.useEffect(() => {
    initializeSecurity();
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <SettingsProvider>
          <AppProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout><Index /></Layout>} />
                <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
                <Route path="/tasks" element={<Layout><Tasks /></Layout>} />
                <Route path="/tasks/:id" element={<Layout><TaskDetail /></Layout>} />
                <Route path="/members" element={<Layout><Members /></Layout>} />
                <Route path="/members/:id" element={<Layout><MemberDetail /></Layout>} />
                <Route path="/finance" element={<Layout><Finance /></Layout>} />
                <Route path="/documents" element={<Layout><Documents /></Layout>} />
                <Route path="/mentorship" element={<Layout><Mentorship /></Layout>} />
                <Route path="/volunteers" element={<Layout><Volunteers /></Layout>} />
                <Route path="/resources" element={<Layout><Resources /></Layout>} />
                <Route path="/social-media" element={<Layout><SocialMedia /></Layout>} />
                <Route path="/programmes" element={<Layout><Programmes /></Layout>} />
                <Route path="/projects" element={<Layout><Projects /></Layout>} />
                <Route path="/settings" element={<Layout><Settings /></Layout>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AppProvider>
        </SettingsProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
