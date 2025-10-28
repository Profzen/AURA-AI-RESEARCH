// src/App.tsx
import "./lib/i18n";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

const queryClient = new QueryClient();

/** small util: consider user authenticated if localStorage flag or an auth_user exists */
function isAuthenticated(): boolean {
  try {
    if (localStorage.getItem("app:auth") === "true") return true;
    if (localStorage.getItem("app:auth_user")) return true;
  } catch (_) {}
  return false;
}

/** Route wrapper for protected routes */
function ProtectedRoute({ children }: { children: JSX.Element }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

/** simple logout route */
function Logout() {
  try {
    localStorage.removeItem("app:auth");
    localStorage.removeItem("app:auth_user");
  } catch (_) {}
  return <Navigate to="/login" replace />;
}

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public */}
              <Route path="/login" element={<Login />} />

              {/* Protected main route */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />

              {/* Logout helper */}
              <Route path="/logout" element={<Logout />} />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
