import React, { useState, useEffect } from "react";
import { Box, Typography, Grid2 } from "@mui/material";
import VideoTranslationSetting from "../components/VideoTranslationSetting";
import VideoUploadAndDisplay from "../components/VideoUploadAndDisplay";
import { uploadVideoToServer } from "../Service/apiService";

const AiStudio = () => {
  const [originalLanguage, setOriginalLanguage] = useState("");
  const [translateTo, setTranslateTo] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [processedVideoUrl, setProcessedVideoUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    // ลบ event listener เมื่อ component ถูก unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleFileChange = async (file) => {
    setSelectedFile(file);
    setError(null); // Clear previous errors

    if (file) {
      setIsUploading(true);

      try {
        const videoUrl = await uploadVideoToServer(
          file,
          translateTo || "th" // Use the selected target language
        );
        setProcessedVideoUrl(videoUrl); // Update the processed video URL
      } catch (uploadError) {
        console.error("Error during upload:", uploadError);
        setError("Failed to upload and process the video. Please try again.");
      } finally {
        setIsUploading(false); // Reset uploading state
      }
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        maxWidth: "90vw",
        margin: "0 auto",
        minHeight: "70vh",
        marginTop: 6,
      }}
    >
      <Grid2
        container
        spacing={2}
        sx={{
          flexDirection: windowWidth >= 600 ? "row" : "column",
        }}
      >
        {/* Left Section: Video Translation */}
        <Grid2 xs={12} md={6} size="grow">
          <Box
            sx={{
              padding: 3,
              backgroundColor: "#fff",
              borderRadius: 2,
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                marginBottom: 3,
                fontWeight: "bold",
                textAlign: "center",
                color: "#333",
              }}
            >
              Video Translation
            </Typography>
            <VideoTranslationSetting
              originalLanguage={originalLanguage}
              translateTo={translateTo}
              setOriginalLanguage={setOriginalLanguage}
              setTranslateTo={setTranslateTo}
              isUploading={isUploading}
              selectedFile={selectedFile}
              processedVideoUrl={processedVideoUrl}
              onFileChange={handleFileChange}
            />
          </Box>
        </Grid2>

        {/* Right Section: Video Player */}
        <Grid2 xs={12} md={6} size="grow">
          <Box
            sx={{
              padding: 3,
              backgroundColor: "#fff",
              borderRadius: 2,
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              marginBottom: 5,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                marginBottom: 3,
                fontWeight: "bold",
                textAlign: "center",
                color: "#333",
              }}
            >
              Upload and Preview
            </Typography>
            <VideoUploadAndDisplay
              apiVideoUrl={processedVideoUrl}
              onFileChange={handleFileChange}
              isUploading={isUploading}
              error={error}
            />
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default AiStudio;
