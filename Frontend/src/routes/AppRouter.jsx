import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

// Lazy loading components
const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/About"));
const AiStudio = lazy(() => import("../pages/AiStudio.jsx"));
const VideoTranslation = lazy(() => import("../pages/VideoTranslation"));
const VideoDubbing = lazy(() => import("../pages/VideoDubbing.jsx"));
const AppRouter = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Root route */}
        <Route path="/" element={<Home />} />

        {/* Translate route */}
        <Route path="/ai_studio" element={<AiStudio />} />
        <Route path="/video-translator" element={<VideoTranslation />} />
        <Route path="/video-dubbing" element={<VideoDubbing />} />
        {/* About route */}
        <Route path="about" element={<About />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
