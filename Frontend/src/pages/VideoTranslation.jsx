// import React, { useState, useEffect } from "react";
// import { Box, Typography, Grid2 } from "@mui/material";
// import VideoTranslationSetting from "../components/VideoTranslationSetting";
// import VideoUploadAndDisplay from "../components/VideoUploadAndDisplay";
// import { uploadVideoToServer } from "../Service/apiService";

// const VideoTranslation = () => {
//   const [originalLanguage, setOriginalLanguage] = useState("");
//   const [translateTo, setTranslateTo] = useState("");
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [processedVideoUrl, setProcessedVideoUrl] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [error, setError] = useState(null);
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);

//   useEffect(() => {
//     const handleResize = () => setWindowWidth(window.innerWidth);
//     window.addEventListener("resize", handleResize);

//     // ลบ event listener เมื่อ component ถูก unmount
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const handleFileChange = async (file) => {
//     setSelectedFile(file);
//     setError(null); // Clear previous errors

//     if (file) {
//       setIsUploading(true);

//       try {
//         const videoUrl = await uploadVideoToServer(
//           file,
//           translateTo || "th" // Use the selected target language
//         );
//         setProcessedVideoUrl(videoUrl); // Update the processed video URL
//       } catch (uploadError) {
//         console.error("Error during upload:", uploadError);
//         setError("Failed to upload and process the video. Please try again.");
//       } finally {
//         setIsUploading(false); // Reset uploading state
//       }
//     }
//   };

//   return (
//     <Box
//       sx={{
//         flexGrow: 1,
//         maxWidth: "90vw",
//         margin: "0 auto",
//         minHeight: "70vh",
//         marginTop: 6,
//       }}
//     >
//       <Grid2
//         container
//         spacing={2}
//         sx={{
//           flexDirection: windowWidth >= 600 ? "row" : "column",
//         }}
//       >
//         {/* Left Section: Video Translation */}
//         <Grid2 xs={12} md={6} size="grow">
//           <Box
//             sx={{
//               padding: 3,
//               backgroundColor: "#fff",
//               borderRadius: 2,
//               boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
//             }}
//           >
//             <Typography
//               variant="h5"
//               sx={{
//                 marginBottom: 3,
//                 fontWeight: "bold",
//                 textAlign: "center",
//                 color: "#333",
//               }}
//             >
//               Video Translation
//             </Typography>
//             <VideoTranslationSetting
//               originalLanguage={originalLanguage}
//               translateTo={translateTo}
//               setOriginalLanguage={setOriginalLanguage}
//               setTranslateTo={setTranslateTo}
//               isUploading={isUploading}
//               selectedFile={selectedFile}
//               processedVideoUrl={processedVideoUrl}
//               onFileChange={handleFileChange}
//             />
//           </Box>
//         </Grid2>

//         {/* Right Section: Video Player */}
//         <Grid2 xs={12} md={6} size="grow">
//           <Box
//             sx={{
//               padding: 3,
//               backgroundColor: "#fff",
//               borderRadius: 2,
//               boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
//               marginBottom: 5,
//             }}
//           >
//             <Typography
//               variant="h5"
//               sx={{
//                 marginBottom: 3,
//                 fontWeight: "bold",
//                 textAlign: "center",
//                 color: "#333",
//               }}
//             >
//               Upload and Preview
//             </Typography>
//             <VideoUploadAndDisplay
//               apiVideoUrl={processedVideoUrl}
//               onFileChange={handleFileChange}
//               isUploading={isUploading}
//               error={error}
//             />
//           </Box>
//         </Grid2>
//       </Grid2>
//     </Box>
//   );
// };

// export default VideoTranslation;

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  Button,
  FormControl,
  CircularProgress,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { uploadVideoToServer } from "../Service/apiService";
import LanguageMapper from "../Service/languageMapper";

const VideoTranslation = () => {
  const [originalLanguage, setOriginalLanguage] = useState("");
  const [translateTo, setTranslateTo] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [processedVideoUrl, setProcessedVideoUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleFileChange = async (event) => {
    if (!originalLanguage) {
      setOriginalLanguage("auto");
    }
    if (!translateTo) {
      setTranslateTo("th");
    }
    if (!speaker) {
      setSpeaker("alloy");
    }

    const file = event.target.files[0];
    if (!file) return; // ถ้าไม่มีไฟล์ให้ return ออกไป

    // รีเซ็ตค่า input เพื่อให้สามารถเลือกไฟล์เดิมซ้ำได้
    event.target.value = null;

    setSelectedFile(file);
    setError(null);

    setIsUploading(true);
    try {
      const videoUrl = await uploadVideoToServer(
        file,
        translateTo || "th",
        speaker
      );
      setProcessedVideoUrl(videoUrl);
    } catch (uploadError) {
      console.error("Error during upload:", uploadError);
      setError("Failed to upload and process the video. Please try again.");
    } finally {
      setIsUploading(false);
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
    <Box
      sx={{
        flexGrow: 1,
        maxWidth: "90vw",
        margin: "0 auto",
        minHeight: "70vh",
        marginTop: 6,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: windowWidth >= 600 ? "row" : "column",
          gap: 3,
        }}
      >
        {/* Left: Video Translation Settings */}
        <Box
          sx={{
            flex: 1,
            padding: 3,
            backgroundColor: "#fff",
            borderRadius: 2,
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              marginBottom: 3,
              fontWeight: "bold",
              textAlign: "center",
              color: "#333",
            }}
          >
            Video Translation
          </Typography>

          {/* Language Selection */}
          <Typography variant="subtitle1" gutterBottom>
            Original Language
          </Typography>

          <FormControl fullWidth sx={{ marginBottom: 2 }} variant="outlined">
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

          {/* Translate to */}
          <Typography variant="subtitle1" gutterBottom>
            Translate to
          </Typography>
          <FormControl fullWidth sx={{ marginBottom: 2 }} variant="outlined">
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

          {/* Speaker Selection */}
          <Typography variant="subtitle1" gutterBottom>
            Speaker
          </Typography>
          <FormControl fullWidth sx={{ marginBottom: 2 }} variant="outlined">
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

          {/* Upload & Download Buttons */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange} // ใช้ event แทนการส่งแค่ไฟล์
              ref={fileInputRef}
              style={{ display: "none" }}
            />

            <Button
              variant="contained"
              color="primary"
              startIcon={selectedFile ? <CloudUploadIcon /> : <AddIcon />}
              disabled={isUploading}
              onClick={() => fileInputRef.current.click()}
            >
              {selectedFile ? "Change Video" : "Upload Video"}
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              disabled={!processedVideoUrl || isUploading}
            >
              Download Video
            </Button>
          </Box>
        </Box>

        {/* Right: Video Upload & Preview */}
        <Box
          sx={{
            flex: 1,
            padding: 3,
            backgroundColor: "#fff",
            borderRadius: 2,
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              marginBottom: 3,
              fontWeight: "bold",
              textAlign: "center",
              color: "#333",
            }}
          >
            Upload and Preview
          </Typography>

          <Box
            sx={{
              border: "2px dashed #ccc",
              padding: 3,
              borderRadius: 2,
              textAlign: "center",
              minHeight: "50vh",
              backgroundColor: "#f9f9f9",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {isUploading ? (
              <CircularProgress />
            ) : !processedVideoUrl ? (
              <>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  id="upload-file"
                />

                <label htmlFor="upload-file" style={{ cursor: "pointer" }}>
                  Click to Upload File
                </label>
                {error && (
                  <Typography
                    sx={{ marginTop: 2, color: "red", fontSize: "0.875rem" }}
                  >
                    {error}
                  </Typography>
                )}
              </>
            ) : (
              <video
                controls
                style={{
                  borderRadius: "8px",
                  backgroundColor: "#000",
                  maxWidth: "100%", // ป้องกันวิดีโอขยายเกินพื้นที่
                  maxHeight: "50vh", // ป้องกันวิดีโอขยายเกินครึ่งจอ
                  objectFit: "contain", // ทำให้วิดีโอไม่ถูกบีบ
                }}
              >
                <source src={processedVideoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default VideoTranslation;
