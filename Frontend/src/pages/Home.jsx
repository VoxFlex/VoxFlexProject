import React from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Typography,
  Box,
  Grid2,
  Card,
  CardContent,
} from "@mui/material";
import "../components/Component.css";
import SectionFeatureInfo from "../components/SectionFeatureInfo";

const Home = () => {
  return (
    <Box
      sx={{
        textAlign: "center",
        borderRadius: "1rem",
        fontFamily: "Roboto, sans-serif",
        paddingTop: "3rem",
      }}
    >
      {/* Header Section */}
      <Grid2
        sx={{
          display: "flex",
          paddingBlock: 5,
          gap: "3.1875rem",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* mainText container */}
        <Box
          sx={{
            maxWidth: { xs: "100%", md: "50%" },
          }}
        >
          {/* mainText title */}
          <Typography
            sx={{
              fontWeight: "bold",
              color: "#001F3E",
              // fontSize: { xs: "2.5rem", md: "3rem" },
            }}
            variant="h2"
          >
            <span style={{ color: "#007AFF" }}>AI Powered</span>
            <div>Video Translator</div>
          </Typography>

          {/* mainText subtitle */}
          <Typography
            variant="subtitle1"
            sx={{
              marginBlock: 4,
              paddingX: 5,
              color: "var(--black-80, #334C65)",
              textAlign: { xs: "center", md: "center" },
              fontSize: "1.5625rem",
              marginLeft: { xs: 0, md: 1 },
              lineHeight: "160%",
              fontWeight: "500",
            }}
          >
            AI Translation and Conversion for a Global Audience.Translate a
            video with multi-languages.
          </Typography>

          {/* mainText button */}
          <Box
            sx={{
              alignItems: "center",
              paddingX: "1",
            }}
          >
            <Button
              component={Link}
              to="/ai_studio"
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: "#007AFF",
                borderRadius: "1.875rem",
              }}
            >
              Get Started
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            paddingX: 5,
            maxWidth: { xs: "80%", md: "40%" },
            textAlign: "center",
          }}
        >
          <img
            style={{ width: "100%", height: "auto" }}
            src="../../image/homeImage.png"
            alt="Landing Illustration"
          />
        </Box>
      </Grid2>

      <Box
        style={{
          backgroundColor: "#fff",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: "bold",marginTop:"2.5rem" }}>
          Online AI video
        </Typography>

        <Typography
          className="toolTopText"
          variant="h2"
          sx={{
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          Toolkit
        </Typography>
        <SectionFeatureInfo
          title="Speak to the World with AI-Powered Dubbing"
          subtitle={`Effortlessly translate your videos into multiple languages with a single click.\nExpand your reach and engage global audiences like never before!`}
          imgSrc="../../image/vdoTrans.png"
          linkTo="/ai_studio"
          buttonName="TRANSLATE VIDEO NOW"
        />

        {/* Quick Guide Title */}
        <Typography
          variant="h3"
          sx={{ fontWeight: "bold", marginBottom: "0.5rem" }}
        >
          Quick Guide
        </Typography>
        <Typography
          variant="body1"
          sx={{ marginBottom: "2rem", color: "#777" }}
        >
          Advanced AI-Powered Video Translator
        </Typography>

        {/* Quick Guide Section */}
        <Grid2
          container
          spacing={3}
          justifyContent="center"
          gap={10}
          marginBottom={8}
        >
          <Grid2 item xs={12} sm={6} md={4}>
            <Card
              sx={{
                boxShadow: 3,
                borderRadius: "10px",
                padding: "1rem",
                paddingBlock: "2rem",
                textAlign: "center",
                backgroundColor: "#eef3fb",
                maxWidth: "15rem",
                height: "15rem",
              }}
            >
              <CardContent>
                <img
                  src="../../image/icon_upload.svg"
                  alt="Upload Video"
                  style={{ width: "72px", marginBottom: "1rem" }}
                />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", marginBottom: "0.5rem" }}
                >
                  Upload Video
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Choose the video you want to translate and upload it to our
                  platform.
                </Typography>
              </CardContent>
            </Card>
          </Grid2>

          <Grid2 item xs={12} sm={6} md={4}>
            <Card
              sx={{
                boxShadow: 3,
                borderRadius: "10px",
                padding: "1rem",
                paddingBlock: "2rem",
                textAlign: "center",
                backgroundColor: "#eef3fb",
                maxWidth: "15rem",
                height: "15rem",
              }}
            >
              <CardContent>
                <img
                  src="../../image/icon_select.svg"
                  alt="Select Language"
                  style={{ width: "72px", marginBottom: "1rem" }}
                />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", marginBottom: "0.5rem" }}
                >
                  Select Language
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Select the target language for translation and dubbing.
                </Typography>
              </CardContent>
            </Card>
          </Grid2>

          <Grid2 item xs={12} sm={6} md={4}>
            <Card
              sx={{
                boxShadow: 3,
                borderRadius: "10px",
                padding: "1rem",
                paddingBlock: "2rem",
                textAlign: "center",
                backgroundColor: "#eef3fb",
                maxWidth: "15rem",
                height: "15rem",
              }}
            >
              <CardContent>
                <img
                  src="../../image/icon_download.svg"
                  alt="Download"
                  style={{ width: "72px", marginBottom: "1rem" }}
                />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", marginBottom: "0.5rem" }}
                >
                  Download
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Get your translated video with AI dubbing and share it with
                  your audience.
                </Typography>
              </CardContent>
            </Card>
          </Grid2>
        </Grid2>
        {/* Quick Guide Section */}

        <SectionFeatureInfo
          title="Voice Conversion"
          subtitle="Transform your voice effortlessly! Use AI to convert your voice into different tones, famous voices, or even create a unique custom voice. Perfect for dubbing, content creation, and storytelling."
          imgSrc="../../image/voice-conversion.png"
          linkTo="/voice-converter"
          buttonName="GENERATE NOW"
        />

        <SectionFeatureInfo
          title="Song Voice Conversion"
          subtitle="Unlock the power of AI for your music! Our platform allows you to convert song voices, transforming them into different styles, tones, or even famous voices. Plus, effortlessly translate your song lyrics into multiple languages while preserving the original melody and flow. Perfect for musicians, content creators, and anyone looking to reach a global audience with their music."
          imgSrc="../../image/song-voice-conversion.png"
          linkTo="/song-voice"
          buttonName="SELECT YOUR SONG NOW"
        />

        <SectionFeatureInfo
          title="Text to Speech"
          subtitle="Effortlessly translate your videos into multiple languages with a single click. Expand your reach and engage global audiences like never before!"
          imgSrc="../../image/text-to-speech.png"
          linkTo="/text-speech"
          buttonName="TRY IT NOW"
        />
      </Box>
    </Box>
  );
};

export default Home;
