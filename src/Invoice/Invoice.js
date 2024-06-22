import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Invoice.css';

function Invoice() {
  const location = useLocation();
  const [invoiceData,setInvoiceData] = useState({ products:[]});
  const [shopDetails,setShopDetails] = useState({});



  useEffect(() => {
    const data = location.state || { products: [] }; 
    const savedShopDetails = JSON.parse(localStorage.getItem('shopDetails')) || {};
    setInvoiceData(data);
    setShopDetails(savedShopDetails);
  }, [location.state]);


  const getTotalAmount = () => {
    return invoiceData.products.reduce((total, product) => {
      const unitPrice = parseFloat(product.unitPrice) || 0;
      const gst = unitPrice * 0.18;
      const cgst = unitPrice * 0.13;
      return total + ((unitPrice + gst + cgst) * product.quantity);
    }, 0).toFixed(2);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatShopAddress = (address) => {
    if (!address) return '';
    const parts = address.split(',');
    const firstLine = parts.slice(0, 2).join(', '); 
    const restLines = parts.slice(2).map(part => part.trim()).join('<br />');
    return `${firstLine}<br />${restLines}`;
  };

  // const convertNumberToWords = (num) => {
  
// };

  return (
    <div className="container mt-4 invoice">
      <header className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          {shopDetails.logo && <img src={shopDetails.logo} alt="Maris Agencies" className="invoice-logo me-3" />}
          <h1 className="mb-0">{shopDetails.shopName}</h1>
        </div>
        <div className="text-end shop-details">
          <table>
            <tbody>
              <tr>
                <td><strong>Address:</strong></td>
                <td dangerouslySetInnerHTML={{ __html: formatShopAddress(shopDetails.shopAddress) }} />
              </tr>
              <tr>
                <td><strong>Ph.no:</strong></td>
                <td>{shopDetails.shopPhone}</td>
              </tr>
              <tr>
                <td><strong>Email:</strong></td>
                <td>{shopDetails.email}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </header>
      <div className="invoice-content">
        <h2>Invoice</h2>
        <div className="mb-3">
          <p><strong>Name:</strong> {invoiceData.customerName}</p>
          <p><strong>Address:</strong> {invoiceData.address}</p>
          <p><strong>Phone:</strong> {invoiceData.phone}</p>
          <p><strong>GstIN:</strong> {shopDetails.gstin}</p>
        </div>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Product</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>GST</th>
              <th>CGST</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.products.map((product, index) => {
              const unitPrice = parseFloat(product.unitPrice) || 0;
              const gst = unitPrice * 0.18;
              const cgst = unitPrice * 0.13;
              const totalAmount = ((unitPrice + gst + cgst) * product.quantity).toFixed(2);
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.branch}</td>
                  <td>{product.model}</td>
                  <td>{product.quantity}</td>
                  <td>₹{unitPrice.toFixed(2)}</td>
                  <td>₹{gst.toFixed(2)}</td>
                  <td>₹{cgst.toFixed(2)}</td>
                  <td>₹{totalAmount}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="text-end">
          <h3>Total Amount: ₹{getTotalAmount()}</h3>
          {/* <p>In words: {convertNumberToWords(parseFloat(getTotalAmount()))}</p> */}
        </div>
        <button className="btn btn-primary" onClick={handlePrint}>Print Invoice</button>
      </div>
    </div>
  );
}

export default Invoice;
