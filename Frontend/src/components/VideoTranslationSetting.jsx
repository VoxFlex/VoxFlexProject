import React, { useRef } from "react";
import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  Button,
  FormControl,
} from "@mui/material";

const VideoTranslationSetting = ({
  originalLanguage,
  translateTo,
  setOriginalLanguage,
  setTranslateTo,
  selectedFile,
  processedVideoUrl,
  onFileChange,
  isUploading,
}) => {
  const fileInputRef = useRef(null);

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileChange(file);
    }
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
    <Box sx={{ minHeight: "15rem" }}>
      <Typography variant="subtitle1" gutterBottom>
        Original Language
      </Typography>
      <FormControl fullWidth sx={{ marginBottom: 2 }} variant="outlined">
        <Select
          displayEmpty
          value={originalLanguage}
          onChange={(e) => setOriginalLanguage(e.target.value)}
          renderValue={(selected) => {
            if (!selected) return "Select Language (Default Voice Detection)";
            const languageMap = {
              th: "Thai",
              en: "English",
              fr: "French",
              de: "German",
            };
            return languageMap[selected] || selected;
          }}
        >
          <MenuItem value="Voice Detection">Voice Detection</MenuItem>
          <MenuItem value="Thai">Thai</MenuItem>
          <MenuItem value="English">English</MenuItem>
          <MenuItem value="Spanish">Spanish</MenuItem>
        </Select>
      </FormControl>

      <Typography variant="subtitle1" gutterBottom>
        Translate to
      </Typography>
      <FormControl fullWidth sx={{ marginBottom: 2 }} variant="outlined">
        <Select
          displayEmpty
          value={translateTo}
          onChange={(e) => setTranslateTo(e.target.value)}
          renderValue={(selected) => {
            if (!selected) return "Select Language (Default Thai)";
            // Map the value to the display label
            const languageMap = {
              th: "Thai",
              en: "English",
              fr: "French",
              de: "German",
            };
            return languageMap[selected] || selected;
          }}
        >
          <MenuItem value="th">Thai</MenuItem>
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="fr">French</MenuItem>
          <MenuItem value="German">German</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ display: "flex", gap: 1 }}>
        <input
          type="file"
          accept="video/*"
          onChange={handleFileInputChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={selectedFile ? <CloudUploadIcon /> : <AddIcon />}
          disabled={isUploading}
          onClick={handleFileInputClick}
        >
          {selectedFile ? "Change Video" : "Upload Video"}
        </Button>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          disabled={!processedVideoUrl || isUploading}
        >
          Download to Device
        </Button>
      </Box>
    </Box>
  );
};

export default VideoTranslationSetting;
