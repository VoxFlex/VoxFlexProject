import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  CircularProgress,
  FormControl,
  InputLabel,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";

const BASE_URL = "http://localhost:8000/rvc"; // Change to your API base URL

const VoiceConversion = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertedAudioUrl, setConvertedAudioUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = React.useRef(null);

  // 🔹 Fetch Available Models
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/models`);
        setModels(response.data.available_models);
      } catch (error) {
        console.error("❌ Error fetching models:", error);
      }
    };
    fetchModels();
  }, []);

  // 🔹 Handle File Selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setConvertedAudioUrl(null); // Reset previous output
    }
  };

  // 🔹 Upload & Convert
  const handleConvert = async () => {
    if (!selectedFile || !selectedModel) {
      alert("Please select a model and an audio file.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(`${BASE_URL}/voice/convert`, formData);
      const base64Audio = response.data.audio_base64;
      const outputModel = response.data.model_name;

      // 🔹 Decode Base64 → Audio Blob
      const audioBlob = new Blob([Uint8Array.from(atob(base64Audio), (c) => c.charCodeAt(0))], { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setConvertedAudioUrl(audioUrl);
      alert(`✅ Voice Converted! Model: ${outputModel}`);
    } catch (error) {
      console.error("❌ Error converting voice:", error);
      alert("Failed to process the audio.");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Download Converted Audio
  const handleDownload = () => {
    if (!convertedAudioUrl) return;
    const link = document.createElement("a");
    link.href = convertedAudioUrl;
    link.download = "converted_audio.wav";
    link.click();
  };

  return (
    <Box sx={{ textAlign: "center", maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <Typography variant="h4" sx={{ marginBottom: 3 }}>Voice Conversion</Typography>

      {/* 🔹 Model Selection */}
      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel>Select Voice Model</InputLabel>
        <Select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          {models.map((model, index) => (
            <MenuItem key={index} value={model}>{model}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* 🔹 File Upload */}
      <input
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
      <Button
        variant="contained"
        color="primary"
        startIcon={<CloudUploadIcon />}
        onClick={() => fileInputRef.current.click()}
        sx={{ marginBottom: 2 }}
      >
        {selectedFile ? "Change File" : "Upload Voice File"}
      </Button>

      {/* 🔹 Show Selected File */}
      {selectedFile && (
        <Typography sx={{ marginBottom: 2 }}>
          Selected: {selectedFile.name}
        </Typography>
      )}

      {/* 🔹 Convert Button */}
      <Button
        variant="contained"
        color="secondary"
        onClick={handleConvert}
        disabled={!selectedFile || !selectedModel || isLoading}
        sx={{ marginBottom: 2 }}
      >
        {isLoading ? <CircularProgress size={24} /> : "Convert Voice"}
      </Button>

      {/* 🔹 Download & Play Converted Audio */}
      {convertedAudioUrl && (
        <Box>
          <Typography sx={{ marginTop: 2 }}>✅ Conversion Completed!</Typography>
          <audio controls style={{ width: "100%", marginTop: 10 }}>
            <source src={convertedAudioUrl} type="audio/wav" />
            Your browser does not support the audio tag.
          </audio>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            sx={{ marginTop: 2 }}
          >
            Download Converted Audio
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default VoiceConversion;
