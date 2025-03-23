import axios from "axios";

const BASE_URL = "http://localhost:8000"; // Update this to your actual API base URL

/**
 * Upload video to the server and process it.
 *
 * @param {File} videoFile - The video file to upload.
 * @param {string} targetLanguage - The target language for translation.
 * @param {string} voiceModel - The voice model for the translated voice.
 * @returns {Promise<Blob>} - A promise that resolves with the processed video blob.
 */
export const uploadVideoToServer = async (videoFile, targetLanguage, voiceModel) => {
  const formData = new FormData();
  formData.append("video_file", videoFile);
  formData.append("target_language", targetLanguage);
  formData.append("voice_model", voiceModel);

  try {
    const response = await axios.post(`${BASE_URL}/video/process/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: "video/mp4" });
    const videoUrl = URL.createObjectURL(blob);
    console.log("✅ Processed Video URL:", videoUrl);
    return videoUrl;
  } catch (error) {
    console.error("❌ Error uploading video:", error.message || error.response?.data);
    throw new Error(
      error.response?.data?.message || "Failed to upload and process the video. Please try again later."
    );
  }
};

/**
 * Text-to-Speech (TTS) API
 *
 * @param {string} text - The text to convert to speech.
 * @param {string} targetLanguage - The target language for speech.
 * @param {string} voiceModel - The desired voice model (e.g., alloy, ash, coral, etc.).
 * @returns {Promise<Object>} - The generated speech data.
 */
export const textToSpeech = async (text, targetLanguage = "en", voiceModel = "alloy") => {
  const formData = new FormData();
  formData.append("text", text);
  formData.append("target_language", targetLanguage);
  formData.append("voice_model", voiceModel);

  try {
    const response = await axios.post(`${BASE_URL}/tools/tts`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("✅ Text-to-Speech Result:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error in Text-to-Speech:", error.message || error.response?.data);
    throw new Error(
      error.response?.data?.message || "Failed to generate speech. Please try again later."
    );
  }
};

/**
 * Voice Translation API
 *
 * @param {File} audioFile - The audio file to translate.
 * @param {string} targetLanguage - The target language for translation.
 * @param {string} voiceModel - The desired voice model (e.g., alloy, ash, coral, etc.).
 * @returns {Promise<Object>} - The translated audio data.
 */
export const voiceTranslation = async (audioFile, targetLanguage = "en", voiceModel = "alloy") => {
  const formData = new FormData();
  formData.append("audio_file", audioFile);
  formData.append("target_language", targetLanguage);
  formData.append("voice_model", voiceModel);

  try {
    const response = await axios.post(`${BASE_URL}/tools/voice/translate`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("✅ Voice Translation Result:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error in Voice Translation:", error.message || error.response?.data);
    throw new Error(
      error.response?.data?.message || "Failed to translate voice. Please try again later."
    );
  }
};
