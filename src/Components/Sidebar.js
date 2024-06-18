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
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import "./Pages/Sidebar.css";

const Sidebar = ({ isAuthenticated, userRole, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const toggle = () => setIsOpen(!isOpen);

  const showAnimation = {
    hidden: { width: 0, opacity: 0, transition: { duration: 0.5 } },
    show: { opacity: 1, width: "auto", transition: { duration: 0.2 } },
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLogout = async () => {
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
    } finally {
      handleCloseModal();
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
              onClick={handleOpenModal}
              className="btn btn-sm btn-danger"
              style={{ marginLeft: "40px", whiteSpace: "nowrap" }}
            >
              Log Out
            </button>
          ) : (
            <IoLogOut className="icon" onClick={handleOpenModal} />
          )}
        </div>
      </motion.div>
      <main style={{ width: isOpen ? "85%" : "97%" }}>{children}</main>
      <AnimatePresence>
        {isModalOpen && (
          <Modal
            open={isModalOpen}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            closeAfterTransition
            BackdropProps={{
              timeout: 500,
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 400,
                  bgcolor: 'background.paper',
                  border: 'none',
                  boxShadow: 24,
                  p: 4,
                  borderRadius: 1,
                }}
              >
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Confirm Logout
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Are you sure you want to log out?
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Button variant="contained" color="primary" onClick={handleLogout}>
                    Yes
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={handleCloseModal}>
                    No
                  </Button>
                </Box>
              </Box>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sidebar;
