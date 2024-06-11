import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { MdDashboard, MdDomainVerification } from "react-icons/md";
import { FaBars, FaHandHoldingWater, FaAmazonPay, FaUsers } from "react-icons/fa";
import { GrHostMaintenance } from "react-icons/gr";
import { RiBillLine } from "react-icons/ri";
import { IoLogOut } from "react-icons/io5";
import { AiFillNotification } from "react-icons/ai";
import { IoIosNotifications } from "react-icons/io";
import { GiWaterDrop } from "react-icons/gi";
import "./Pages/Sidebar.css";

const Sidebar = ({ isAuthenticated, userRole, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggle = () => setIsOpen(!isOpen);

  const showAnimation = {
    hidden: { width: 0, opacity: 0, transition: { duration: 0.5 } },
    show: { opacity: 1, width: "auto", transition: { duration: 0.2 } },
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) {
      return; // User canceled logout
    }

    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        toast.error("Access token not found.");
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };

      const response = await axios.post("http://localhost:3000/api/v1/logout", null, config);

      if (response.status === 200) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_role');
        window.location.href = '/'; 
        toast.success("Logged out successfully");
      } else {
        toast.error("An error occurred while logging out. Please try again later.");
      }
    } catch (error) {
      console.error("Error while logging out:", error);
      toast.error("An error occurred while logging out. Please try again later.");
    }
  };

  const adminLinks = [
    { to: "/", icon: <MdDashboard />, text: "Dashboard" },
    { to: "/ShowMaintanenceBill", icon: <GrHostMaintenance />, text: "Show Maintenance Bill" },
    { to: "/showwaterbill", icon: <FaHandHoldingWater />, text: "Show Water Bill" },
    { to: "/user_request", icon: <FaUsers />, text: "User Requests" },
    { to: "/MaintenenceBillPayments", icon: <RiBillLine />, text: "User Payments" },
    { to: "/WaterBillPayments", icon: <GiWaterDrop />, text: "Water Bill Payments" },
    { to: "/CreateNotification", icon: <AiFillNotification />, text: "Create Notification" },
  ];

  const userLinks = [
    { to: "/MaintenenceBillPay", icon: <MdDomainVerification />, text: "Show Maintenance Bill" },
    { to: "/WaterBillsPay", icon: <FaAmazonPay />, text: "Water Bill Pay" },
    { to: "/ReceiveNotification", icon: <IoIosNotifications />, text: "Receive Notification" },
    { to: "/UserProfile", icon: <FaUsers />, text: "User Profile" },
  ];

  const renderLinks = (links) =>
    links.map((link) => (
      <NavLink to={link.to} className="link" activeClassName="active" key={link.to}>
        <div className="icon">{link.icon}</div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              style={{ whiteSpace: "nowrap", fontSize: "14px" }}
              variants={showAnimation}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="link_text"
            >
              {link.text}
            </motion.div>
          )}
        </AnimatePresence>
      </NavLink>
    ));

  return (
    <div className="main-container">
      <motion.div
        animate={{ width: isOpen ? "15%" : "3%", transition: { duration: 0.5, type: "spring", damping: 10 } }}
        className="sidebar"
      >
        <div className="top_section">
          {isOpen && <h1 className="logo">Solaris Business</h1>}
          <div className="bars">
            <FaBars onClick={toggle} />
          </div>
        </div>
        <section className="routes">{userRole === "admin" ? renderLinks(adminLinks) : renderLinks(userLinks)}</section>
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
      </motion.div>
      <main style={{ width: isOpen ? "85%" : "97%" }}>{children}</main>
    </div>
  );
};

export default Sidebar;
