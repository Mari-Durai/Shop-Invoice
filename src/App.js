import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import BillingForm from './BillingForm/BillingForm';
import Invoice from './Invoice/Invoice';
import EditProfile from './EditProfile/EditProfile';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BillingForm/>} />
        <Route path="/invoice" element={<Invoice/>} />
        <Route path="/edit-profile" element={<EditProfile/>} />
      </Routes>
    </Router>
  );
}

export default App;

