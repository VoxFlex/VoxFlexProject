import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

// Lazy loading components
const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/About"));
const AiStudio = lazy(() => import("../pages/AiStudio.jsx"));
const VideoTranslation = lazy(() => import("../pages/VideoTranslation"));
const SongVoiceConversion = lazy(() => import("../pages/SongVoiceConversion.jsx"));
const VoiceConversion2 = lazy(() => import("../pages/VoiceConvertion2.jsx"));
const VideoConvertion = lazy(() => import("../pages/VideoConvertion.jsx"));
const AudioTranslation = lazy(() => import("../pages/AudioTranslation.jsx"));
const TextToSpeech = lazy(() => import("../pages/TextToSpeech.jsx"));

// link: "/text-speech",
const AppRouter = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Root route */}
        <Route path="/" element={<Home />} />

        {/* Translate route */}
        <Route path="/ai_studio" element={<AiStudio />} />
        <Route path="/video-translator" element={<VideoTranslation />} />
        <Route path="/video-dubbing" element={<VideoConvertion />} />
        <Route path="/voice-converter" element={<VoiceConversion2/>} />
        <Route path="/song-voice" element={<SongVoiceConversion/>} />
        <Route path="/audio-translation" element={<AudioTranslation/>} />
        <Route path="/text-speech" element={<TextToSpeech />} />
        {/* About route */}
        <Route path="about" element={<About />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
