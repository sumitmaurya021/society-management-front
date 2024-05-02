import { AnimatePresence, motion } from "framer-motion"
import { MdDashboard } from "react-icons/md";
import { FaBars, FaWater } from "react-icons/fa";
import { GrHostMaintenance } from "react-icons/gr";
import { MdDomainVerification } from "react-icons/md";
import { FaHandHoldingWater } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useState } from "react";

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
]

const Sidebar = ({ children }) => {

  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <div className="main-container">
        <motion.div animate={{ width: isOpen ? "15%" : "3%", transition: { duration: 0.5, type: "spring", damping: 10 } }} className="sidebar">

          <div className="top_section border-bottom" style={{marginBottom: "35px"}}>
            {isOpen && <h1 className="logo m-0" style={{whiteSpace: "nowrap"}}>Solaris Business</h1>}
            <div className="bars" style={{marginLeft: "1px"}}>
              <FaBars onClick={toggle} />
            </div>
          </div>

          <section className="routes">
            {routes.map((route, index) => (
              <NavLink ActiveClassName="active" to={route.path} key={route.name} className="link">
                <div className="icon">{route.icon}</div>
                <AnimatePresence>
                 {isOpen && <motion.div variants={showAnimation} initial="hidden" animate="show" exit="hidden" className="link-text">{route.name}</motion.div>}
                </AnimatePresence>
              </NavLink>
            ))}
          </section>
        </motion.div>
          <main style={{width: isOpen ? "85%" : "97%"}}>{children}</main>
    </div>
  )
}

export default Sidebar
