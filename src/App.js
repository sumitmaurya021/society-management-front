import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashBoard from './Components/Pages/DashBoard';
import Login from './Components/Pages/Login';
import SignUp from './Components/Pages/SignUp';
import ShowWaterBill from './Components/Pages/ShowWaterBill';
import ShowMaintanenceBill from './Components/Pages/ShowMaintanenceBill';
import CreateWaterBill from './Components/Pages/CreateWaterBill';
import CreateMaintanenceBill from './Components/Pages/CreateMaintanenceBill';
import Sidebar from './Components/Sidebar';
import ForgotPassword from './Components/Pages/ForgotPassword';
import LoginCustomer from './Components/Pages/LoginCustomer';
import SignUpCustomer from './Components/Pages/SignUpCustomer';
import UserRequests from './Components/Pages/UserRequests';
import AdminCustomer from './Components/Pages/AdminCustomer';
import MaintenenceBillPay from './Components/Pages/MaintenenceBillPay';
import MaintenenceBillPayments from './Components/Pages/MaintenenceBillPayments';
import WaterBillsPay from './Components/Pages/WaterBillsPay';
import NotFound from './NotFound';
import WaterBillPayments from './Components/Pages/WaterBillPayments';
import CreateNotification from './Components/Pages/CreateNotification';
import ReceiveNotification from './Components/Pages/ReceiveNotification';
import WebSocketNotification from './Components/Pages/WebSocketNotification';
import UserProfile from './Components/Pages/UserProfile';
import { ToastContainer } from 'react-toastify';
import CreateBuilding from './Components/Pages/CreateBuilding';

function App() {
  const isAuthenticated = localStorage.getItem('access_token');
  const userRole = localStorage.getItem('user_role');

  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/customer_login" element={<LoginCustomer />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/customer_signup" element={<SignUpCustomer />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin_customer_option" element={<AdminCustomer />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Sidebar>
        
        <Routes>
          {userRole === 'admin' ? (
            <>
              <Route path="/" element={<DashBoard />} />
              <Route path="/showwaterbill" element={<ShowWaterBill />} />
              <Route path="/showmaintenancebill" element={<ShowMaintanenceBill />} />
              <Route path="/createwaterbill" element={<CreateWaterBill />} />
              <Route path="/createmaintenancebill" element={<CreateMaintanenceBill />} />
              <Route path="/user_request" element={<UserRequests />} />
              <Route path="/MaintenenceBillPayments" element={<MaintenenceBillPayments />} />
              <Route path="/WaterBillPayments" element={<WaterBillPayments />} />
              <Route path="/CreateNotification" element={<CreateNotification />} />
              <Route path="/CreateBuilding" element={<CreateBuilding />} />
            </>
          ) : (
            <>
              <Route path="/WaterBillsPay" element={<WaterBillsPay />} />
              <Route path="/MaintenenceBillPay" element={<MaintenenceBillPay />} />
              <Route path="/ReceiveNotification" element={<ReceiveNotification />} />
              <Route path="/UserProfile" element={<UserProfile />} />
            </>
          )}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <WebSocketNotification />
      </Sidebar>
      <ToastContainer />
    </Router>
  );
}

export default App;
