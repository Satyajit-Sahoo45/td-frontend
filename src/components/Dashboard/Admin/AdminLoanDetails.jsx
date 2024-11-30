import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const AdminLoanDetails = () => {
  const { loanId } = useParams();
  const [loan, setLoan] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URI}/get-loan/${loanId}`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setLoan(response.data);
      })
      .catch((error) => {
        toast.error("Error fetching loan details:", error);
      });
  }, [loanId]);

  if (!loan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex justify-center items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping animation-delay-200"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping animation-delay-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Loan Details</h1>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Loan Information
          </h2>
          <div className="space-y-2">
            <p>
              <strong className="text-gray-600">User:</strong>{" "}
              {loan?.user?.name}
            </p>
            <p>
              <strong className="text-gray-600">User Email:</strong>{" "}
              {loan?.user?.email}
            </p>
            <p>
              <strong className="text-gray-600">Amount:</strong> ${loan.amount}
            </p>
            <p>
              <strong className="text-gray-600">Term:</strong> {loan.term} weeks
            </p>
            <p>
              <strong className="text-gray-600">Status:</strong>{" "}
              <span
                className={`px-3 py-1 rounded-full text-white ${
                  loan.LoanStatus === "PENDING"
                    ? "bg-yellow-400"
                    : loan.LoanStatus === "APPROVED"
                    ? "bg-green-500"
                    : "bg-blue-500"
                }`}
              >
                {loan.LoanStatus}
              </span>
            </p>
          </div>
        </div>

        {/* Repayments Table */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Scheduled Repayments
          </h2>
          <table className="min-w-full table-auto text-left text-sm">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="px-4 py-2">Sl. No</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Loan Status</th>
                <th className="px-4 py-2">Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {loan.scheduledRepayments.map((repayment, index) => (
                <tr
                  key={repayment.id}
                  className="border-t hover:bg-gray-50 transition-all"
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">${repayment.amount}</td>
                  <td className="px-4 py-2">
                    {new Date(repayment.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    {repayment.ScheduledRepaymentStatus}
                  </td>
                  <td className="px-4 py-2">
                    {repayment.ScheduledRepaymentStatus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminLoanDetails;
