import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Welcome to Video Translation App</h1>
      <p>
        Easily translate your video files into multiple languages with this app.
      </p>

      <Link to="/translate">
        <button style={{ padding: "10px 20px", fontSize: "16px" }}>
          Get Started
        </button>
      </Link>
    </div>
  );
};

export default Home;
