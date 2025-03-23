import React from "react";
import { Box, Button, Typography, CircularProgress  } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

const UploadVideo = ({
  loading,
  videoFile,
  handleFileChange,
  handleDelete,
  previewVideoUrl, // แสดงวิดีโอที่อัปโหลด
}) => {
  return (
    <Box
      className="cardDisplay"
      sx={{
        height: "100%",
        display: "flex",
        gap: 2,
        flexDirection: "column",
        justifyContent: loading || !videoFile ? "center" : "flex-start",
        alignItems: "center",
        padding: { xs: 3, md: 5 },
        border: "1px dashed #66798B",
        backgroundColor: "#f9f9f9",
        boxShadow: "0px 20px 24px 4px rgba(170, 188, 204, 0.10)",
      }}
    >
      {/* File Upload Section */}
      {loading ? (
       <CircularProgress size={40} />
      ) : videoFile ? (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
          }}
        >
          {/* Video Information */}
          <Box
            className="videoBox"
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
            <Typography variant="body1">🎬 {videoFile.name}</Typography>
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

          {/* Video Preview */}
          {previewVideoUrl && (
            <Box
              className="previewVideoBox"
              sx={{
                width: "100%",
                border: "2px solid rgba(87, 87, 87, 0.55)",
                borderRadius: "8px",
                padding: 2,
                backgroundColor: "#E3F2FD",
              }}
            >
              <Typography
                variant="body1"
                fontWeight="bold"
                sx={{ textAlign: "center", marginBottom: 1 }}
              >
                🎥 Video Preview
              </Typography>
              <video
                src={previewVideoUrl}
                controls
                style={{
                  width: "100%", // ✅ ปรับให้เต็มกรอบ
                  maxHeight: "40vh", // ✅ จำกัดความสูงไม่ให้ใหญ่เกินไป
                  borderRadius: "12px",
                  objectFit: "contain", // ✅ ให้สัดส่วนวิดีโอแสดงผลได้ดี
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
            UPLOAD VIDEO
            <input
              type="file"
              hidden
              accept="video/*"
              onChange={handleFileChange}
            />
          </Button>

          <Typography
            variant="subtitle2"
            sx={{ marginTop: 2, textAlign: "center" }}
          >
            Click to Upload, or Drag and Drop
            <br />
            Video file up to 500MB
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default UploadVideo;
