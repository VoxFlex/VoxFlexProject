import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  GitHub,
  LinkedIn,
} from "@mui/icons-material";

const Footer = () => {
  return (
    <footer
      style={{
        background: "#263238", // Dark background color
        color: "white",
        textAlign: "start",
        padding: "0.5rem 2rem", // Add padding for spacing
        display: "flex", // Flexbox for layout
        justifyContent: "space-between", // Space between copyright and icons
        alignItems: "center", // Vertically align items
        position: "relative" /* Ensures it stays above other content */

      }}
    >
      <p>&copy; 2025 VoxFlex App. All rights reserved.</p>
      <div
        style={{
          display: "flex",
          gap: "1rem", // Space between icons
        }}
      >
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "white", textDecoration: "none" }}
        >
          <Facebook />
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "white", textDecoration: "none" }}
        >
          <Twitter />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "white", textDecoration: "none" }}
        >
          <Instagram />
        </a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "white", textDecoration: "none" }}
        >
          <GitHub />
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "white", textDecoration: "none" }}
        >
          <LinkedIn />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
