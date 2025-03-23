import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  FormControl,
  Card,
  Grid,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import "../components/Component.css";
import { textToSpeech } from "../Service/apiService";

const TextToSpeech = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [convertedAudioUrl, setConvertedAudioUrl] = useState(null);
  const [speaker, setSpeaker] = useState("alloy");
  const staticParams = {
    card: {
      left: {
        height: { xs: "auto", md: "48vh" },
        heightGrid: 6,
      },
      right: {
        height: { xs: "auto", md: "48vh" },
        heightGrid: 6,
      },
      main: {
        alignItems: "center",
      },
    },
  };
  const handleConvert = async () => {
    if (!textInput.trim()) {
      alert("Please enter text for TTS conversion.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await textToSpeech(textInput, "en", speaker);

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
        setConvertedAudioUrl(audioUrl);
      } else {
        alert("Failed to process the text-to-speech conversion.");
      }
    } catch (error) {
      console.error("Error during TTS conversion:", error);
      alert("An error occurred during TTS conversion.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!convertedAudioUrl) return;
    const link = document.createElement("a");
    link.href = convertedAudioUrl;
    link.download = "tts_audio.wav";
    link.click();
  };

  return (
    <Box sx={{ mt: 5, mx: { xs: 2, md: "12vw" }, mb: 8 }}>
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
          Text to Speech
        </Typography>
        <Typography variant="body1">
          Convert your vocals with royalty-free voices, train custom voices, and
          create copyright-free cover vocals—unlock endless creative
          possibilities!
        </Typography>
      </Box>

      {/* Content Section */}
      <Grid
        container
        spacing={3}
        sx={{ mt: 2, pb: 10, alignItems: staticParams.card.main.alignItems }}
      >
        {/* Text Input & Speaker Selection Card */}
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
                sx={{ fontWeight: "bold", marginBottom: 2 }}
              >
                Label
              </Typography>

              <TextField
                color="info"
                backgroundColor="#a9FAFB"
                fullWidth
                multiline
                variant="standard"
                rows={7}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type your text here..."
              />

              <Typography
                variant="subtitle1"
                color="#007AFB"
                sx={{ fontWeight: "bold", mt: 5 }}
              >
                Select Speaker
              </Typography>
              <FormControl fullWidth variant="outlined">
                <Select
                  displayEmpty
                  value={speaker}
                  onChange={(e) => setSpeaker(e.target.value)}
                  renderValue={(selected) => {
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
                mt: 2,
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
                  disabled={!textInput || isLoading}
                  onClick={handleConvert}
                >
                  {isLoading ? (
                    <CircularProgress size={24} sx={{ color: "#fff" }} />
                  ) : (
                    "GENERATE SPEECH"
                  )}
                </Button>
              </div>
            </Box>
          </Card>
        </Grid>

        {/* Audio Preview Card */}
        <Grid
          item
          xs={12}
          md={staticParams.card.right.heightGrid}
          sx={{ height: staticParams.card.right.height }}
        >
          <Card
            className="audioPreview"
            sx={{
              padding: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 2,
              backgroundColor: "#F9FAFB",
              borderRadius: 12,
              boxShadow: "0px 20px 24px 4px rgba(170, 188, 204, 0.10)",
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              🎧 Audio Preview
            </Typography>
            <audio
              src={convertedAudioUrl || ""}
              controls
              disabled={!convertedAudioUrl} // ✅ Disabled when no audio available
              style={{
                width: "100%",
                borderRadius: "8px",
                opacity: convertedAudioUrl ? 1 : 0.5, // 🔥 Visual indicator when disabled
              }}
            />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TextToSpeech;
