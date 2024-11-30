import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const LoanDetails = () => {
  const { loanId } = useParams();
  const [loan, setLoan] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URI}/get-loan-details/${loanId}`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setLoan(response.data);
      });
  }, [loanId]);

  const handlePay = async (repaymentId) => {
    await axios
      .post(
        `${process.env.REACT_APP_SERVER_URI}/pay-repayment/${repaymentId}`,
        {},
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      )
      .then(async (response) => {
        toast.success("Payment successful!");
        await axios
          .get(
            `${process.env.REACT_APP_SERVER_URI}/get-loan-details/${loanId}`,
            {
              headers: {
                Authorization: `${localStorage.getItem("token")}`,
              },
            }
          )
          .then((response) => {
            setLoan(response.data);
          });
      })
      .catch((error) => {
        toast.error("Payment failed: " + error.response.data.error);
      });

    await axios
      .put(
        `${process.env.REACT_APP_SERVER_URI}/loan/${loanId}/mark-paid`,
        {},
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      )
      .catch((error) => {
        toast.error("Could not update status: " + error.response.data.error);
      });
  };

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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Loan Details</h1>
        <div className="mb-4">
          <p>
            <strong>Loan ID:</strong> {loan.id}
          </p>
          <p>
            <strong>Amount:</strong> ${loan.amount}
          </p>
          <p>
            <strong>Term:</strong> {loan.term} weeks
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`px-3 py-1 rounded ${
                loan.LoanStatus === "PENDING"
                  ? "bg-yellow-500 text-white"
                  : loan.LoanStatus === "APPROVED"
                  ? "bg-green-500 text-white"
                  : "bg-blue-500 text-white"
              }`}
            >
              {loan.LoanStatus}
            </span>
          </p>
        </div>

        {loan.LoanStatus === "PENDING" ? (
          <p className="text-yellow-500">
            Scheduled repayments will activate after approval.
          </p>
        ) : (
          <div>
            <h2 className="text-lg font-bold mb-2">Scheduled Repayments</h2>
            <table className="table-auto w-full text-left">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2">Sl. No</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Loan Status</th>
                  <th className="px-4 py-2">Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {loan.scheduledRepayments.map((repayment, index) => (
                  <tr key={repayment.id} className="border-t">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">${repayment.amount}</td>
                    <td className="px-4 py-2">
                      {new Date(repayment.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      {repayment.ScheduledRepaymentStatus}
                    </td>
                    <td className="px-4 py-2">
                      {repayment.ScheduledRepaymentStatus === "PENDING" ? (
                        <button
                          onClick={() => handlePay(repayment.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Pay
                        </button>
                      ) : (
                        <span className="text-gray-500">Paid</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanDetails;
