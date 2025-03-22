import React, { useRef } from "react";
import { Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import RVCApiService from "../Service/RVCApiService";

const UploadModelButton = () => {
  const fileInputRef = useRef(null);

  const handleModelUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const result = await RVCApiService.uploadModel(file);
    if (result) {
      alert("✅ Model uploaded successfully!");
    } else {
      alert("❌ Failed to upload model.");
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        hidden
        accept=".zip"
        onChange={handleModelUpload}
      />

      <Button
        variant="contained"
        color="primary"
        startIcon={<CloudUploadIcon />}
        onClick={() => fileInputRef.current.click()}
        sx={{
          width: {
            xs: "100%", // จอเล็กสุด (มือถือ) : เต็มจอ
            sm: "90%", // แท็บเล็ตขนาดเล็ก: 90% ของจอ
            md: "80%", // แท็บเล็ตขนาดกลาง: 80% ของจอ
            xl: "75%", // หน้าจอใหญ่มาก: 60% ของจอ
          },
          minWidth: "15vw", // ขนาดต่ำสุดเพื่อป้องกันปุ่มที่เล็กเกินไป
          marginY: 2, // เพิ่มระยะห่างบน-ล่าง
        }}
      >
        UPLOAD YOUR OWN VOICE MODEL (PTH)
      </Button>
    </>
  );
};

export default UploadModelButton;
