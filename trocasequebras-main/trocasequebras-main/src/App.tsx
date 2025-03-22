
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DataCapture from "./pages/DataCapture";
import MyEntries from "./pages/MyEntries";
import UserManagement from "./pages/UserManagement";
import ProductManagement from "./pages/ProductManagement";
import ApprovalList from "./pages/ApprovalList";
import NotFound from "./pages/NotFound";

// Novas páginas admin
import Reports from "./pages/admin/Reports";
import SystemSettings from "./pages/admin/SystemSettings";
import AuditLogs from "./pages/admin/AuditLogs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rotas Protegidas para Usuários Comuns */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/data-capture" element={
            <ProtectedRoute>
              <DataCapture />
            </ProtectedRoute>
          } />
          <Route path="/my-entries" element={
            <ProtectedRoute>
              <MyEntries />
            </ProtectedRoute>
          } />
          
          {/* Rotas Protegidas Apenas para Administradores */}
          <Route path="/user-management" element={
            <ProtectedRoute requireAdmin={true}>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="/product-management" element={
            <ProtectedRoute requireAdmin={true}>
              <ProductManagement />
            </ProtectedRoute>
          } />
          <Route path="/approval-list" element={
            <ProtectedRoute requireAdmin={true}>
              <ApprovalList />
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute requireAdmin={true}>
              <Reports />
            </ProtectedRoute>
          } />
          <Route path="/system-settings" element={
            <ProtectedRoute requireAdmin={true}>
              <SystemSettings />
            </ProtectedRoute>
          } />
          <Route path="/audit-logs" element={
            <ProtectedRoute requireAdmin={true}>
              <AuditLogs />
            </ProtectedRoute>
          } />
          
          {/* Redirecionar raiz para dashboard ou login */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Rota 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <Sonner />
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
