import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

const VideoTranslation = () => {
  const [originalLanguage, setOriginalLanguage] = useState("Thai");
  const [translateTo, setTranslateTo] = useState("English");
  const [speakerSelected, setSpeakerSelected] = useState(false);
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState("Low");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleDownload = () => {
    if (!file) {
      alert("Please upload a file first.");
      return;
    }
    alert(`Downloading translation of ${file.name}`);
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "0 auto",
        padding: 3,
        textAlign: "center",
        backgroundColor: "#f9f9f9",
        borderRadius: 2,
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: "bold" }}>
        Video Translation
      </Typography>
      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel>Original Language</InputLabel>
        <Select
          value={originalLanguage}
          onChange={(e) => setOriginalLanguage(e.target.value)}
        >
          <MenuItem value="Thai">Thai (Thailand)</MenuItem>
          <MenuItem value="English">English</MenuItem>
          <MenuItem value="Spanish">Spanish</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel>Translate To</InputLabel>
        <Select
          value={translateTo}
          onChange={(e) => setTranslateTo(e.target.value)}
        >
          <MenuItem value="English">English</MenuItem>
          <MenuItem value="French">French</MenuItem>
          <MenuItem value="German">German</MenuItem>
        </Select>
      </FormControl>
      <FormControlLabel
        control={
          <Checkbox
            checked={speakerSelected}
            onChange={(e) => setSpeakerSelected(e.target.checked)}
          />
        }
        label="Select Speaker"
        sx={{ marginBottom: 2 }}
      />
      <Box
        sx={{
          border: "2px dashed #ccc",
          padding: 3,
          borderRadius: 2,
          marginBottom: 2,
          cursor: "pointer",
          backgroundColor: "#fff",
        }}
      >
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="upload-file"
        />
        <label htmlFor="upload-file" style={{ cursor: "pointer" }}>
          {file ? file.name : "Click to Upload File or Drag it Here"}
        </label>
      </Box>
      <Typography variant="body2" sx={{ marginBottom: 2 }}>
        Quality: {quality}
      </Typography>
      <Button
        variant="outlined"
        sx={{ marginBottom: 3 }}
        onClick={() => setQuality(quality === "Low" ? "High" : "Low")}
      >
        Toggle Quality ({quality})
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleDownload}
        sx={{ padding: "10px 20px" }}
      >
        Download
      </Button>
    </Box>
  );
};

export default VideoTranslation;
