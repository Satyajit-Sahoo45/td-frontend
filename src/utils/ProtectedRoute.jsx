import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (role && user?.role?.toUpperCase() !== role.toUpperCase()) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
