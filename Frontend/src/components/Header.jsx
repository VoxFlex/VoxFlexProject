import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Update windowWidth state on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <header
      style={{
        backgroundColor: "#333",
        color: "#fff",
        padding: "5px 3% 5px",
        width: "94%",
      }}
    >
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <h2 style={{ margin: 0 , fontSize: 34}}>VoxFlex</h2>

        {/* Desktop Links */}
        {windowWidth >= 400 ? (
          <div
            className="nav-links"
            style={{
              display: "flex",
            }}
          >
            <Link
              to="/"
              style={{
                margin: "0 15px",
                color: "white",
                textDecoration: "none",
              }}
            >
              Home
            </Link>
            <Link
              to="/translate"
              style={{
                margin: "0 15px",
                color: "white",
                textDecoration: "none",
              }}
            >
              Translate
            </Link>
            <Link
              to="/about"
              style={{
                margin: "0 15px",
                color: "white",
                textDecoration: "none",
              }}
            >
              About
            </Link>
          </div>
        ) : (
          // Dropdown Toggle Button for Small Screens
          <button
            onClick={toggleDropdown}
            style={{
              backgroundColor: "transparent",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontSize: "1.5rem",
            }}
          >
            ☰
          </button>
        )}
      </nav>

      {/* Dropdown Menu */}
      {isDropdownOpen && windowWidth < 400 && (
        <div
          className="dropdown-menu"
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#444",
            margin: "10px",
            borderRadius: "5px",
          }}
        >
          <Link
            to="/"
            onClick={() => setIsDropdownOpen(false)}
            style={{
              margin: "5px 0",
              color: "white",
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            Home
          </Link>
          <Link
            to="/translate"
            onClick={() => setIsDropdownOpen(false)}
            style={{
              margin: "5px 0",
              color: "white",
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            Translate
          </Link>
          <Link
            to="/about"
            onClick={() => setIsDropdownOpen(false)}
            style={{
              margin: "5px 0",
              color: "white",
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            About
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
