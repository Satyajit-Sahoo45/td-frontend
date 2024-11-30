import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import LoanForm from "./LoanForm";

const UserNav = () => {
  const { user, logout, setOpen } = useAuth();
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white font-bold text-xl">
          Loan App
        </Link>

        <div className="space-x-4">
          {user && (
            <>
              <button
                onClick={() => {
                  setOpen(true);
                }}
                className="text-white hover:text-gray-300"
              >
                Apply for Loan
              </button>
              <Link to="/my-loans" className="text-white hover:text-gray-300">
                My Loans
              </Link>
            </>
          )}
          {user ? (
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
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
      <LoanForm />
    </nav>
  );
};

export default UserNav;
