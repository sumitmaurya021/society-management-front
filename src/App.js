import                                                 './App.css'                                ;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'                         ;
import DashBoard from                                  './Components/Pages/DashBoard'             ;
import Login from                                      './Components/Pages/Login'                 ;
import SignUp from                                     './Components/Pages/SignUp'                ;
import ShowWaterBill from                              './Components/Pages/ShowWaterBill'         ;
import ShowMaintanenceBill from                        './Components/Pages/ShowMaintanenceBill'   ;
import CreateWaterBill from                            './Components/Pages/CreateWaterBill'       ;
import CreateMaintanenceBill from                      './Components/Pages/CreateMaintanenceBill' ;
import Sidebar from                                    './Components/Sidebar'                     ;
import ForgotPassword from                             './Components/Pages/ForgotPassword'        ;
import LoginCustomer from                              './Components/Pages/LoginCustomer'         ;
import SignUpCustomer from                             './Components/Pages/SignUpCustomer'        ;
import UserRequests from                               './Components/Pages/UserRequests'          ;
import AdminCustomer from                              './Components/Pages/AdminCustomer'         ;
import MaintenenceBillPay from                         './Components/Pages/MaintenenceBillPay'    ;
import UserPayments from                               './Components/Pages/UserPayments'          ;
import WaterBillsPay from                              './Components/Pages/WaterBillsPay'         ;

function App() {
  return (
    <>
      <Router>
        <Sidebar> 
          <Routes>
            <Route path="/" element={<DashBoard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/showwaterbill" element={<ShowWaterBill />} />
            <Route path="/showmaintenancebill" element={<ShowMaintanenceBill />} />
            <Route path="/createwaterbill" element={<CreateWaterBill />} />
            <Route path="/createmaintenancebill" element={<CreateMaintanenceBill />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="customer_login" element={<LoginCustomer />} />
            <Route path="/customer_signup" element={<SignUpCustomer />} />
            <Route path="/user_request" element={<UserRequests />} />
            <Route path="/admin_customer_option" element={<AdminCustomer />} />
            <Route path="/MaintenenceBillPay" element={<MaintenenceBillPay />} />
            <Route path="/UserPayments" element={<UserPayments />} />
            <Route path="/WaterBillsPay" element={<WaterBillsPay />} />
            <Route path="*" element={<> not found</>} />
          </Routes>
        </Sidebar>
      </Router>
    </>
  );
}

export default App;
