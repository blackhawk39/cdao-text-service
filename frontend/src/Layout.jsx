import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import NavLinks from "./components/NavLinks";

function Layout() {
  const [isLogin, setIsLogin] = useState(true);
  const [isNavLinksVisible, setIsNavLinksVisible] = useState(false);

  const toggleNavLinks = () => {
    setIsNavLinksVisible(!isNavLinksVisible);
  };

  return (
    <>
      <div className="relative">
        <Navbar toggleNavLinks={toggleNavLinks} />
        <NavLinks isVisible={isNavLinksVisible} />
        <div className={`${isNavLinksVisible ? "opacity-0" : ""}`}>
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Layout;
