import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
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
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "3rem",
          position: "relative",
          justifyContent: windowWidth < 600 ? "flex-end" : "center",
        }}
      >
        {/* โลโก้ */}
        <img
          src="../../image/voxflex_icon.png"
          alt="VoxFlex Icon"
          style={{
            width: windowWidth >= 600 ? "50%" : "28%",
            maxWidth: "180px",
            height: "auto",
            position: "absolute",
            left: "2rem",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />

        {/* เมนู Desktop */}
        {windowWidth >= 600 ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "3rem",
              justifyContent: "center",
              fontSize: "1rem",
              position: "relative",
            }}
          >
            {/* 
              1) NavLink ไปยัง Home
              2) ใช้ style={({ isActive }) => ({ color: isActive ? "#007bff" : "#333" })} 
                 เพื่อเปลี่ยนสีตาม active state 
            */}
            <NavLink
              to="/"
              end  // สำหรับเส้นทาง / ให้ใช้ end เพื่อไม่ให้ชนกับเส้นทางอื่นที่ขึ้นต้นด้วย /
              style={({ isActive }) => ({
                color: isActive ? "#007bff" : "#333",
                textDecoration: "none",
              })}
            >
              Home
            </NavLink>

            {/* Ai Studio + Dropdown ครอบใน div เดียว */}
            <div
              style={{
                position: "relative",
                display: "inline-block",
              }}
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              {/*
                หากต้องการให้ Ai Studio Active ทั้ง /ai_studio และ sub-route ต่าง ๆ เช่น /ai_studio/...
                ให้เอา end={false} เพื่อ match path ลูกด้วย
              */}
              <NavLink
                to="/ai_studio"
                end={false}
                style={({ isActive }) => ({
                  color: isActive ? "#007bff" : "#333",
                  textDecoration: "none",
                  padding: "0.5rem 0.75rem",
                  display: "inline-block",
                })}
              >
                Ai Studio
              </NavLink>

              {/* Dropdown */}
              {isDropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    backgroundColor: "#fff",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                    borderRadius: "4px",
                    padding: "0.5rem 0",
                    zIndex: 10,
                    minWidth: "180px",
                  }}
                >
                  {/* 
                    เมนูย่อยก็เปลี่ยนเป็น NavLink ได้เช่นกัน 
                    แต่หลายคนอาจให้แค่ clickable เฉย ๆ ก็ได้
                  */}
                  <NavLink
                    to="/video-translator"
                    style={({ isActive }) => ({
                      display: "block",
                      padding: "0.5rem 1rem",
                      color: isActive ? "#007bff" : "#333",
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                    })}
                  >
                    Video Translator
                  </NavLink>
                  <NavLink
                    to="/video-dubbing"
                    style={({ isActive }) => ({
                      display: "block",
                      padding: "0.5rem 1rem",
                      color: isActive ? "#007bff" : "#333",
                      textDecoration: "none",
                    })}
                  >
                    Video Dubbing
                  </NavLink>
                  <NavLink
                    to="/voice-converter"
                    style={({ isActive }) => ({
                      display: "block",
                      padding: "0.5rem 1rem",
                      color: isActive ? "#007bff" : "#333",
                      textDecoration: "none",
                    })}
                  >
                    Voice Converter
                  </NavLink>
                  <NavLink
                    to="/song-voice"
                    style={({ isActive }) => ({
                      display: "block",
                      padding: "0.5rem 1rem",
                      color: isActive ? "#007bff" : "#333",
                      textDecoration: "none",
                    })}
                  >
                    Song Voice
                  </NavLink>
                  <NavLink
                    to="/audio-translation"
                    style={({ isActive }) => ({
                      display: "block",
                      padding: "0.5rem 1rem",
                      color: isActive ? "#007bff" : "#333",
                      textDecoration: "none",
                    })}
                  >
                    Audio Translation
                  </NavLink>
                  <NavLink
                    to="/text-speech"
                    style={({ isActive }) => ({
                      display: "block",
                      padding: "0.5rem 1rem",
                      color: isActive ? "#007bff" : "#333",
                      textDecoration: "none",
                    })}
                  >
                    Text to Speech
                  </NavLink>
                </div>
              )}
            </div>

            <NavLink
              to="/about"
              style={({ isActive }) => ({
                color: isActive ? "#007bff" : "#333",
                textDecoration: "none",
              })}
            >
              About
            </NavLink>
          </div>
        ) : (
          // ปุ่มเมนู Hamburger บนจอเล็ก
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

      {/* เมนู Dropdown (Hamburger) สำหรับ mobile */}
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
          <NavLink
            to="/"
            end
            onClick={() => setIsDropdownOpen(false)}
            style={({ isActive }) => ({
              margin: "5px 0",
              color: isActive ? "#007bff" : "#fff",
              textDecoration: "none",
              textAlign: "center",
            })}
          >
            Home
          </NavLink>
          <NavLink
            to="/ai_studio"
            end={false}
            onClick={() => setIsDropdownOpen(false)}
            style={({ isActive }) => ({
              margin: "5px 0",
              color: isActive ? "#007bff" : "#fff",
              textDecoration: "none",
              textAlign: "center",
            })}
          >
            Ai Studio
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setIsDropdownOpen(false)}
            style={({ isActive }) => ({
              margin: "5px 0",
              color: isActive ? "#007bff" : "#fff",
              textDecoration: "none",
              textAlign: "center",
            })}
          >
            About
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default Header;
