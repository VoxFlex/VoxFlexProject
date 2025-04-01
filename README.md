# VoxFlex

VoxFlex is an advanced platform designed to make multimedia content accessible across languages using AI-driven voice, audio, and video processing. It combines **machine translation**, **voice conversion**, **speech generation**, and **video enhancement** into a seamless system.
* * * * *

🚀 Overview
-----------

-   Translate and synthesize voices in videos or audio into any language

-   Convert vocals using **RVC voice models**

-   Generate high-quality text-to-speech using **OpenAI TTS**

-   Handle full video processing including voice overlay and lip sync

* * * * *

🧠 Architecture
---------------

### Main Components:

-   **Frontend**: Built with **React.js**, for a responsive and intuitive UI

-   **Main Server**: Built with **FastAPI**, acts as the orchestrator between client, RVC Server, and external APIs

-   **RVC Server**: A separate FastAPI-based service dedicated to running **RVC inference**, audio separation, and merging

-   **External APIs**: Integrated with **Google Translate**, **OpenAI ChatGPT**, and **OpenAI TTS**

* * * * *



## Screenshots
### Homepage
![homepage](https://github.com/user-attachments/assets/4911451a-7515-4e5f-8710-0dbf21bb9de0)



> [!NOTE] 
> Our website is fully responsive and adapts seamlessly to any device, including desktops, tablets or mobiles.
### AI Studio  
![image](https://github.com/user-attachments/assets/487d0d60-e5c9-49f1-83ca-4f911d729ff8)
 

🧹 Features
-----------

### ✅ Voice Conversion

-   Converts speaker's voice to sound like another speaker using **RVC inference**

-   Used in voice dubbing or character voice transformation

-   Fully handled by **RVC Server**

### ✅ Song Conversion

-   Splits vocals and background music using **Spleeter**

-   Converts vocals via **RVC** and re-merges them with the background

-   Does not require any external APIs

### ✅ Audio Translation

-   Extracts and transcribes speech using **WhisperX**

-   Translates using **Google Translate** with fallback and refinement using **ChatGPT (GPT-4o)**

-   Regenerates speech with **OpenAI TTS**

-   Merges the translated voice as a standalone audio response

### ✅ Video Conversion

-   Extracts audio from video using **ffmpeg**

-   Converts audio using **RVC voice model**

-   Recombines the new audio back into the original video

-   Entirely processed using the **RVC Server** without external API calls

### ✅ Video Translation

-   Extracts audio ➔ transcribes ➔ translates ➔ regenerates audio using **OpenAI TTS**

-   Uses **Google Translate + GPT-4o** for text translation

-   Merges translated voice back with video to create fully localized content

### ✅ Text-to-Speech

-   Input any text, define language and speaker model

-   Uses **OpenAI TTS** to generate high-quality, natural speech

### ✅ Model Management

-   Upload `.zip` files containing `.pth` models for use in RVC

-   Dynamically switch active model for RVC-based tasks

* * * * *

🧪 Technology Stack
-------------------

### 🖥️ Frontend

-   **React.js** with Vite

-   **Axios** for API calls

-   **MUI** for UI styling

### 🧠 Backend

-   **FastAPI** (for both Main Server and RVC Server)

-   **Python** for all core logic

-   **pydub**, **ffmpeg**, **openai**, **whisperx**, **deep_translator**, **torch**

### 📦 AI Models

-   **RVC (Retrieval-based Voice Conversion)**

-   **OpenAI WhisperX** for transcription

-   **OpenAI TTS** (e.g., Alloy, Nova, Onyx)

-   **ChatGPT (GPT-4o)** for translation refinement

-   **Google Translate API**

### 🧱 System Structure

-   `frontend/` - React-based UI

-   `main-server/` - Orchestrates translation, TTS, and video/audio pipelines

-   `rvc-server/` - Dedicated service for voice model inference

### Version Control
- **Version Control:** Git (hosted on GitHub) code collaboration

* * * * *


## Installation

### Prerequisites
- Python 3.8 or above
- Node.js (for frontend development)
- Git (for version control)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/voxflex.git
   ```
2. Navigate to the project directory:
   ```bash
   cd voxflex
   ```
3. Install backend dependencies:
   - please make sure you have `ffmpeg`
   ```bash
   cd server
   ```
   ```bash
   python -m venv .env 
   ```
   ```bash
   .env\Scripts\activate 
   ```
   - note: exit .env use `deactivate`
   
   ```bash
   pip install -r requirements.txt
   ```
4. Navigate to the frontend directory and install dependencies:
   ```bash
   cd frontend
   npm install
   ```
5. Run the backend server:
   ```bash
   python main.py
   ```
6. Run the frontend server:
   ```bash
   npm run dev
   ```

## Usage
1. Open the frontend URL provided in the terminal after running the development server.
2. Upload your video file for processing.
3. Choose the original language and desired language for translation.
You can also choose detect language as a original language.
4. Receive the translated, voice-synthesized, and lip-synced content.

## 📡 Server API Documentation
The backend API, powered by **FastAPI**, provides a range of endpoints to support multimedia translation, voice synthesis, and text-to-speech functionalities. Below are the available endpoints and their usage.

---

# 📄 VoxFlex API Documentation

## 📋 Table of Contents
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

## ⚙️ **Error Handling**
All endpoints return clear error responses if issues arise.

| Status Code | Description |
|:-------------|:-------------|
| `200 OK`      | Request successful |
| `400 Bad Request` | Invalid request data |
| `404 Not Found`   | Requested resource not found |
| `500 Internal Server Error` | Server encountered an unexpected condition |



## Workflow
1. **Input Processing:** Users upload multimedia content.
2. **Speech-to-Text Conversion:** Audio is transcribed into text using Whisper.
3. **Text Translation:** Transcripts are translated into the target language using Deep Translator.
4. **Voice Synthesis:** Translated text is converted into natural-sounding audio with RVC WebUI.
5. **Lip Synchronization:** Audio is synchronized with video using Wav2Lip.
6. **Output Delivery:** Users receive processed multimedia content ready for download.

## Challenges
- Integrating multiple AI tools into a seamless workflow.
- Ensuring the accuracy of translations and voice synthesis.
- Maintaining lip-sync precision for a realistic user experience.
- Optimizing the system for various hardware capabilities.

## Contributions
We welcome contributions from the community! To contribute:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push the branch.
4. Submit a pull request, detailing the changes made.

## Contact
For any inquiries, feel free to reach out:
- **Email:** damita.f@ku.th and setthanan.th@ku.th
- **GitHub:** [Danita's Profile](hhttps://github.com/dzptahh) and [Setthanan's Profile](hhttps://github.com/reviseUC73)


## About US
- Danita Frikaow
- Setthanan Thongpunchang 
- Academic Year 2024: Classification of Auto Voice Translation in Bachelor Degree in Computer Engineering. Department of Computer Engineering Faculty of Engineering, Kasetsart University. 
- Advisor: Associate Professor Thanawin RAKTHANMANON. 
