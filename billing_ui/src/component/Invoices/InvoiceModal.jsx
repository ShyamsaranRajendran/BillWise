import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import { BiCloudDownload } from "react-icons/bi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios"; // Import Axios for API requests
import "./InvoiceModal.css"; // Import the new CSS file

const GenerateInvoice = () => {
  html2canvas(document.querySelector("#invoiceCapture")).then((canvas) => {
    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: [612, 792],
    });
    pdf.internal.scaleFactor = 1;
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("invoice-001.pdf");
  });
};

const saveInvoice = async (
  info,
  items,
  total,
  subTotal,
  taxAmount,
  discountAmount,
  currency
) => {
  const invoiceData = {
    billFrom: info.billFrom,
    billTo: info.billTo,
    billFromAddress: info.billFromAddress,
    billToAddress: info.billToAddress,
    billFromEmail: info.billFromEmail,
    billToEmail: info.billToEmail,
    dateOfIssue: info.dateOfIssue,
    invoiceNumber: info.invoiceNumber,
    items: items,
    total: total,
    subTotal: subTotal,
    taxAmount: taxAmount,
    discountAmount: discountAmount,
    currency: currency,
    notes: info.notes,
  };

  try {
    const response = await axios.post(
      "http://localhost:5000/invoices/add",
      invoiceData
    );
    if (response.status === 201) {
      alert("Invoice saved successfully!");
    } else {
      alert("Failed to save the invoice.");
    }
  } catch (error) {
    console.error("Error saving invoice:", error);
    alert("An error occurred while saving the invoice.");
  }
};

const InvoiceModal = ({
  showModal,
  closeModal,
  info,
  currency,
  total,
  items,
  taxAmount,
  discountAmount,
  subTotal,
}) => {
  return (
    <div>
      <Modal show={showModal} onHide={closeModal} size="lg" centered>
        <div id="invoiceCapture" className="invoice-container">
          {/* Invoice Header */}
          <div className="invoice-header">
            <div>
              <h4 className="fw-bold my-2">
                {info.billFrom || "John Uberbacher"}
              </h4>
              <h6 className="fw-bold text-secondary mb-1">
                Invoice Number: {info.invoiceNumber || ""}
              </h6>
            </div>
            <div className="amount-due">
              <h6 className="fw-bold mt-1 mb-2">Amount Due:</h6>
              <h5 className="fw-bold text-secondary">
                {currency} {total}
              </h5>
            </div>
          </div>
          {/* Invoice Body */}
          <div className="invoice-body">
            <Row className="mb-4">
              <Col md={4}>
                <div className="fw-bold">Billed From:</div>
                <div>{info.billFrom || ""}</div>
                <div>{info.billFromAddress || ""}</div>
                <div>{info.billFromEmail || ""}</div>
              </Col>
              <Col md={4}>
                <div className="fw-bold">Billed to:</div>
                <div>{info.billTo || ""}</div>
                <div>{info.billToAddress || ""}</div>
                <div>{info.billToEmail || ""}</div>
              </Col>
              <Col md={4}>
                <div className="fw-bold mt-2">Date Of Issue:</div>
                <div>{info.dateOfIssue || ""}</div>
              </Col>
            </Row>
            <Table className="invoice-table mb-0">
              <thead>
                <tr>
                  <th>QTY</th>
                  <th>DESCRIPTION</th>
                  <th className="text-end">PRICE</th>
                  <th className="text-end">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td className="quantity-cell">{item.quantity}</td>
                      <td>
                        {item.name} - {item.description}
                      </td>
                      <td className="text-end price-cell">
                        {currency} {item.price}
                      </td>
                      <td className="text-end amount-cell">
                        {currency} {item.price * item.quantity}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <Table className="invoice-summary">
              <tbody>
                <tr className="text-end">
                  <td></td>
                  <td className="fw-bold">SUBTOTAL</td>
                  <td className="text-end">
                    {currency} {subTotal}
                  </td>
                </tr>
                {taxAmount !== 0.0 && (
                  <tr className="text-end">
                    <td></td>
                    <td className="fw-bold">TAX</td>
                    <td className="text-end">
                      {currency} {taxAmount}
                    </td>
                  </tr>
                )}
                {discountAmount !== 0.0 && (
                  <tr className="text-end">
                    <td></td>
                    <td className="fw-bold">DISCOUNT</td>
                    <td className="text-end">
                      {currency} {discountAmount}
                    </td>
                  </tr>
                )}
                <tr className="text-end">
                  <td></td>
                  <td className="fw-bold">TOTAL</td>
                  <td className="text-end">
                    {currency} {total}
                  </td>
                </tr>
              </tbody>
            </Table>
            {info.notes && <div className="invoice-notes">{info.notes}</div>}
          </div>
        </div>
        {/* Invoice Footer */}
        <div className="invoice-footer">
          <Row>
            <Col md={6}>
              <Button
                variant="success"
                className="invoice-save-btn"
                onClick={() =>
                  saveInvoice(
                    info,
                    items,
                    total,
                    subTotal,
                    taxAmount,
                    discountAmount,
                    currency
                  )
                }
              >
                Save Invoice
              </Button>
            </Col>
            <Col md={6}>
              <Button
                variant="outline-primary"
                className="invoice-download-btn"
                onClick={GenerateInvoice}
              >
                <BiCloudDownload
                  style={{ width: "16px", height: "16px", marginTop: "-3px" }}
                  className="me-2"
                />
                Download Copy
              </Button>
            </Col>
          </Row>
        </div>
      </Modal>
    </div>
  );
};

export default InvoiceModal;
