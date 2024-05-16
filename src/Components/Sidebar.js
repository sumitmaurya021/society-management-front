import { AnimatePresence, motion } from "framer-motion";
import { MdDashboard } from "react-icons/md";
import { FaBars, FaWater } from "react-icons/fa";
import { GrHostMaintenance } from "react-icons/gr";
import { MdDomainVerification } from "react-icons/md";
import { FaHandHoldingWater } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { IoLogOut } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { useState } from "react";
import { toast } from "react-toastify";
import { RiBillLine } from "react-icons/ri";
import { FaAmazonPay } from "react-icons/fa";
import axios from "axios";

const routes = [
  {
    path: "/",
    name: "Dashboard",
    icon: <MdDashboard />,
  },
  {
    path: "/showwaterbill",
    name: "Show Water Bill",
    icon: <FaHandHoldingWater />,
  },
  {
    path: "/showmaintenancebill",
    name: "Show Maintenance Bill",
    icon: <MdDomainVerification />,
  },
  {
    path: "/createwaterbill",
    name: "Create Water Bill",
    icon: <FaWater />,
  },
  {
    path: "/createmaintenancebill",
    name: "Create Maintenance Bill",
    icon: <GrHostMaintenance />,
  },
  {
    path: "/user_request",
    name: "User Request",
    icon: <FaUsers />,
  },
  {
    path: "/MaintenenceBillPay",
    name: "MaintenenceBillPay",
    icon: <FaAmazonPay />,
  },
  {
    path: "/UserPayments",
    name: "UserPayments",
    icon: <RiBillLine />,
  },
  {
    path: "/WaterBillsPay",
    name: "WaterBillsPay",
    icon: <FaAmazonPay />,
  }
];

const Sidebar = ({ children }) => {
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

      // Set authorization headers with the access token
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      // Make the POST request to logout
      const response = await axios.post(
        "http://localhost:3000/api/v1/logout",
        null,
        config
      );

      // Check response status
      if (response.status === 200) {
        // Remove access token from local storage
        localStorage.removeItem("access_token");
        toast.success("Logged out successfully");
        setTimeout(() => {
          navigate("/admin_customer_option");
        }, 2000);
      } else {
        // Handle unexpected response
        toast.error(
          "An error occurred while logging out. Please try again later."
        );
      }
    } catch (error) {
      console.error("Error while logging out:", error);
      toast.error(
        "An error occurred while logging out. Please try again later."
      );
    }
  };

  return (
    <div className="main-container">
      <motion.div
        animate={{
          width: isOpen ? "15%" : "3%",
          transition: { duration: 0.5, type: "spring", damping: 10 },
        }}
        className="sidebar"
      >
        <div
          className="top_section border-bottom"
          style={{ marginBottom: "35px" }}
        >
          {isOpen && (
            <h1 className="logo m-0" style={{ whiteSpace: "nowrap" }}>
              Solaris Business
            </h1>
          )}
          <div className="bars" style={{ marginLeft: "1px" }}>
            <FaBars onClick={toggle} />
          </div>
        </div>

        <section className="routes">
          {routes.map((route, index) => (
            <NavLink
              ActiveClassName="active"
              to={route.path}
              key={route.name}
              className="link"
            >
              <div className="icon">{route.icon}</div>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    variants={showAnimation}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    className="link-text"
                  >
                    {route.name}
                  </motion.div>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
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
      <main style={{ width: isOpen ? "85%" : "97%" }}>{children}</main>
    </div>
  );
};

export default Sidebar;
