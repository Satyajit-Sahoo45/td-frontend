import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaShareFromSquare } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LoanList = () => {
  const [loans, setLoans] = useState([]);
  const userId = JSON.parse(localStorage.getItem("user")).id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUserLoans = async () => {
      if (userId) {
        setLoading(true);
        await axios
          .get(
            `${process.env.REACT_APP_SERVER_URI}/get-user-loans?userId=${userId}`,
            {
              headers: {
                Authorization: `${localStorage.getItem("token")}`,
              },
            }
          )
          .then((response) => {
            setLoans(response.data);
          })
          .catch((error) => {
            toast.error("no data available: " + error.response.data.message);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    };

    if (userId) {
      getUserLoans();
    }
  }, [userId]);

  const getStateClass = (state) => {
    switch (state) {
      case "PENDING":
        return "bg-yellow-500 text-white";
      case "APPROVED":
        return "bg-green-500 text-white";
      case "PAID":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-300 text-black";
    }
  };

  const handleViewDetails = (loanId) => {
    navigate(`/loan-details/${loanId}`);
  };

  if (loading) {
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

  if (loans.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-lg font-semibold text-gray-600">
          No data available
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Your Loans</h1>
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg">
        <table className="table-auto w-full text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Sl. No</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Term</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
              <th className="px-4 py-2">Read More</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan, index) => (
              <tr key={loan._id} className="border-t text-start">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">${loan.amount}</td>
                <td className="px-4 py-2">{loan.term} weeks</td>
                <td className="px-4 py-2">{loan.LoanStatus}</td>
                <td className="px-4 py-2">
                  <span
                    className={` ${getStateClass(
                      loan.LoanStatus
                    )} text-white px-3 py-1 rounded`}
                  >
                    {loan.LoanStatus}
                  </span>
                </td>
                <td
                  className="px-4 py-2 text-center flex justify-center items-center"
                  onClick={() => handleViewDetails(loan.id)}
                >
                  <FaShareFromSquare className="text-blue-700" />
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
