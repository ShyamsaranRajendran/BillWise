import React, { useEffect, useState } from "react";
import "./css/payment.css";
import axios from "axios"; // Ensure axios is installed

function Payment() {
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

   const handleDownload = async (invoiceId) => {
     try {
       const response = await axios.get(
         `http://localhost:5000/sales/invoice/${invoiceId}`,
         {
           responseType: "blob", // Important for handling binary data
         }
       );

       // Create a URL for the blob
       const url = window.URL.createObjectURL(
         new Blob([response.data], { type: "application/pdf" })
       );

       // Create a link element
       const link = document.createElement("a");
       link.href = url;
       link.setAttribute("download", `invoice_${invoiceId}.pdf`); // Filename

       // Append to the document and trigger click
       document.body.appendChild(link);
       link.click();

       // Clean up
       link.parentNode.removeChild(link);
       window.URL.revokeObjectURL(url);
     } catch (err) {
       console.error("Error downloading invoice:", err);
       alert("Failed to download the invoice. Please try again.");
     }
   };
   
  useEffect(() => {
    const fetchPaymentData = async () => {
      try {

        const response = await axios.get("http://localhost:5000/sales/payment"); // Adjust the URL if necessary
        setPaymentData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching payment data:", err);
        setError("Failed to load payment data.");
        setLoading(false);
      }
    };

    fetchPaymentData();
  }, []);

  if (loading) return <div>Loading payment information...</div>;
  if (error) return <div>{error}</div>;

  const {
    currentPayment,
    lastPayment,
    cardDetails,
    pricingCalculator,
    invoices,
  } = paymentData;

  return (
    <div className="payment-page">
      <div className="payment-header">
        <h1>Payment</h1>
        <button className="change-plan-button">Change Plan</button>
      </div>

      <div className="payment-cards">
        <div className="card payment-info">
          <h2>So far</h2>
          <h3>₹.{currentPayment.amount}</h3>
          <p>Your profit</p>

          <span>on {currentPayment.dueDate}</span>
        </div>
        <div className="card payment-info">
          <h2>Last month</h2>
          <h3>₹.{lastPayment.amount}</h3>
          <p> Your Profit</p>
          <span>on {lastPayment.paidDate}</span>
        </div>
        <div className="card payment-info">
          <h2>Card details</h2>
          <p>{cardDetails.cardNumber}</p>
          <a href="#">Change card</a>
        </div>
        <div className="card payment-info">
          <h2>Pricing Calculator</h2>
          <p>{pricingCalculator.description}</p>
          <a href={pricingCalculator.link}>Calculate it</a>
        </div>
      </div>

      <div className="payment-history-section">
        <div className="payment-header">
          <h2>Payment history and invoicing</h2>
          <button className="download-all-button">Download All</button>
        </div>
        <table className="payment-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Invoice</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.date}</td>
                <td>{invoice.amount}</td>
                <td>{invoice.plan}</td>
                <td className="status paid">{invoice.status}</td>
                <td>
                  <button
                    className="download-invoice"
                    onClick={() => handleDownload(invoice.id)}
                  >
                    Download Invoice
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Payment;
