import React from "react";
import VideoTranslation from "../components/VideoTranslation";
import Box from "@mui/system/Box";
import Grid from "@mui/system/Grid";

const Translate = () => {

  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Grid container spacing={3}>
        {/* Left Section: YouTube Preview */}
        <Grid item xs={12} md={6}>
            <Box sx={{ aspectRatio: "16/9", backgroundColor: "#ccc" }}>
              {/* Placeholder for YouTube Video */}
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/example"
                title="YouTube Video Preview"
                allowFullScreen
                style={{ borderRadius: "8px" }}
              ></iframe>
            </Box>
        </Grid>

        {/* Right Section: Translation Settings */}
        <Grid item xs={12} md={6}>
            <VideoTranslation />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Translate;
