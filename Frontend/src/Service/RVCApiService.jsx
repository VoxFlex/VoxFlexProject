import axios from "axios";

const BASE_URL = "http://localhost:8000/rvc"; // Change to your API base URL

const RVCApiService = {
  async healthCheck() {
    try {
      const response = await axios.get(`${BASE_URL}/`);
      console.log("📌 Health Check:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Health Check Error:", error);
      return null;
    }
  },

  async listModels() {
    try {
      const response = await axios.get(`${BASE_URL}/models`);
      console.log("📌 Available Models:", response.data.available_models);
      return response.data.available_models;
    } catch (error) {
      console.error("❌ Error getting models:", error);
      return [];
    }
  },

  async selectModel(modelName) {
    try {
      const response = await axios.post(`${BASE_URL}/models/select`, null, {
        params: { model_name: modelName },
      });
      console.log(`📌 Selecting Model '${modelName}':`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error selecting model '${modelName}':`, error);
      return null;
    }
  },

  async convertVoice(file) {
    if (!file) {
      console.error("❌ No file provided for conversion");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${BASE_URL}/voice/convert`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("✅ Voice Converted!", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error converting voice:", error);
      return null;
    }
  },

  async unloadModel() {
    try {
      const response = await axios.post(`${BASE_URL}/models/unload`);
      console.log("📌 Unload Model:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error unloading model:", error);
      return null;
    }
  },

  async uploadModel(file) {
    if (!file) {
      console.error("❌ No file provided for model upload");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${BASE_URL}/models/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("✅ Model Uploaded Successfully!", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error uploading model:", error);
      return null;
    }
  },

  async convertSong(file) {
    if (!file) {
      console.error("❌ No song file provided for conversion");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${BASE_URL}/song/convert`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("✅ Song Converted!", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error converting song:", error);
      return null;
    }
  },

  async convertVideo(file) {
    if (!file) {
      console.error("❌ No file provided for video conversion");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${BASE_URL}/video/convert`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("✅ Video Converted!", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error converting video:", error);
      return null;
    }
  },
};

export default RVCApiService;
