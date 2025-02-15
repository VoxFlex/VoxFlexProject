import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const VideoUploadAndDisplay = ({
  apiVideoUrl,
  onFileChange,
  isUploading,
  error,
}) => {
  const handleFileInputChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await onFileChange(file); // Await the parent-provided handler for proper sequencing
    }
  };

  return (
    <Box
      sx={{
        border: "2px dashed #ccc",
        padding: 3,
        borderRadius: 2,
        textAlign: "center",
        minHeight: "50vh",
        backgroundColor: "#f9f9f9",
        display: "flex", // Ensures parent uses flexbox
        justifyContent: "center", // Horizontally center content
        alignItems: "center", // Vertically center content
      }}
    >
      {isUploading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            margin:"0 auto",
            display: "content"
          }}
        >
          <CircularProgress />
        </Box>
      ) : !apiVideoUrl ? (
        <>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileInputChange}
            style={{ display: "none" }}
            id="upload-file"
          />
          <label htmlFor="upload-file" style={{ cursor: "pointer" }}>
            Click to Upload File
          </label>
          {error && (
            <Typography
              sx={{ marginTop: 2, color: "red", fontSize: "0.875rem" }}
            >
              {error}
            </Typography>
          )}
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            maxHeight: "50vh", // Limit height to avoid overflow
            overflow: "hidden",
            display: "contents",
          }}
        >
          <video
            controls
            style={{
              borderRadius: "8px",
              backgroundColor: "#000",
              maxWidth: "100%", 
              maxHeight: "100%",
            }}
          >
            <source src={apiVideoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Box>
      )}
    </Box>
  );
};

export default VideoUploadAndDisplay;
