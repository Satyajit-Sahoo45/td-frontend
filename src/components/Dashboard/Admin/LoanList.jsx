import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const LoanList = () => {
  const [loans, setLoans] = useState([]);

  const fetchLoans = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URI}/loans`
      );
      setLoans(response.data);
    } catch (error) {
      console.error("Error fetching loans", error);
    }
  };

  const approveLoan = async (loanId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_SERVER_URI}/loans/${loanId}/approve`
      );
      toast.success("Loan approved!");
      fetchLoans();
    } catch (error) {
      toast.error("Error approving loan", error);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Loan Management</h1>
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg">
        <table className="table-auto w-full text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Term</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan._id} className="border-t">
                <td className="px-4 py-2">{loan.userId}</td>
                <td className="px-4 py-2">${loan.amount}</td>
                <td className="px-4 py-2">{loan.term} weeks</td>
                <td className="px-4 py-2">{loan.state}</td>
                <td className="px-4 py-2">
                  {loan.state === "PENDING" && (
                    <button
                      onClick={() => approveLoan(loan._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoanList;
