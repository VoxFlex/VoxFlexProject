import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Grid,
  Tab,
  Tabs,
  Icon,
} from "@mui/material";

import VideoFileIcon from "@mui/icons-material/VideoFile";
import MicIcon from "@mui/icons-material/Mic";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import ChatIcon from "@mui/icons-material/Chat";

const AiStudio = () => {
  const [selectedTab, setSelectedTab] = useState("all");

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  const features = [
    {
      id: "video-translator",
      icon: VideoFileIcon,
      title: "Video Translator",
      description: "Translate Videos to 130+ languages",
      link: "/video-translator",
      category: "video",
    },
    {
      id: "voice-converter",
      icon: MicIcon,
      title: "Voice Converter",
      description: "Change the voice from orinal voice by voice model",
      link: "/voice-converter",
      category: "audio",
    },
    {
      id: "video-dubbing",
      icon: MusicNoteIcon,
      title: "Video Dubbing",
      description: "Dub videos with realistic AI voices",
      link: "/video-dubbing",
      category: "video",
    },
    {
      id: "audio-translation",
      icon: ChatIcon,
      title: "Audio Translation",
      description: "Translate Audio with AI",
      link: "/audio-translation",
      category: "audio",
    },
    {
      id: "song-voice",
      icon: MicIcon,
      title: "Song Voice Converter",
      description: "Change the song's voice",
      link: "/song-voice",
      category: "audio",
    },
    {
      id: "text-speech",
      icon: TextSnippetIcon,
      title: "Text to Speech ",
      description: "Convert text to speech",
      link: "/text-speech",
      category: "text",
    },
    // {
    //   id: "subtitle",
    //   icon: TextSnippetIcon,
    //   title: "Subtitle Generator (Coming Soon)",
    //   description: "Auto Generate subtitles with AI",
    //   link: "/subtitle",
    //   category: "text",
    // },
  ];

  const filteredFeatures = features.filter(
    (feature) => selectedTab === "all" || feature.category === selectedTab
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="All" value="all" />
          <Tab label="Video" value="video" />
          <Tab label="Audio" value="audio" />
          <Tab label="Text" value="text" />
        </Tabs>
      </Box>

      <Grid container spacing={3}>
        {filteredFeatures.map((feature) => (
          <Grid item xs={12} sm={6} md={6} key={feature.id}>
            <Card
              component={Link}
              to={feature.link}
              sx={{
                height: "100%",
                display: "flex",
                textDecoration: "none",
                bgcolor:
                  feature.id === "video-translator" ||
                  feature.id === "voice-converter" ||
                  feature.id === "song-voice" ||
                  feature.id === "video-dubbing" ||
                  feature.id === "audio-translation" ||
                  feature.id === "text-speech"
                    ? "#f8faff"
                    : "#f5f4f2",
                "&:hover": {
                  boxShadow: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 3,
                    cursor: "pointer",
                  },
                  transition: "all 0.2s",
                },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 3,
                }}
              >
                <feature.icon sx={{ fontSize: 40, color: "primary.main" }} />
                <Box>
                  <Typography variant="h6" color="text.primary">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AiStudio;
