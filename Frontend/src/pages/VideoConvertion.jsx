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
import UploadVideo from "../components/UploadVideo";
import UploadModelButton from "../components/UploadModelButton";

const VideoConvertion = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("Justin Bieber");
  const [isLoading, setIsLoading] = useState(false);
  const [videoFile, setVideoFile] = useState(null); // ไฟล์วิดีโอที่อัปโหลด
  const [previewVideoUrl, setPreviewVideoUrl] = useState(null); // URL วิดีโอที่จะแสดง

  useEffect(() => {
    const fetchModels = async () => {
      const availableModels = await RVCApiService.listModels();
      setModels(availableModels);
    };
    fetchModels();
  }, []);

  const handleConvert = async () => {
    if (!videoFile || !selectedModel) {
      alert("Please select a model and a video file.");
      return;
    }

    setIsLoading(true);

    try {
      const modelSelected = await RVCApiService.selectModel(selectedModel);
      if (modelSelected) {
        const response = await RVCApiService.convertVideo(videoFile);
        if (response?.video_base64) {
          const videoBlob = new Blob(
            [
              Uint8Array.from(atob(response.video_base64), (c) =>
                c.charCodeAt(0)
              ),
            ],
            { type: "video/mp4" }
          );
          const videoUrl = URL.createObjectURL(videoBlob);
          setPreviewVideoUrl(videoUrl); // แสดงวิดีโอที่แปลงแล้ว
        } else {
          alert("Failed to process the video.");
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
    if (!previewVideoUrl) return;
    const link = document.createElement("a");
    link.href = previewVideoUrl;
    link.download = "converted_video.mp4";
    link.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedFormats = ["video/mp4", "video/quicktime"];
      if (!allowedFormats.includes(file.type)) {
        alert("Invalid file format. Please upload an MP4 or MOV file.");
        return;
      }

      setIsLoading(true);

      setTimeout(() => {
        setVideoFile(file);
        setPreviewVideoUrl(URL.createObjectURL(file)); // Show original video
        setIsLoading(false);
      }, 2000);
    }
  };

  const handleDelete = () => {
    setVideoFile(null);
    setPreviewVideoUrl(null);
  };

  return (
    <Box sx={{ mt: 5, mx: { xs: 2, md: 15 }, mb: 12 }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 2,
          boxShadow: 3,
          background: "linear-gradient(90deg, #D9F1FF 0%, #EADBF5 100%)",
          textAlign: "center",
          padding: { xs: 2, md: 4 },
          minHeight: { xs: "15vh", md: "20vh" },
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Limitless Video Transformation
        </Typography>
        <Typography variant="body1">
          Convert your videos with royalty-free voices, train custom voices, and
          create copyright-free videos—unlock endless creative possibilities!
        </Typography>
      </Box>

      {/* Content Section */}
      <Grid
        container
        spacing={3}
        sx={{ mt: 1, pb: 5, alignItems: "flex-start" }}
      >
        {/* Voice Model Card */}
        <Grid item xs={12} md={5} sx={{ height: { xs: "auto", md: "auto" } }}>
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
            {/** Select Voice Models */}
            <div>
              <Typography
                variant="subtitle1"
                color="#007AFB"
                sx={{ fontWeight: "bold", marginBottom: 2 }}
              >
                Select Voice Models
              </Typography>

              <FormControl fullWidth>
                <Select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  sx={{
                    minHeight: "45px", // 🔥 Consistent height for select box
                    borderRadius: "8px",
                  }}
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

            {/* Back Download Generate Button */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 1, sm: 2 },
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
                  disabled={!previewVideoUrl}
                />
                <Button
                  variant="contained"
                  disabled={!videoFile || !selectedModel || isLoading}
                  onClick={handleConvert}
                >
                  GENERATE VIDEO
                </Button>
              </div>
              {/* Back Download Generate Button */}
            </Box>
          </Card>
        </Grid>

        {/* Upload Video Card */}
        <Grid item xs={12} md={7} sx={{ height: { xs: "auto", md: "60vh" } }}>
          <UploadVideo
            loading={isLoading}
            videoFile={videoFile}
            handleFileChange={handleFileChange}
            handleDelete={handleDelete}
            previewVideoUrl={previewVideoUrl} // แสดงวิดีโอที่อัปโหลด
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default VideoConvertion;
