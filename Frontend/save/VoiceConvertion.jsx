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
  Card,
  CardContent,
  Stack,
  Grid,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import RVCApiService from "../src/Service/RVCApiService";

const VoiceConversion = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertedAudioUrl, setConvertedAudioUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    const fetchModels = async () => {
      const availableModels = await RVCApiService.listModels();
      setModels(availableModels);
    };
    fetchModels();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setConvertedAudioUrl(null);
    }
  };

  const handleConvert = async () => {
    if (!selectedFile || !selectedModel) {
      alert("Please select a model and an audio file.");
      return;
    }

    setIsLoading(true);

    try {
      const modelSelected = await RVCApiService.selectModel(selectedModel);
      if (modelSelected) {
        const response = await RVCApiService.convertVoice(selectedFile);
        if (response?.audio_base64) {
          const audioBlob = new Blob(
            [Uint8Array.from(atob(response.audio_base64), (c) => c.charCodeAt(0))],
            { type: "audio/wav" }
          );
          const audioUrl = URL.createObjectURL(audioBlob);
          setConvertedAudioUrl(audioUrl);
        } else {
          alert("Failed to process the audio.");
        }
      } else {
        alert("Failed to select model.");
      }
    } catch (error) {
      console.error("Error during conversion:", error);
      alert("An error occurred during conversion.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!convertedAudioUrl) return;
    const link = document.createElement("a");
    link.href = convertedAudioUrl;
    link.download = "converted_audio.wav";
    link.click();
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
      <Card sx={{ width: 500, padding: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" textAlign="center" gutterBottom>
            Voice Conversion
          </Typography>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select Voice Model</InputLabel>
            <Select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
              {models.map((model, index) => (
                <MenuItem key={index} value={model}>{model}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Stack spacing={2} alignItems="center">
            <input type="file" accept="audio/*" onChange={handleFileChange} ref={fileInputRef} style={{ display: "none" }} />
            <Button variant="contained" startIcon={<CloudUploadIcon />} onClick={() => fileInputRef.current.click()}>
              {selectedFile ? "Change File" : "Upload Voice File"}
            </Button>

            {selectedFile && <Typography variant="body2">📂 {selectedFile.name}</Typography>}

            <Button
              variant="contained"
              color="secondary"
              onClick={handleConvert}
              disabled={!selectedFile || !selectedModel || isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Convert Voice"}
            </Button>
          </Stack>

          {convertedAudioUrl && (
            <Grid container spacing={2} justifyContent="center" sx={{ mt: 3 }}>
              <Grid item xs={12} textAlign="center">
                <Typography color="success.main">✅ Conversion Completed!</Typography>
                <audio controls style={{ width: "100%", marginTop: 10 }}>
                  <source src={convertedAudioUrl} type="audio/wav" />
                  Your browser does not support the audio tag.
                </audio>
              </Grid>
              <Grid item>
                <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleDownload}>
                  Download Audio
                </Button>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default VoiceConversion;
