
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Registration from "./pages/Registration";
import Recognition from "./pages/Recognition";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import TabNavigation from "./components/TabNavigation";

const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-50">
    <Header />
    <div className="container mx-auto py-6">
      <TabNavigation className="mb-6" />
      {children}
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/registration" element={<Layout><Registration /></Layout>} />
          <Route path="/recognition" element={<Layout><Recognition /></Layout>} />
          <Route path="/chat" element={<Layout><Chat /></Layout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
