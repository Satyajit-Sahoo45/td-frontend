import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AdminLoanList = () => {
  const [loans, setLoans] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("PENDING");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLoans(currentCategory, currentPage);
  }, [currentCategory, currentPage]);

  const fetchLoans = async (category, page) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URI}/get-loans?status=${category}&page=${page}&pageSize=10`,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      const { loans, totalPages } = response.data;
      setLoans(loans);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching loans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (event) => {
    setCurrentCategory(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleStatusChange = async (loanId, newStatus) => {
    try {
      const response = await axios.put(
        "http://localhost:8000/api/update-loan-status",
        {
          loanId,
          status: newStatus,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );

      const updatedLoan = response.data;
      setLoans((prevLoans) =>
        prevLoans.map((loan) =>
          loan.id === updatedLoan.id ? updatedLoan : loan
        )
      );

      toast.success("Loan status updated successfully!");
    } catch (error) {
      console.error("Error updating loan status:", error);
      toast.error("Failed to update loan status.");
    }
  };

  const handleViewDetails = (loanId) => {
    navigate(`/request-loans/${loanId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5">
      <h1 className="text-3xl font-bold text-center mb-6">Manage Loans</h1>

      <div className="flex justify-center mb-6">
        <div className="relative">
          <select
            id="category"
            value={currentCategory}
            onChange={handleCategoryChange}
            className="px-6 py-2 bg-white text-gray-700 border-2 border-gray-300 rounded-lg shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="PAID">Paid</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="flex justify-center items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping animation-delay-200"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping animation-delay-400"></div>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full bg-white border-separate border-spacing-0 text-sm">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="px-6 py-3 text-left">Loan ID</th>
                <th className="px-6 py-3 text-left">User</th>
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">Term (months)</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {loans.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-3 text-center text-gray-500"
                  >
                    No loans found.
                  </td>
                </tr>
              ) : (
                loans.map((loan) => (
                  <tr
                    key={loan.id}
                    className="border-b hover:bg-gray-50 hover:cursor-pointer"
                    onClick={() => handleViewDetails(loan.id)}
                  >
                    <td className="px-6 py-3">{loan?.id}</td>
                    <td className="px-6 py-3">{loan?.user?.name}</td>
                    <td className="px-6 py-3">${loan?.amount}</td>
                    <td className="px-6 py-3">{loan?.term}</td>
                    <td className="px-6 py-3">{loan?.LoanStatus}</td>
                    <td className="px-6 py-3">
                      <select
                        value={loan.LoanStatus}
                        onChange={(e) =>
                          handleStatusChange(loan.id, e.target.value)
                        }
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="PAID">Paid</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <p className="text-lg">
          Page {currentPage} of {totalPages}
        </p>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminLoanList;
