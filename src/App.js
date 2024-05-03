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
import Spinner from './Components/Spinner';

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
            <Route path="*" element={<> not found</>} />
          </Routes>
        </Sidebar>
      </Router>
    </>
  );
}

export default App;
