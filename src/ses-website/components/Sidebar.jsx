// import React, { useState } from "react";
// import { NavLink } from "react-router-dom";
// import {
//   FaBars,
//   FaTimes,
//   FaHome,
//   FaInfoCircle,
//   FaLaptopCode,
//   FaProjectDiagram,
//   FaBriefcase,
//   FaEnvelope,
//   FaUserShield,
// } from "react-icons/fa";

// import logo from "../asset/ses_logo.png";
// import "../asset/css/sidebar.css";

// function Sidebar() {
//   const [sidebar, setSidebar] = useState(false);

//   const closeSidebar = () => setSidebar(false);

//   return (
//     <>
//       {/* Menu Button */}
//       <button className="menu-btn" onClick={() => setSidebar(true)}>
//         <FaBars />
//       </button>

//       {/* Overlay */}
//       {sidebar && <div className="overlay" onClick={closeSidebar}></div>}

//       {/* Sidebar */}
//       <div className={`sidebar ${sidebar ? "active" : ""}`}>
//         <div className="sidebar-header">
//           <div className="sidebar-logo">
//             <img src={logo} alt="SES Logo" />

//             <h4>
//               <span>Soft</span>
//               <br />
//               Electronic <span>Solutions</span>
//             </h4>
//           </div>
//           <button className="close-btn" onClick={() => setSidebar(false)}>
//             <FaTimes />
//           </button>
//         </div>

//         <ul className="sidebar-menu">
//           <li>
//             <NavLink to="/" onClick={closeSidebar}>
//               <FaHome className="icon" />
//               Home
//             </NavLink>
//           </li>

//           <li>
//             <NavLink to="/about" onClick={closeSidebar}>
//               <FaInfoCircle className="icon" />
//               About
//             </NavLink>
//           </li>

//           <li>
//             <NavLink to="/services" onClick={closeSidebar}>
//               <FaLaptopCode className="icon" />
//               Services
//             </NavLink>
//           </li>

//           <li>
//             <NavLink to="/projects" onClick={closeSidebar}>
//               <FaProjectDiagram className="icon" />
//               Projects
//             </NavLink>
//           </li>

//           <li>
//             <NavLink to="/careers" onClick={closeSidebar}>
//               <FaBriefcase className="icon" />
//               Careers
//             </NavLink>
//           </li>

//           <li>
//             <NavLink to="/contact" onClick={closeSidebar}>
//               <FaEnvelope className="icon" />
//               Contact
//             </NavLink>
//           </li>

//           <li className="login-item">
//             <NavLink to="/login" onClick={closeSidebar}>
//               <FaUserShield className="icon" />
//               Admin Login
//             </NavLink>
//           </li>
//         </ul>
//       </div>
//     </>
//   );
// }

// export default Sidebar;
