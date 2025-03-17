# VoxFlex

VoxFlex is a cutting-edge platform designed to make multimedia content accessible across multiple languages through advanced AI-powered tools. The platform focuses on delivering synchronized, translated, and lip-synced audio and video, offering an immersive and inclusive multimedia experience.
## Screenshots
### Homepage
![homepage](https://github.com/user-attachments/assets/4911451a-7515-4e5f-8710-0dbf21bb9de0)



> [!NOTE] 
> Our website is fully responsive and adapts seamlessly to any device, including desktops, tablets or mobiles.
### AI Studio  
![image](https://github.com/user-attachments/assets/487d0d60-e5c9-49f1-83ca-4f911d729ff8)
 

## Features
- **Speech-to-Text:** Converts audio to text accurately using Whisper by OpenAI.
- **Text Translation:** Provides seamless multilingual translation using Deep Translator (Google Translate).
- **Voice Synthesis:** Generates high-quality, natural-sounding voiceovers with RVC WebUI.
- **Lip Synchronization:** Synchronizes voiceovers with video content using Wav2Lip for realistic visual experiences.
- **User-Friendly Interface:** Interactive and responsive UI built with React.js for ease of use.

## Technology Stack
- **Programming Language:** Python
- **Web Framework:** FastAPI for building and managing backend APIs
- **Frontend:** HTML, CSS, JavaScript, React.js

### AI implementation
- **Speech-to-Text:** Whisper by OpenAI
- **Text Translation:** Deep Translator (Google Translate)
- **Voice Synthesis:** RVC WebUI
- **Lip Synchronization:** Wav2Lip
### Version Control
- **Version Control:** Git (hosted on GitHub) code collaboration

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

### 🚀 API Endpoints

### **Voice Conversion APIs**

### 1. **Convert Voice**
**`POST /voice/convert`**  
> **Description:** Converts the uploaded voice file using the selected model.

**Request Parameters:**
- `file` (file) — The uploaded audio file in `.wav` or `.mp3` format.

**Sample Request:**
```bash
curl -X POST "http://localhost:8000/voice/convert" \
  -F "file=@your_audio.wav"
```

---

### 2. **Voice Translation**
**`POST /voice/translate`**  
> **Description:** Translates uploaded audio into the desired language and generates a new voiceover.

**Request Parameters:**
- `audio_file` (file) — The uploaded audio file in `.wav` or `.mp3`.
- `target_language` (string) — The language to translate the audio into. (Default: `en`)
- `voice_model` (string) — The voice model for the translation. Supported models: `alloy`, `ash`, `coral`, `echo`, `fable`, `onyx`, `nova`, `sage`, `shimmer`.

**Sample Request:**
```bash
curl -X POST "http://localhost:8000/voice/translate" \
  -F "audio_file=@your_audio.wav" \
  -F "target_language=th" \
  -F "voice_model=alloy"
```

---

### **Song Conversion API**
---

### 3. **Convert Song**
**`POST /song/convert`**  
> **Description:** Converts the uploaded song file using the selected voice model.

**Request Parameters:**
- `file` (file) — The uploaded song file in `.wav` or `.mp3` format.

**Sample Request:**
```bash
curl -X POST "http://localhost:8000/song/convert" \
  -F "file=@your_song.mp3"
```

---

### **Video Conversion APIs**
---

### 4. **Convert Video**
**`POST /video/convert`**  
> **Description:** Converts the uploaded video and regenerates voice if needed.

**Request Parameters:**
- `file` (file) — The uploaded video file in `.mp4` or `.mov`.
- `is_music_video` (string) — Determines if the video is a music video for special handling. (`true` or `false`)

**Sample Request:**
```bash
curl -X POST "http://localhost:8000/video/convert" \
  -F "file=@your_video.mp4" \
  -F "is_music_video=true"
```

---

### 5. **Process Video**
**`POST /process/`**  
> **Description:** Processes a video file by translating and regenerating voice with the specified model.

**Request Parameters:**
- `video_file` (file) — The uploaded video file in `.mp4`.
- `target_language` (string) — The language to translate the audio into. (Default: `th`)
- `voice_model` (string) — The voice model for synthesized audio. Supported voices include: `alloy`, `ash`, `coral`, `echo`, `fable`, `onyx`, `nova`, `sage`, `shimmer`.

**Sample Request:**
```bash
curl -X POST "http://localhost:8000/process/" \
  -F "video_file=@your_video.mp4" \
  -F "target_language=en" \
  -F "voice_model=alloy"
```

---

### **Text-to-Speech (TTS) API**
---

### 6. **Text-to-Speech**
**`POST /tts`**  
> **Description:** Generates speech audio from a provided text.

**Request Parameters:**
- `text` (string) — The text to be converted into speech.
- `target_language` (string) — The language for the generated speech. (Default: `en`)
- `voice_model` (string) — The voice model for generating the speech. Supported voices include: `alloy`, `ash`, `coral`, `echo`, `fable`, `onyx`, `nova`, `sage`, `shimmer`.

**Sample Request:**
```bash
curl -X POST "http://localhost:8000/tts" \
  -F "text=Hello world! This is a test sentence." \
  -F "target_language=en" \
  -F "voice_model=alloy"
```

---

### **Health Check API**
---

### 7. **Health Check**
**`GET /health_check`**  
> **Description:** Verifies the server’s operational status.

**Sample Request:**
```bash
curl -X GET "http://localhost:8000/health_check"
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
