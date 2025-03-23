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

import DownloadIcon from "@mui/icons-material/Download";
import "../components/Component.css";
import UploadAudio from "../components/UploadAudio";

import LanguageMapper from "../Service/languageMapper";
import { voiceTranslation } from "../Service/apiService";

const AudioTranslation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [audioFile, setAudioFile] = useState(null); //  ใช้เก็บไฟล์เสียงที่ผู้ใช้อัปโหลด และใช้เป็นอินพุตในการแปลงเสียง
  const [originalAudioUrl, setOriginalAudioUrl] = useState(null); // → ใช้สำหรับเปิดเล่น เสียงต้นฉบับ
  const [convertedAudioUrl, setConvertedAudioUrl] = useState(null); // → ใช้สำหรับเปิดเล่น เสียงที่แปลงแล้ว
  const [speaker, setSpeaker] = useState("");
  const [originalLanguage, setOriginalLanguage] = useState("");
  const [translateTo, setTranslateTo] = useState("");

  const staticParams = {
    card: {
      left: {
        height: { xs: "auto", md: "48vh" },
        heightGrid: 5,
      },
      right: {
        height: { xs: "auto", md: "48vh" },
        heightGrid: 7,
      },
    },
  };
  const handleConvert = async () => {
    if (!originalLanguage) {
      setOriginalLanguage("auto");
    }
    if (!translateTo) {
      setTranslateTo("th");
    }
    if (!speaker) {
      setSpeaker("alloy");
    }
    console.log(originalLanguage, translateTo, speaker);
    if (!audioFile || !originalLanguage || !translateTo || !speaker) {
      alert(
        "Please select a language, target language, speaker, and upload an audio file."
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await voiceTranslation(audioFile, translateTo, speaker);

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
        setConvertedAudioUrl(audioUrl); // Show converted audio only after generation
      } else {
        alert("Failed to process the audio.");
      }
    } catch (error) {
      console.error("Error during translation:", error);
      alert("An error occurred during translation.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!convertedAudioUrl) return;
    const link = document.createElement("a");
    link.href = convertedAudioUrl;
    link.download = "translated_audio.wav";
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
    <Box sx={{ mt: 5, mx: { xs: 2, md: "10vw" }, mb: 8 }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex", // เพิ่ม Flexbox
          flexDirection: "column", // ให้เนื้อหาจัดเรียงในแนวตั้ง
          justifyContent: "center", // จัดให้อยู่ตรงกลางแนวตั้ง
          alignItems: "center", // จัดให้อยู่ตรงกลางแนวนอน
          borderRadius: 2,
          boxShadow: 3,
          background: "linear-gradient(90deg, #D9F1FF 0%, #EADBF5 100%)",
          textAlign: "center",
          padding: { xs: 2, md: 4 },
          minHeight: { xs: "15vh", md: "20vh" }, // ปรับขนาดให้เหมาะสม
        }}
      >
        <div style={{ padding: "5" }}>
          <Typography variant="h4" fontWeight="bold" mb={1}>
            Break Language Barriers with AI Audio Translation
          </Typography>
          <Typography variant="body1">
            Translate your audio into multiple languages with AI-powered voice
            dubbing—instantly and effortlessly. No limits, no barriers—just
            seamless global communication at your fingertips!
          </Typography>
        </div>
      </Box>

      {/* Content Section */}
      <Grid container spacing={3} sx={{ mt: 1, pb: 10, alignItems: "center" }}>
        {/* Voice Model Card */}
        <Grid
          item
          xs={12}
          md={staticParams.card.left.heightGrid}
          sx={{ height: staticParams.card.left.height }}
        >
          <Card
            className="cardInput"
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: { xs: 3, md: 5 },
            }}
          >
            <div>
              <Typography
                variant="subtitle1"
                color="#007AFB"
                sx={{ fontWeight: "bold" }}
              >
                Original Language
              </Typography>

              <FormControl fullWidth variant="outlined">
                <Select
                  displayEmpty
                  value={originalLanguage}
                  onChange={(e) => {
                    console.log(e.target.value); // เช็คว่าค่าออกมาตรงไหม
                    return setOriginalLanguage(e.target.value);
                  }}
                  renderValue={(selected) => {
                    if (!selected)
                      return "Select Language (Default Voice Detection)";
                    return LanguageMapper[selected] || selected;
                  }}
                >
                  {Object.entries(LanguageMapper).map(([code, language]) => (
                    <MenuItem key={code} value={code}>
                      {language}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography
                variant="subtitle1"
                color="#007AFB"
                sx={{ fontWeight: "bold", mt: 2 }}
              >
                Target Language
              </Typography>

              <FormControl fullWidth variant="outlined">
                <Select
                  displayEmpty
                  value={translateTo}
                  onChange={(e) => {
                    console.log(e.target.value); // เช็คว่าค่าออกมาตรงไหม
                    return setTranslateTo(e.target.value);
                  }}
                  renderValue={(selected) => {
                    if (!selected) return "Select Language (Default Thai)";
                    return LanguageMapper[selected] || selected;
                  }}
                >
                  {Object.entries(LanguageMapper)
                    .slice(1)
                    .map(([code, language]) => (
                      <MenuItem key={code} value={code}>
                        {language}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              <Typography
                variant="subtitle1"
                color="#007AFB"
                sx={{ fontWeight: "bold", mt: 2 }}
              >
                Speaker
              </Typography>
              <FormControl
                fullWidth
                sx={{ marginBottom: 2 }}
                variant="outlined"
              >
                <Select
                  displayEmpty
                  value={speaker}
                  onChange={(e) => setSpeaker(e.target.value)}
                  renderValue={(selected) => {
                    if (!selected) return "Select Speaker (Default Alloy)";
                    const speakerMap = {
                      alloy: "Alloy",
                      ash: "Ash",
                      coral: "Coral",
                      echo: "Echo",
                      fable: "Fable",
                      onyx: "Onyx",
                      nova: "Nova",
                      sage: "Sage",
                      shimmer: "Shimmer",
                    };
                    return speakerMap[selected] || selected;
                  }}
                >
                  <MenuItem value="alloy">Alloy</MenuItem>
                  <MenuItem value="ash">Ash</MenuItem>
                  <MenuItem value="coral">Coral</MenuItem>
                  <MenuItem value="echo">Echo</MenuItem>
                  <MenuItem value="fable">Fable</MenuItem>
                  <MenuItem value="onyx">Onyx</MenuItem>
                  <MenuItem value="nova">Nova</MenuItem>
                  <MenuItem value="sage">Sage</MenuItem>
                  <MenuItem value="shimmer">Shimmer</MenuItem>
                </Select>
              </FormControl>
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
                  disabled={!audioFile || isLoading}
                  onClick={handleConvert}
                >
                  GENERATE TRANSLATION
                </Button>
              </div>
            </Box>
          </Card>
        </Grid>

        {/* Upload Audio Card */}
        <Grid
          item
          xs={12}
          md={staticParams.card.right.heightGrid}
          sx={{ height: staticParams.card.right.height }}
        >
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

export default AudioTranslation;
