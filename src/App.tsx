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

/**
 * Auth check (simulé).
 * On considère l'utilisateur connecté si :
 *  - localStorage['app:auth'] === "true"
 *  - ou localStorage['app:auth_user'] est présent
 */
function isAuthenticated(): boolean {
  try {
    if (localStorage.getItem("app:auth") === "true") return true;
    if (localStorage.getItem("app:auth_user")) return true;
    return false;
  } catch {
    return false;
  }
}

/** Route protégée : redirige vers /login si non connecté */
function ProtectedRoute({ children }: { children: JSX.Element }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

/** Simple route de logout (efface le localStorage et redirige) */
function Logout() {
  try {
    localStorage.removeItem("app:auth");
    localStorage.removeItem("app:auth_user");
  } catch {}
  return <Navigate to="/login" replace />;
}

const App: React.FC = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Page de login publique */}
            <Route path="/login" element={<Login />} />

            {/* Route principale protégée */}
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

export default App;
