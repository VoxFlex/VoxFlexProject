import React from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

const UploadAudio = ({
  loading,
  audioFile,
  handleFileChange,
  handleDelete,
  originalAudioUrl, // Original Audio
  convertedAudioUrl, // Converted Audio
}) => {
  return (
    <Box
      className="cardDisplay"
      sx={{
        height: "100%",
        display: "flex",
        gap: 2,
        flexDirection: "column",
        justifyContent: loading || !audioFile ? "center" : "flex-start", // ✅ อยู่ด้านบนสุดของแนว Y
        alignItems: "center",
        padding: { xs: 3, md: 5 },
        border: "1px dashed #66798B",
        backgroundColor: "#f9f9f9",
        boxShadow: "0px 20px 24px 4px rgba(170, 188, 204, 0.10)",
      }}
    >
      {/* Loading Indicator */}
      {loading ? (
        <CircularProgress size={40} />
      ) : audioFile ? (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
          }}
        >
          {/* Audio Information with Delete Button */}
          <Box
            className="audioBox"
            sx={{
              width: "100%",
              padding: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#fff",
              border: "1px solid #D3D3D3",
              borderRadius: "8px",
            }}
          >
            <Typography variant="body1">📂 {audioFile.name}</Typography>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              size="small"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Box>

          {/* Original Audio Section */}
          {originalAudioUrl && (
            <Box
              className="originalAudioBox"
              sx={{
                width: "100%",
                border: "1px solid rgb(90, 104, 183)",
                borderRadius: "8px",
                padding: 2,
                backgroundColor: "#E3F2FD",
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Typography variant="body1" fontWeight="bold">
                🎵 Original Audio
              </Typography>
              <audio
                src={originalAudioUrl}
                controls
                style={{
                  width: "100%",
                  border: "1px solid rgba(36, 37, 37, 0.27)",
                  borderRadius: 30,
                }}
              />
            </Box>
          )}
        </Box>
      ) : (
        <Box sx={{ display: "inline-grid" }}>
          <Button
            variant="contained"
            color="primary"
            component="label"
            startIcon={<CloudUploadIcon />}
            sx={{
              padding: "8px 16px",
              borderRadius: "100px",
            }}
          >
            UPLOAD AUDIO
            <input
              type="file"
              hidden
              accept="audio/*"
              onChange={handleFileChange}
            />
          </Button>

          <Typography
            variant="subtitle2"
            sx={{ marginTop: 2, textAlign: "center" }}
          >
            Click to Upload, or Drag and Drop
            <br />
            Audio file up to 50MB
          </Typography>
        </Box>
      )}

      {/* Converted Audio Section */}
      {convertedAudioUrl && (
        <Box
          className="convertedAudioBox"
          sx={{
            width: "100%",
            border: "1px solid rgb(102, 177, 105)",
            borderRadius: "8px",
            padding: 2,
            backgroundColor: "#E8F5E9",
            gap: 1,
          }}
        >
          <Typography variant="body1" fontWeight="bold">
            🎧 Converted Audio
          </Typography>
          <audio
            src={convertedAudioUrl}
            controls
            style={{
              width: "100%",
              border: "1px solid rgba(36, 37, 37, 0.27)",
              borderRadius: 30,
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default UploadAudio;
