import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IonIcon } from '@ionic/react';
import { pencil } from 'ionicons/icons';
import './BillingForm.css';

function BillingForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: '',
    address: '',
    phone: '',
    products: [],
  });

  const [shopDetails, setShopDetails] = useState({
    shopName: 'Maris Agencies',
    shopAddress: '123 Main Street, City, Country',
    shopPhone: '123-456-7890',
    shopEmail: 'shop@example.com',
    logo: 'logo.png',
  });

  const [productsData, setProductsData] = useState([]);
  const [isProductSectionVisible, setProductSectionVisible] = useState(false);

  useEffect(() => {
    const savedShopDetails = JSON.parse(localStorage.getItem('shopDetails'));
    if (savedShopDetails) {
      setShopDetails(savedShopDetails);
    }

    fetch('../../db.json') 
      .then(response => response.json())
      .then(data => setProductsData(data.home_appliances));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: value,
    };
    if (field === 'name') {
      updatedProducts[index].branch = ''; 
      updatedProducts[index].model = '';  
      updatedProducts[index].unitPrice = 0; 
    } else if (field === 'branch') {
      updatedProducts[index].model = '';  
      updatedProducts[index].unitPrice = 0; 
    } else if (field === 'model') {
      const selectedProduct = productsData.find(p => p.product_name === updatedProducts[index].name);
      const selectedBrand = selectedProduct.brands.find(b => b.brand_name === updatedProducts[index].branch);
      const selectedModel = selectedBrand.models.find(m => m.model === value);
      updatedProducts[index].unitPrice = selectedModel ? selectedModel.price : 0;
    }
    setFormData({ ...formData, products: updatedProducts });
  };

  const isProductComplete = (product) => {
    return product.name && product.branch && product.model && product.quantity;
  };

  const addProduct = () => {
    const lastProduct = formData.products[formData.products.length - 1];
    if (formData.products.length === 0 || isProductComplete(lastProduct)) {
      setFormData({
        ...formData,
        products: [...formData.products, { name: '', branch: '', model: '', quantity: 1, unitPrice: 0 }],
      });
      setProductSectionVisible(true); 
    } else {
      alert('Please complete the current product selection before adding another.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.products.length === 0) {
      alert('Please add at least one product before submitting the bill.');
      return;
    }
    const incompleteProduct = formData.products.find(product => !isProductComplete(product));
    if (incompleteProduct) {
      alert('Please complete all product selections before submitting the bill.');
      return;
    }
    localStorage.setItem('invoiceData', JSON.stringify(formData));
    navigate('/invoice', { state: formData }); 
  };

  const getProductBrands = (productName) => {
    const product = productsData.find(item => item.product_name === productName);
    return product ? product.brands : [];
  };

  const getProductModels = (productName, brandName) => {
    const brands = getProductBrands(productName);
    const brand = brands.find(b => b.brand_name === brandName);
    return brand ? brand.models : [];
  };

  return (
    <div className="container mt-4 billing-form">
      <header className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <img src={shopDetails.logo} alt="Maris Agencies" className="mr-3" />
          <h1>{shopDetails.shopName}</h1>
        </div>
        <div className="d-flex flex-column align-items-end">
          <button className="btn btn-primary" onClick={() => navigate('/edit-profile')}>
            <IonIcon icon={pencil} /> Edit
          </button>
        </div>
      </header>
      <form onSubmit={handleSubmit}>
        <h2 className='billing-heading'>Billing Form</h2>
        <div className="mb-3">
          <label className="form-label">Customer Name:</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone Number:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        {isProductSectionVisible && (
          <h3 className='product-text'>Products</h3>
        )}
        {formData.products.map((product, index) => (
          <div key={index} className="row mb-3 product-row">
            <div className="col">
              <label className="form-label">Product:</label>
              <select
                value={product.name}
                onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                className="form-select"
              >
                <option value="">Select Product</option>
                {productsData.map((prod, i) => (
                  <option key={i} value={prod.product_name}>{prod.product_name}</option>
                ))}
              </select>
            </div>
            <div className="col">
              <label className="form-label">Brand:</label>
              <select
                value={product.branch}
                onChange={(e) => handleProductChange(index, 'branch', e.target.value)}
                className="form-select"
                disabled={!product.name}
              >
                <option value="">Select Brand</option>
                {getProductBrands(product.name).map((branch, i) => (
                  <option key={i} value={branch.brand_name}>{branch.brand_name}</option>
                ))}
              </select>
            </div>
            <div className="col">
              <label className="form-label">Model:</label>
              <select
                value={product.model}
                onChange={(e) => handleProductChange(index, 'model', e.target.value)}
                className="form-select"
                disabled={!product.branch}
              >
                <option value="">Select Model</option>
                {getProductModels(product.name, product.branch).map((model, i) => (
                  <option key={i} value={model.model}>{model.model}</option>
                ))}
              </select>
            </div>
            <div className="col">
              <label className="form-label">Quantity:</label>
              <input
                type="number"
                value={product.quantity}
                onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                className="form-control"
                min="1"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-secondary mb-3 mt-3"
          onClick={addProduct}
        >
          Add Product
        </button>
        <button type="submit" className="btn btn-primary">Confirm Bill</button>
      </form>
    </div>
  );
}

export default BillingForm;





