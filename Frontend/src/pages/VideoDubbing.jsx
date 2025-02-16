import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Grid, Button, FormControl, Select, MenuItem, CircularProgress } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from "@mui/icons-material/Add";
import { uploadVideoToServer } from "../Service/apiService";

const VideoDubbing = () => {
  const [originalLanguage, setOriginalLanguage] = useState("");
  const [translateTo, setTranslateTo] = useState("");
  const [selectedSpeaker, setSelectedSpeaker] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [processedVideoUrl, setProcessedVideoUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (file) => {
    setSelectedFile(file);
    setError(null);
    if (file) {
      setIsUploading(true);
      try {
        const videoUrl = await uploadVideoToServer(file, translateTo || "th");
        setProcessedVideoUrl(videoUrl);
      } catch (uploadError) {
        console.error("Error during upload:", uploadError);
        setError("Failed to upload and process the video. Please try again.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleDownload = () => {
    if (!processedVideoUrl) {
      alert("Please process a video first.");
      return;
    }
    const link = document.createElement("a");
    link.href = processedVideoUrl;
    link.download = "translated_video.mp4";
    link.click();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "row", gap: 3, padding: 4 }}>
      {/* Left Section: Form Controls */}
      <Box sx={{ width: "40%", backgroundColor: "#fff", padding: 4, borderRadius: 2, boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>Original Language</Typography>
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <Select displayEmpty value={originalLanguage} onChange={(e) => setOriginalLanguage(e.target.value)}>
            <MenuItem value="">Select Language</MenuItem>
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="th">Thai</MenuItem>
          </Select>
        </FormControl>

        <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>Target Language</Typography>
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <Select displayEmpty value={translateTo} onChange={(e) => setTranslateTo(e.target.value)}>
            <MenuItem value="">Select Language</MenuItem>
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="th">Thai</MenuItem>
          </Select>
        </FormControl>

        <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>Speaker</Typography>
        <FormControl fullWidth sx={{ marginBottom: 3 }}>
          <Select displayEmpty value={selectedSpeaker} onChange={(e) => setSelectedSpeaker(e.target.value)}>
            <MenuItem value="">Select Speaker</MenuItem>
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
          </Select>
        </FormControl>

        <input type="file" accept="video/*" ref={fileInputRef} style={{ display: "none" }} onChange={(e) => handleFileChange(e.target.files[0])} />
        <Button variant="contained" fullWidth color="primary" startIcon={<CloudUploadIcon />} disabled={isUploading} onClick={handleFileInputClick}>Upload Video</Button>
        <Button variant="outlined" fullWidth sx={{ marginTop: 2 }} startIcon={<DownloadIcon />} disabled={!processedVideoUrl || isUploading} onClick={handleDownload}>Download to Device</Button>
      </Box>

      {/* Right Section: Video Preview */}
      <Box sx={{ width: "60%", backgroundColor: "#fff", padding: 4, borderRadius: 2, boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>VideoName.mp4</Typography>
        {isUploading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <CircularProgress />
          </Box>
        ) : processedVideoUrl ? (
          <video controls style={{ borderRadius: "8px", backgroundColor: "#000", maxWidth: "100%", maxHeight: "100%" }}>
            <source src={processedVideoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <Typography sx={{ textAlign: "center", color: "gray" }}>No video uploaded</Typography>
        )}
      </Box>
    </Box>
  );
};

export default VideoDubbing;
