import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const LoanForm = () => {
  const { open, setOpen } = useAuth();
  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URI}/apply-loan`,
        {
          userId: JSON.parse(localStorage.getItem("user")).id,
          amount: Number(amount),
          term: Number(term),
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Loan created successfully!");
      setOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating loan");
    } finally {
      setLoading(false);
      navigate("my-loans");
    }
  };

  return (
    <div>
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 transition-opacity duration-300">
          <div className="bg-white shadow-lg rounded-md p-8 w-full max-w-md transform transition-all duration-300 scale-100">
            <button
              onClick={() => setOpen(false)} // Close modal on click of the close button
              className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Apply for a Loan
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Amount ($)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Loan Term (weeks)
                </label>
                <input
                  type="number"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  required
                  min={1}
                  max={3}
                  placeholder="max 3 term allowed"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 text-white rounded-lg ${
                  loading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {loading ? "Submitting..." : "Apply"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanForm;
