# 📄 VoxFlex Main Server - README

The **VoxFlex Main Server** is the core backend service that coordinates between clients, the RVC Server, and external APIs. It handles voice conversion, audio and video translation, text-to-speech (TTS), and model management efficiently using FastAPI.

---

## 📋 **Table of Contents**
1. [Overview](#overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Installation](#installation)
5. [Environment Variables](#environment-variables)
6. [API Documentation](#api-documentation)
7. [Workflow](#workflow)
8. [Contributions](#contributions)
9. [Contact](#contact)

---

## 🚀 **Overview**
The **Main Server** is responsible for:
- Orchestrating multimedia processing workflows.
- Forwarding requests to the **RVC Server** and **External APIs**.
- Managing models for voice conversion.

It supports audio, video, and text-based input for translation, synthesis, and conversion tasks.

---

## 🌟 **Features**
- **Voice Conversion:** Transforms audio into different voice models.
- **Song Conversion:** Enhances songs by separating vocals and combining with modified voice tracks.
- **Audio Translation:** Translates audio and regenerates speech in the target language.
- **Video Conversion:** Processes video by extracting audio, converting it, and merging it back.
- **Video Translation:** Translates and synchronizes speech tracks with video content.
- **Text-to-Speech (TTS):** Generates natural-sounding speech from text.
- **Model Management:** Allows uploading and selecting voice models for RVC tasks.
- **Health Check:** Ensures all services are running properly.

---

## 🛠️ **Architecture**
```
Client  ---> Main Server ---> RVC Server (for conversion)
         |                ---> Google Translate (for translation)
         |                ---> ChatGPT (for refined translation)
         |                ---> OpenAI TTS (for text-to-speech)
```

---

## 📥 **Installation**
### **Prerequisites**
- Python 3.8 or above
- FastAPI framework
- FFmpeg (for media processing)

### **Steps to Install**
1. Clone the repository:
```bash
git clone https://github.com/your-repo/voxflex-main-server.git
```

2. Navigate to the project directory:
```bash
cd voxflex-main-server
```

3. Create a virtual environment and activate it:
```bash
python -m venv .env
source .env/bin/activate  # For Linux/Mac
.env\Scripts\activate     # For Windows
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Set up environment variables (see `.env.example` for reference).

6. Run the server:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## ⚙️ **Environment Variables**
Create a `.env.local` file in the project root with the following variables:
```
RVC_SERVER_URL=http://localhost:8001
OPENAI_API_KEY=your_openai_api_key
```

---

## 📖 **API Documentation**

### 📋 Table of Contents
1. [Voice Conversion](#voice-conversion)
2. [Song Conversion](#song-conversion)
3. [Audio Translation](#audio-translation)
4. [Video Conversion](#video-conversion)
5. [Video Translation](#video-translation)
6. [Text-to-Speech (TTS)](#text-to-speech-tts)
7. [Model Management](#model-management)
8. [Health Check](#health-check)

---

## 🔊 Voice Conversion
### **Endpoint**
```
POST /voice/convert
```

### **Request Parameters**
| Parameter | Type        | Description              | Required |
|------------|-------------|--------------------------|-----------|
| `file`       | `file`      | Audio file (`.wav`, `.mp3`) | ✅ Yes |

### **Sample Request**
```bash
curl -X POST -F "file=@audio_sample.wav" http://localhost:8000/voice/convert
```

### **Sample Response**
```json
{
  "output_file": "processed_audio.wav",
  "message": "✅ Voice converted successfully."
}
```

---

## 🎵 Song Conversion
### **Endpoint**
```
POST /song/convert
```

### **Request Parameters**
| Parameter | Type        | Description              | Required |
|------------|-------------|--------------------------|-----------|
| `file`       | `file`      | Audio file (`.wav`, `.mp3`) | ✅ Yes |

### **Sample Request**
```bash
curl -X POST -F "file=@song_sample.mp3" http://localhost:8000/song/convert
```

### **Sample Response**
```json
{
  "output_file": "converted_song.mp3",
  "message": "✅ Song converted successfully."
}
```

---

## 🎧 Audio Translation
### **Endpoint**
```
POST /audio/translate
```

### **Request Parameters**
| Parameter        | Type        | Description               | Required |
|------------------|-------------|---------------------------|-----------|
| `file`            | `file`      | Audio file (`.wav`, `.mp3`) | ✅ Yes |
| `target_language` | `string`    | Target language             | ✅ Yes |
| `voice_model`     | `string`    | Voice model for TTS         | ✅ Yes |

### **Sample Request**
```bash
curl -X POST -F "file=@audio_sample.wav" \
-F "target_language=en" \
-F "voice_model=alloy" \
http://localhost:8000/audio/translate
```

### **Sample Response**
```json
{
  "translated_audio": "translated_audio.wav",
  "message": "✅ Audio translated successfully."
}
```

---

## 🎬 Video Conversion
### **Endpoint**
```
POST /video/convert
```

### **Request Parameters**
| Parameter         | Type        | Description                 | Required |
|-------------------|-------------|-----------------------------|-----------|
| `file`             | `file`      | Video file (`.mp4`, `.mov`) | ✅ Yes |
| `is_music_video`   | `boolean`   | Mark if video is a music video | ❌ Optional |

### **Sample Request**
```bash
curl -X POST -F "file=@video_sample.mp4" \
-F "is_music_video=true" \
http://localhost:8000/video/convert
```

### **Sample Response**
```json
{
  "output_file": "converted_video.mp4",
  "message": "✅ Video converted successfully."
}
```

---

## 🎥 Video Translation
### **Endpoint**
```
POST /video/translate
```

### **Request Parameters**
| Parameter         | Type        | Description                 | Required |
|-------------------|-------------|-----------------------------|-----------|
| `file`             | `file`      | Video file (`.mp4`, `.mov`) | ✅ Yes |
| `target_language`  | `string`    | Target language              | ✅ Yes |
| `voice_model`      | `string`    | Voice model for TTS          | ✅ Yes |

### **Sample Request**
```bash
curl -X POST -F "file=@video_sample.mp4" \
-F "target_language=en" \
-F "voice_model=alloy" \
http://localhost:8000/video/translate
```

### **Sample Response**
```json
{
  "translated_video": "translated_video.mp4",
  "message": "✅ Video translated successfully."
}
```

---

## 🗣️ Text-to-Speech (TTS)
### **Endpoint**
```
POST /tts
```

### **Request Parameters**
| Parameter         | Type        | Description                 | Required |
|-------------------|-------------|-----------------------------|-----------|
| `text`             | `string`    | Text to convert to speech    | ✅ Yes |
| `target_language`  | `string`    | Target language for speech   | ✅ Yes |
| `voice_model`      | `string`    | Desired voice model          | ✅ Yes |

### **Sample Request**
```bash
curl -X POST -F "text=Hello, this is VoxFlex!" \
-F "target_language=en" \
-F "voice_model=alloy" \
http://localhost:8000/tts
```

### **Sample Response**
```json
{
  "audio_file": "generated_speech.wav",
  "message": "✅ TTS audio generated successfully."
}
```

---

## 🛠️ Model Management
### **Upload Model**
```
POST /models/upload
```

### **List Models**
```
GET /models
```

### **Select Model**
```
POST /models/select
```

---

## 🔎 Health Check
### **Endpoint**
```
GET /health_check
```

### **Sample Request**
```bash
curl -X GET http://localhost:8000/health_check
```

### **Sample Response**
```json
{
  "status": "✅ System operational."
}
```



---

## 🔄 **Workflow**
1. **Client Request:** The client sends a request for conversion or translation.
2. **Main Server Processing:** The Main Server handles data preprocessing, sends requests to RVC Server or external APIs as required.
3. **External API Calls:** Utilizes Google Translate, GPT, and OpenAI TTS for text generation and refinement.
4. **RVC Server Integration:** Routes voice, song, and video conversion tasks to the RVC Server.
5. **Final Delivery:** The Main Server returns the processed result to the client.

---

## 🤝 **Contributions**
We welcome community contributions! Follow these steps to contribute:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push the branch.
4. Submit a pull request with details of your changes.

---

## 📞 **Contact**
For inquiries or support, please contact:
- **Email:** damita.f@ku.th and setthanan.th@ku.th
- **GitHub:** [Danita's Profile](https://github.com/dzptahh) and [Setthanan's Profile](https://github.com/reviseUC73)

---

**VoxFlex Main Server - Efficient Multimedia Processing Made Easy**

