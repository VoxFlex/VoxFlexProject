import React from "react";
import { useLocation } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  GitHub,
  LinkedIn,
} from "@mui/icons-material";

const Footer = () => {
  const location = useLocation();
  const isAboutPage = location.pathname === "/about";

  if (isAboutPage) {
    return <></>;
  }

  // ✅ แบบที่ 1: Footer Default สำหรับทุก path ยกเว้น /about
  return (
    <footer
      style={{
        background: "#263238",
        color: "white",
        textAlign: "start",
        padding: "0.5rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <p>&copy; 2025 VoxFlex. All rights reserved.</p>
      <div style={{ display: "flex", gap: "1rem" }}>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "white" }}
        >
          <Facebook />
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "white" }}
        >
          <Twitter />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "white" }}
        >
          <Instagram />
        </a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "white" }}
        >
          <GitHub />
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "white" }}
        >
          <LinkedIn />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
