import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const AdminNav = () => {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-green-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/admin" className="text-white font-bold text-xl">
          Admin Dashboard
        </Link>
        <div className="space-x-4">
          {user ? (
            <>
              <Link
                to="/request-loans"
                className="text-white hover:text-gray-300"
              >
                Manage Loans
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 transition-all"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminNav;
