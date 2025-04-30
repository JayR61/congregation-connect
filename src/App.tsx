
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { ThemeProvider } from "./context/ThemeContext";
import { SettingsProvider } from "./context/SettingsContext";
import Layout from "./components/layout/Layout";
import { 
  mockMembers, mockTasks, mockProgrammes, mockTransactions, 
  mockFinanceCategories, mockDocuments, mockFolders, mockNotifications, 
  mockTaskCategories, mockAttendance, mockResources, mockCategories, 
  mockTags, mockProgrammeTags, mockFeedback, mockKpis, mockReminders, 
  mockTemplates, mockCurrentUser 
} from './data/mockData';

// Pages
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

// Initialize with a default user
const defaultUser = mockCurrentUser;

// Save the default user to localStorage if no user exists
if (!localStorage.getItem('currentUser')) {
  localStorage.setItem('currentUser', JSON.stringify(defaultUser));
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <SettingsProvider>
          <AppProvider 
            initialMembers={mockMembers}
            initialTasks={mockTasks}
            initialProgrammes={mockProgrammes}
            initialTransactions={mockTransactions}
            initialFinanceCategories={mockFinanceCategories}
            initialDocuments={mockDocuments}
            initialFolders={mockFolders}
            initialNotifications={mockNotifications}
            initialCurrentUser={defaultUser}
            initialTaskCategories={mockTaskCategories}
            initialAttendance={mockAttendance}
            initialResources={mockResources}
            initialCategories={mockCategories}
            initialTags={mockTags}
            initialProgrammeTags={mockProgrammeTags}
            initialFeedback={mockFeedback}
            initialKpis={mockKpis}
            initialReminders={mockReminders}
            initialTemplates={mockTemplates}
          >
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout><Dashboard /></Layout>} />
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

export default App;
