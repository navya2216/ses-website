import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import NavbarPage from "../pages/NavbarPage";
import SidebarPage from "../pages/SidebarPage";
// import CarouselPage from "../pages/CarouselPage";
// import CardsPage from "../pages/CardsPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/navbars" element={<NavbarPage />} />

      <Route path="/sidebars" element={<SidebarPage />} />
      {/* <Route path="/carousels" element={<CarouselPage />} /> */}
      {/* <Route path="/cards" element={<CardsPage />} /> */}
    </Routes>
  );
}

export default AppRoutes;
