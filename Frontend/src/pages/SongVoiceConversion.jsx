import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  CircularProgress,
  FormControl,
  Card,
  Grid,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import RVCApiService from "../Service/RVCApiService";
import "../components/Component.css";
import UploadAudio from "../components/UploadAudio";
import UploadModelButton from "../components/UploadModelButton";

const SongVoiceConversion = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("Justin Bieber");
  const [isLoading, setIsLoading] = useState(false);
  const [audioFile, setAudioFile] = useState(null); // → ใช้เก็บไฟล์เสียงที่ผู้ใช้อัปโหลด และใช้เป็นอินพุตในการแปลงเสียง
  const [originalAudioUrl, setOriginalAudioUrl] = useState(null); // → ใช้สำหรับเปิดเล่น เสียงต้นฉบับ
  const [convertedAudioUrl, setConvertedAudioUrl] = useState(null); // → ใช้สำหรับเปิดเล่น เสียงที่แปลงแล้ว

  useEffect(() => {
    const fetchModels = async () => {
      const availableModels = await RVCApiService.listModels();
      setModels(availableModels);
    };
    fetchModels();
  }, []);

  const handleConvert = async () => {
    if (!audioFile || !selectedModel) {
      alert("Please select a model and an audio file.");
      return;
    }

    setIsLoading(true);

    try {
      const modelSelected = await RVCApiService.selectModel(selectedModel);
      if (modelSelected) {
        const response = await RVCApiService.convertSong(audioFile);
        if (response?.audio_base64) {
          const audioBlob = new Blob(
            [
              Uint8Array.from(atob(response.audio_base64), (c) =>
                c.charCodeAt(0)
              ),
            ],
            { type: "audio/wav" }
          );
          const audioUrl = URL.createObjectURL(audioBlob);
          setConvertedAudioUrl(audioUrl); // Show only after Generate Speech
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsLoading(true);

      setTimeout(() => {
        setAudioFile(file);
        setOriginalAudioUrl(URL.createObjectURL(file)); // Show Original Only
        setConvertedAudioUrl(null); // Reset Converted Audio
        setIsLoading(false);
      }, 2000);
    }
  };

  const handleDelete = () => {
    setAudioFile(null);
    setOriginalAudioUrl(null);
    setConvertedAudioUrl(null);
  };

  return (
    <Box sx={{ mt: 5, mx: { xs: 2, md: 15 }, mb: 3 }}>
      {/* Header Section */}
      <div 
        style={{
          display: "flex", // ใช้ Flexbox เพื่อควบคุมการจัดวาง
          alignItems: "center", // จัดให้อยู่กึ่งกลางแนวแกน Y
          justifyContent: "center", // จัดให้อยู่กึ่งกลางแนวแกน X (ถ้าต้องการ)
          
        }}
      >
        <img
          src="../../image/songConvertionInfo.svg"
          alt="Info Box"
          style={{
            width: "100%",
            objectFit: "contain", // ✅ ให้ภาพเต็ม Box โดยไม่ถูกตัด
          }}
        />
      </div>
      {/* </Box> */}

      {/* Content Section */}
      <Grid container spacing={3} sx={{ pb: 10, alignItems: "flex-start" , mb: 6}}>
        {/* Voice Model Card */}
        <Grid item xs={12} md={5} sx={{ height: { xs: "auto", md: "42vh" } }}>
          <Card
            className="cardInput"
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: { xs: 2, sm: 3, md: 4, lg: 5 },
              gap: 1,
            }}
          >
            <div>
              <Typography
                variant="subtitle1"
                color="#007AFF"
                sx={{ fontWeight: "bold", marginBottom: 2 }}
              >
                Select Voice Models
              </Typography>

              <FormControl fullWidth>
                <Select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                >
                  {models.map((model, index) => (
                    <MenuItem key={index} value={model}>
                      {model}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <UploadModelButton />
            </div>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button variant="outlined" onClick={() => window.history.back()}>
                Back
              </Button>
              <div style={{ display: "flex", gap: "8px" }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownload}
                  disabled={!convertedAudioUrl}
                />
                <Button
                  variant="contained"
                  disabled={!audioFile || !selectedModel || isLoading}
                  onClick={handleConvert}
                >
                  GENERATE SONG
                </Button>
              </div>
            </Box>
          </Card>
        </Grid>

        {/* Upload Audio Card */}
        <Grid item xs={12} md={7} sx={{ height: { xs: "auto", md: "42vh" } }}>
          <UploadAudio
            loading={isLoading}
            audioFile={audioFile}
            handleFileChange={handleFileChange}
            handleDelete={handleDelete}
            originalAudioUrl={originalAudioUrl} // New Original Audio URL
            convertedAudioUrl={convertedAudioUrl} // New Audio URL after Generate
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SongVoiceConversion;
