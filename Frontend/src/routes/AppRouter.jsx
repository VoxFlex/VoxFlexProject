import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Translate from "../pages/Translate";
import About from "../pages/About";

const AppRouter = () => {
  return (
    <Routes>
      {/* Root route */}
      <Route path="/" element={<Home />} />

      {/* Translate route */}
      <Route path="translate" element={<Translate />} />

      {/* About route */}
      <Route path="about" element={<About />} />
    </Routes>
  );
};

export default AppRouter;
