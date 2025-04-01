import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Grid, List, ListItem } from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  GitHub,
  LinkedIn,
} from "@mui/icons-material";

const kuLogo = "../../image/ku_logo.svg";
const teamImage = "../../image/team_illustration.png";

const About = () => {

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  useEffect(() => {
    const handleResizeWidth = () => setWindowWidth(window.innerWidth);
    const handleResizeHeight = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", handleResizeWidth);
    window.addEventListener("resize", handleResizeHeight);
    return () => {
      window.removeEventListener("resize", handleResizeWidth);
      window.removeEventListener("resize", handleResizeHeight);
    }
  }, []);
  console.log(windowWidth, windowHeight);
  return (
    <>
      <Box
        sx={{
          // backgroundColor: "rgba(193, 219, 227, 0.2)   ",
          px: { xs: 2, sm: 4, md: 8 },
          pt: { xs: 4, sm: 6, md: 8 },
        }}
      >
        <Grid container spacing={3} alignItems="center" sx={{  minHeight: `calc(0.6 * ${windowHeight}px)`  }}>
          {/* Left Column: Headline */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{
                color: "#0A2540",
                lineHeight: 1.5,
                mb: 2,
                textAlign: { xs: "center", md: "left" },
                fontSize: { xs: 0, sm:  `calc(0.041 * ${windowWidth}px)` },
              }}
            >
              Bringing Your Videos <br />
              to Life <span style={{ color: "#3478F6" }}>in Any</span> <br />
              <span style={{ color: "#3478F6" }}>Language</span>
            </Typography>
          </Grid>

          {/* Right Column: KU Logo + Description + Image */}
          <Grid item xs={12} md={6}>
            {/* KU Logo + Description */}
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 3,
                minHeight: `calc(0.35 * ${windowHeight}px)`,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Box
                component="img"
                src={kuLogo}
                alt="Kasetsart University"
                sx={{
                  width: { xs: `calc(0.09 * ${windowHeight}px)`, sm: `calc(0.11 * ${windowWidth}px)` },
                  height: "auto",
                  alignSelf: { xs: "center", sm: "flex-start" },
                }}
              />
              <Typography
                variant="body1"
                sx={{
                  color: "#444",
                  textAlign: { xs: "center", sm: "left" },
                  fontSize: { xs: `calc(0.015 * ${windowHeight}px)`, sm: `calc(0.012 * ${windowWidth}px)` },
                }}
              >
                VoxFlex is a proud outcome of the 01219499-60 Innovative
                Software Group Project course at Kasetsart University. Built
                with AI-powered multimedia processing, our platform enables
                seamless voice conversion, translation, and text-to-speech
                synthesis, making content creation more accessible and
                inclusive.
              </Typography>
            </Box>

            {/* Team Illustration Image */}
            <Box
              component="img"
              src={teamImage}
              alt="Team collaboration"
              sx={{
                width: { xs: "100%", sm: "80%", md: "70%" },
                height: "auto",
                objectFit: "contain",
                display: "block",
                // mx: "auto",
              }}
            />
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          backgroundColor: "#263238",
          color: "#fff",
          px: { xs: 3, md: 6 },
          pt: 6,
          pb: 3,
          // mt: 0,
          // minHeight: "calc(100vh - 400px)",
          // minHeight: "48vh",
          minHeight: `calc(0.3 * ${windowHeight}px)`,
        }}
      >
        {/* 2-column grid */}
        <Grid container spacing={4}>
          {/* Left Column: Our Team */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                borderLeft: "4px solid #00FF66",
                pl: 2,
              }}
            >
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Our Team
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                VoxFlex was developed by a dedicated team of students who
                combined their diverse skills in software engineering, AI, and
                UX design to bring this project to life
              </Typography>

              <List sx={{ listStyleType: "disc", pl: 2 }}>
                <ListItem sx={{ display: "list-item" }}>
                  Danita Frikaow
                </ListItem>
                <ListItem sx={{ display: "list-item" }}>
                  Setthanan Thongpanchang
                </ListItem>
              </List>
            </Box>
          </Grid>

          {/* Right Column: Innovation */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                borderLeft: "4px solid #00FF66",
                pl: 2,
              }}
            >
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Powered by AI, Built for Innovation
              </Typography>
              <Typography variant="body1">
                At VoxFlex, we harness the power of AI to break language
                barriers and enhance digital media. Whether you're a content
                creator, educator, or developer, our goal is to help you
                translate, modify, and enhance voice-based content effortlessly.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Text + Icons */}
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Typography variant="body2" sx={{ color: "#B0BEC5", mb: 2 }}>
            © 2025 VoxFlex. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
            <Facebook fontSize="medium" />
            <Twitter fontSize="medium" />
            <Instagram fontSize="medium" />
            <GitHub fontSize="medium" />
            <LinkedIn fontSize="medium" />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default About;
