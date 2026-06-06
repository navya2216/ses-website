import React from "react";
import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";
import About from "../pages/About";
import Services from "../pages/Services";
import Projects from "../pages/Projects";
import Careers from "../pages/Careers";
import Contact from "../pages/Contact";
// import Login from "../pages/Login";

function AppRoutes() {
  return (
    <Routes>
      {/* Website Pages */}

      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Login Page */}

      {/* <Route path="/login" element={<Login />} /> */}
    </Routes>
  );
}

export default AppRoutes;
