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
      <Box
        sx={{
          display: "flex",
          paddingBlock: 10,
          gap: 12,
          justifyContent: "center",
          flexDirection: { xs: "column-reverse", md: "row" }, // Adjust direction for smaller screens
          alignItems: "center",
        }}
      >
        {/* mainText container */}
        <Box
          sx={{
            textAlign: { xs: "center", md: "left" },
            maxWidth: { xs: "100%", md: "50%" },
          }}
        >
          {/* mainText title */}
          <Typography
            sx={{
              fontWeight: "bold",
              color: "#001F3E",
              fontSize: { xs: "2.5rem", md: "3rem" },
            }}
            variant="h2"
          >
            <span style={{ color: "#007AFF" }}>AI Powered</span>&nbsp;Video
            <div>Translator</div>
          </Typography>

          {/* mainText subtitle */}
          <Typography
            variant="subtitle1"
            sx={{
              marginBlock: 4,
              color: "#334C65",
              textAlign: { xs: "center", md: "left" },
              fontSize: "1rem",
              marginLeft: { xs: 0, md: 1 },
            }}
          >
            Bringing Your Videos to Life in Any Language
          </Typography>

          {/* mainText button */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" }, // Stack buttons on small screens
              gap: "1rem",
              justifyContent: { xs: "center", md: "flex-start" },
              marginBottom: "3rem",
            }}
          >
            <Button
              component={Link}
              to="/ai_studio"
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: "#007AFF",
              }}
            >
              Get Started
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: "#ffff",
                color: "#007AFF",
                borderColor: "#007AFF",
                border: 1,
              }}
            >
              Quick Guide
            </Button>
          </Box>
        </Box>
        <Box sx={{ maxWidth: { xs: "80%", md: "40%" }, textAlign: "center" }}>
          <img
            style={{ width: "100%", height: "auto" }}
            src="../../image/image_landing.png"
            alt="Landing Illustration"
          />
        </Box>
      </Box>

      {/* Quick Guide Section */}
      <div style={{ backgroundColor: "#fff", padding: "5rem" }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", marginBottom: "1rem" }}
        >
          Quick Guide
        </Typography>
        <Typography
          variant="body1"
          sx={{ marginBottom: "2rem", color: "#777" }}
        >
          Advanced AI-Powered Video Translator
        </Typography>

        {/* Card Cont container */}

        <Grid2 container spacing={3} justifyContent="center" gap={10}>
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
      </div>
    </Box>
  );
};

export default Home;
