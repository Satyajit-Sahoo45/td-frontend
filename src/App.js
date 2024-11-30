import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./components/Dashboard/Admin/AdminDashboard";
import UserDashboard from "./components/Dashboard/User/UserDashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./utils/ProtectedRoute";
import UserNav from "./components/Dashboard/User/UserNav";
import AdminNav from "./components/Dashboard/Admin/AdminNav";
import LoanList from "./components/Dashboard/User/LoanList";
import { Toaster } from "react-hot-toast";
import LoanDetails from "./components/Dashboard/User/LoanDetails";
import AdminLoanList from "./components/Dashboard/Admin/AdminLoanList";
import AdminLoanDetails from "./components/Dashboard/Admin/AdminLoanDetails";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

const AppContent = () => {
  const { user } = useAuth();

  return (
    <>
      {user?.role === "ADMIN" ? <AdminNav /> : <UserNav />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/request-loans"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminLoanList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/request-loans/:loanId"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminLoanDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user"
          element={
            <ProtectedRoute role="USER">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-loans"
          element={
            <ProtectedRoute role="USER">
              <LoanList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/loan-details/:loanId"
          element={
            <ProtectedRoute role="USER">
              <LoanDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            user?.role === "ADMIN" ? <AdminDashboard /> : <UserDashboard />
          }
        />
      </Routes>
      <Toaster position="bottom-right" reverseOrder={false} />
    </>
  );
};

export default App;
