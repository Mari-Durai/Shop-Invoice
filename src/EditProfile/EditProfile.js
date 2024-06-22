

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './EditProfile.css';

function EditProfile() {
  const navigate = useNavigate();
  const [shopDetails, setShopDetails] = useState({
    shopName: '',
    shopAddress: '',
    shopPhone: '',
    email: '',
    gstin: '',
    logo: '',
  });

  useEffect(() => {
    const savedShopDetails = JSON.parse(localStorage.getItem('shopDetails'));
    if (savedShopDetails) {
      setShopDetails(savedShopDetails);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShopDetails({ ...shopDetails, [name]: value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setShopDetails({ ...shopDetails, logo: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    // if (!emailPattern.test(shopDetails.email)) {
    //   alert('Email is not properly entered. Please enter a valid email.');
    //   return;
    // }
    localStorage.setItem('shopDetails', JSON.stringify(shopDetails));

    navigate('/'); 
  };

  return (
    <div className="container mt-4 edit-profile">
      <header className="mb-4">
        <h1>Edit Shop Profile</h1>
      </header>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Shop Name:</label>
          <input
            type="text"
            name="shopName"
            value={shopDetails.shopName}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Shop Address:</label>
          <input
            type="text"
            name="shopAddress"
            value={shopDetails.shopAddress}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Shop Phone:</label>
          <input
            type="text"
            name="shopPhone"
            value={shopDetails.shopPhone}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email ID:</label>
          <input
            type="email"
            name="email"
            value={shopDetails.email}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">GSTIN:</label>
          <input
            type="text"
            name="gstin"
            value={shopDetails.gstin}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Logo:</label>
          <input type="file" onChange={handleLogoChange} className="form-control" />
        </div>
        {shopDetails.logo && <img src={shopDetails.logo} alt="Shop Logo" className="img-thumbnail" />}
        <button type="submit" className="btn btn-primary">Save</button>
      </form>
    </div>
  );
}

export default EditProfile;


