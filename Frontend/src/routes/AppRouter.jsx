import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";

import About from "../pages/About";
import AiStudio from "../pages/AIStudio";

const AppRouter = () => {
  return (
    <Routes>
      {/* Root route */}
      <Route path="/" element={<Home />} />

      {/* Translate route */}
      <Route path="translate" element={<AiStudio/>} />

      {/* About route */}
      <Route path="about" element={<About />} />
    </Routes>
  );
};

export default AppRouter;
