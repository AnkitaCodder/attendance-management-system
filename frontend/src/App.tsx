import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import EnterpriseDashboard from "./pages/EnterpriseDashboard";
import EnterpriseEmployee from "./pages/EnterpriseEmployee";
import TeamDirectory from "./pages/TeamDirectory";
import Reports from "./pages/Reports";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <main className="flex-1 overflow-hidden">
              {/* Global Header */}
              <header className="h-14 border-b border-border/50 bg-gradient-surface flex items-center px-4 sticky top-0 z-50">
                <SidebarTrigger className="mr-4" />
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">Enterprise Dashboard</span>
                </div>
              </header>
              
              {/* Content Area */}
              <div className="h-[calc(100vh-3.5rem)] overflow-auto">
                <Routes>
                  <Route path="/" element={<EnterpriseDashboard />} />
                  <Route path="/team" element={<TeamDirectory />} />
                  <Route path="/employee/:employeeId" element={<EnterpriseEmployee />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="*" element={<EnterpriseDashboard />} />
                </Routes>
              </div>
            </main>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
