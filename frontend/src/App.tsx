import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Game from "./pages/Game";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children, requireAdmin = false }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && user.role !== "ADMIN") {
    return <Navigate to="/" />;
  }

  return children;
}

function DefaultRoute() {
  const { user } = useAuth();

  if (user?.role === "ADMIN") {
    return <Navigate to="/admin" />;
  }

  return <Navigate to="/home" />;
}

function NonAdminRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role === "ADMIN") {
    return <Navigate to="/admin" />;
  }

  return children;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Default route */}
            <Route path="/" element={<DefaultRoute />} />

            {/* Protected routes - Non-admin only */}
            <Route
              path="/home"
              element={
                <NonAdminRoute>
                  <Home />
                </NonAdminRoute>
              }
            />

            <Route
              path="/game/:mapId"
              element={
                <NonAdminRoute>
                  <Game />
                </NonAdminRoute>
              }
            />

            {/* Admin only route */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
