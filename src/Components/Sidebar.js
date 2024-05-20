import { AnimatePresence, motion } from "framer-motion";
import { MdDashboard } from "react-icons/md";
import { FaBars, FaWater, FaHandHoldingWater, FaAmazonPay, FaUsers } from "react-icons/fa";
import { GrHostMaintenance } from "react-icons/gr";
import { MdDomainVerification } from "react-icons/md";
import { RiBillLine } from "react-icons/ri";
import { IoLogOut } from "react-icons/io5";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import "./Pages/Sidebar.css";

const Sidebar = ({ children }) => {
  const userRole = localStorage.getItem('user_role');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const toggle = () => setIsOpen(!isOpen);

  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
    show: {
      opacity: 1,
      width: "auto",
      transition: {
        duration: 0.2,
      },
    },
  };

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        toast.error("Access token not found.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await axios.post(
        "http://localhost:3000/api/v1/logout",
        null,
        config
      );

      if (response.status === 200) {
        localStorage.clear();
        toast.success("Logged out successfully");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error("An error occurred while logging out. Please try again later.");
      }
    } catch (error) {
      console.error("Error while logging out:", error);
      toast.error("An error occurred while logging out. Please try again later.");
    }
  };

  return (
    <div className="main-container">
      <motion.div
        animate={{ width: isOpen ? "15%" : "3%",
        transition: { duration: 0.5, type: "spring", damping: 10 },  
         }}
        className="sidebar"
      >
        <div className="top_section">
          {isOpen && (
            <h1 className="logo" style={{ whiteSpace: "nowrap" }}>Solaris Business</h1>
          )}
          <div className="bars">
            <FaBars onClick={toggle} />
          </div>
        </div>
        <section className="routes">
          {userRole === 'admin' ? (
            <>
              <NavLink to="/" className="link" activeClassName="active">
                <div className="icon"><MdDashboard /></div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div style={{ whiteSpace: "nowrap", fontSize: "14px" }} variants={showAnimation} initial="hidden" animate="show" exit="hidden" className="link_text">
                      Dashboard
                    </motion.div>
                  )}
                </AnimatePresence>
              </NavLink>
              <NavLink to="/createwaterbill" className="link" activeClassName="active">
                <div className="icon"><FaWater /></div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div style={{ whiteSpace: "nowrap", fontSize: "14px" }} variants={showAnimation} initial="hidden" animate="show" exit="hidden" className="link_text">
                      Create Water Bill
                    </motion.div>
                  )}
                </AnimatePresence>
              </NavLink>
              <NavLink to="/createmaintenancebill" className="link" activeClassName="active">
                <div className="icon"><GrHostMaintenance /></div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div style={{ whiteSpace: "nowrap", fontSize: "14px" }} variants={showAnimation} initial="hidden" animate="show" exit="hidden" className="link_text">
                      Create Maintenance Bill
                    </motion.div>
                  )}
                </AnimatePresence>
              </NavLink>
              <NavLink to="/showwaterbill" className="link" activeClassName="active">
                <div className="icon"><FaHandHoldingWater /></div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div style={{ whiteSpace: "nowrap", fontSize: "14px" }} variants={showAnimation} initial="hidden" animate="show" exit="hidden" className="link_text">
                      Show Water Bill
                    </motion.div>
                  )}
                </AnimatePresence>
              </NavLink>
              <NavLink to="/showmaintenancebill" className="link" activeClassName="active">
                <div className="icon"><MdDomainVerification /></div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div style={{ whiteSpace: "nowrap", fontSize: "14px" }} variants={showAnimation} initial="hidden" animate="show" exit="hidden" className="link_text">
                      Show Maintenance Bill
                    </motion.div>
                  )}
                </AnimatePresence>
              </NavLink>
              <NavLink to="/user_request" className="link" activeClassName="active">
                <div className="icon"><FaUsers /></div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div style={{ whiteSpace: "nowrap", fontSize: "14px" }} variants={showAnimation} initial="hidden" animate="show" exit="hidden" className="link_text">
                      User Requests
                    </motion.div>
                  )}
                </AnimatePresence>
              </NavLink>
              <NavLink to="/UserPayments" className="link" activeClassName="active">
                <div className="icon"><RiBillLine /></div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div style={{ whiteSpace: "nowrap", fontSize: "14px" }} variants={showAnimation} initial="hidden" animate="show" exit="hidden" className="link_text">
                      User Payments
                    </motion.div>
                  )}
                </AnimatePresence>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/" className="link" activeClassName="active">
                <div className="icon"><MdDashboard /></div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div style={{ whiteSpace: "nowrap", fontSize: "14px" }} variants={showAnimation} initial="hidden" animate="show" exit="hidden" className="link_text">
                      Dashboard
                    </motion.div>
                  )}
                </AnimatePresence>
              </NavLink>
              <NavLink to="/MaintenenceBillPay" className="link" activeClassName="active">
                <div className="icon"><MdDomainVerification /></div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div style={{ whiteSpace: "nowrap", fontSize: "14px" }} variants={showAnimation} initial="hidden" animate="show" exit="hidden" className="link_text">
                      Show Maintenance Bill
                    </motion.div>
                  )}
                </AnimatePresence>
              </NavLink>
              <NavLink to="/WaterBillsPay" className="link" activeClassName="active">
                <div className="icon"><FaAmazonPay /></div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div style={{ whiteSpace: "nowrap", fontSize: "14px" }} variants={showAnimation} initial="hidden" animate="show" exit="hidden" className="link_text">
                      Water Bill Pay
                    </motion.div>
                  )}
                </AnimatePresence>
              </NavLink>
            </>
          )}
          <div className="logcss">
            {isOpen ? (
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-sm btn-danger"
                style={{ marginLeft: "40px", whiteSpace: "nowrap" }}
              >
                Log Out
              </button>
            ) : (
              <IoLogOut className="icon" onClick={handleLogout} />
            )}
          </div>
        </section>
      </motion.div>
      <main style={{ width: isOpen ? "85%" : "97%"  }}>{children}</main>
    </div>
  );
};

export default Sidebar;
