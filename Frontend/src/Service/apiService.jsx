import axios from "axios";

/**
 * Upload video to the server and process it.
 *
 * @param {File} videoFile - The video file to upload.
 * @param {string} targetLanguage - The target language for translation.
 * @returns {Promise<Blob>} - A promise that resolves with the processed video blob.
 */
export const uploadVideoToServer = async (videoFile, targetLanguage = "th") => {
  const formData = new FormData();
  formData.append("video_file", videoFile); // Attach the video file
  formData.append("target_language", targetLanguage); // Attach the target language

  try {
    // Post form data to the server
    const response = await axios.post(
      "http://localhost:8000/video/process/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob", // Expecting a binary response for the processed video
      }
    );

    // Create a blob URL for the processed video
    const blob = new Blob([response.data], { type: "video/mp4" });
    const videoUrl = URL.createObjectURL(blob);
    console.log(videoUrl);
    // Return the blob URL for use in the frontend
    return videoUrl;
  } catch (error) {
    // Log the error and rethrow it
    console.error(
      "Error uploading video:",
      error.message || error.response?.data
    );
    throw new Error(
      error.response?.data?.message ||
        "Failed to upload and process the video. Please try again later."
    );
  }
};
