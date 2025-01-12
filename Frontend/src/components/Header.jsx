import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // อัพเดตขนาดหน้าจอเมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    // ลบ event listener เมื่อ component ถูก unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <header
      style={{
        backgroundColor: "#fff",
        padding: "1rem 0",
        width: "100%",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.06)",
        position: "sticky", // ใช้ sticky position เพื่อให้ Navbar ติดตามเมื่อ scroll
        top: 0, // ระบุให้ติดอยู่ด้านบนสุด
        zIndex: 1000, // เพิ่มความสำคัญให้ Navbar อยู่เหนือ content อื่น ๆ
      }}
    >
      <nav
        style={{
          display: "flex",
          justifyContent: "center", // จัดให้อยู่ตรงกลางทั้งลิงก์
          alignItems: "center",
          height: "3rem",
          position: "relative", // เพื่อให้ logo ใช้ position:absolute ได้
          justifyContent: windowWidth < 600 ? "flex-end" : "center", // ใช้ flex-end หากหน้าจอเล็ก
        }}
      >
        {/* โลโก้ */}
        <img
          src="../../image/voxflex_icon.svg"
          alt="VoxFlex Icon"
          style={{
            width: windowWidth >= 600 ? "50%" : "28%", // เปลี่ยนขนาดตามความกว้างหน้าจอ
            maxWidth: "180px", // จำกัดขนาดสูงสุด
            height: "auto", // ให้คงอัตราส่วนภาพ
            position: "absolute", // แยกโลโก้ออกจากการจัดวาง
            left: "2rem", // ตำแหน่งห่างจากขอบซ้าย
            top: "50%",
            transform: "translateY(-50%)", // จัดให้อยู่ตรงกลางแนวตั้ง
          }}
        />

        {/* ลิงก์สำหรับ Desktop */}
        {windowWidth >= 600 ? (
          <div
            style={{
              display: "flex",
              gap: "3rem", // ช่องว่างระหว่างลิงก์
              justifyContent: "center",
              fontSize: "1rem",
            }}
          >
            <Link
              to="/"
              style={{
                color: "#333",
                textDecoration: "none",
              }}
            >
              Home
            </Link>
            <Link
              to="/ai_studio"
              style={{
                color: "#333",
                textDecoration: "none",
              }}
            >
              Ai Studio
            </Link>
            <Link
              to="/about"
              style={{
                color: "#333",
                textDecoration: "none",
              }}
            >
              About
            </Link>
          </div>
        ) : (
          // ปุ่ม Dropdown สำหรับหน้าจอขนาดเล็ก
          <button
            onClick={toggleDropdown}
            style={{
              backgroundColor: "transparent",
              color: "black",
              border: "none",
              cursor: "pointer",
              fontSize: "1.5rem",
            }}
          >
            ☰
          </button>
        )}
      </nav>

      {/* เมนู Dropdown */}
      {isDropdownOpen && windowWidth < 400 && (
        <div
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
            to="/ai_studio"
            onClick={() => setIsDropdownOpen(false)}
            style={{
              margin: "5px 0",
              color: "white",
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            Ai Studio
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
