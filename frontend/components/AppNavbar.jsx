import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AppNavbar = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link
          to="/"
          className="navbar-logo"
          onClick={() => setMenuOpen(false)}
        >
          <span className="logo-full">On Duty Management</span>
          <span className="logo-short">ODM</span>
        </Link>

        <button
          type="button"
          className={`nav-toggle ${menuOpen ? "open" : ""}`}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <div className="navbar-links-inner" onClick={() => setMenuOpen(false)}>
            {children}
          </div>
        </div>

        {menuOpen && (
          <button
            type="button"
            className="nav-backdrop"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </div>
    </nav>
  );
};

export default AppNavbar;
