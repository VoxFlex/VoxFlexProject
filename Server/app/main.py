from .utils.video_processing import convert_video_to_audio
from .utils.transcription_translation import transcribe_and_translate
from .utils.tts_generation import generate_speech_from_text_gtts
from .utils.sync_audio_to_video import run_inference
from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import FileResponse
from fastapi.responses import StreamingResponse
import os
import uuid
import subprocess

app = FastAPI()

def compress_video(input_path, output_path):
    """Compress the video using ffmpeg to reduce size."""
    command = [
        "ffmpeg", "-i", input_path,
        "-vcodec", "h264", "-acodec", "aac",
        "-preset", "fast", "-crf", "28",  # Adjust CRF for quality/size balance
        output_path
    ]
    subprocess.run(command, check=True)
    
def iterfile(file_path):
    """Stream the video file in chunks."""
    with open(file_path, "rb") as file:
        yield from file

@app.post("/process-video/")
async def process_video(
    video_file: UploadFile,  # Upload video file
    target_language: str = Form("th")  # Target language for translation (default: Thai)
):
    # Generate unique filenames to avoid conflicts
    file_id = str(uuid.uuid4())
    video_path = f"input/{file_id}.mp4"
    audio_path = f"temp/temp_audio_{file_id}.wav"
    translated_audio_path = f"temp/translated_audio_{file_id}.wav"
    output_video_path = f"output/output_video_{file_id}.mp4"
    compressed_video_path = f"output/compressed_{file_id}.mp4"
    checkpoint_path = os.path.join("Easy-Wav2Lip", "checkpoints", "wav2lip.pth")

    # Save uploaded video file
    with open(video_path, "wb") as f:
        f.write(await video_file.read())

    try:
        # Step 1: Convert video to audio
        convert_video_to_audio(video_path, audio_path)

        # Step 2: Transcribe and translate audio
        translated_text = transcribe_and_translate(audio_path, source_language="en", target_language=target_language)

        # Step 3: Generate speech from translated text
        generate_speech_from_text_gtts(translated_text, translated_audio_path)

        # Step 4: Run Wav2Lip inference
        run_inference(video_path, translated_audio_path, output_video_path, checkpoint_path)
        
        # Step 5: Compress the video
        compress_video(output_video_path, compressed_video_path)

        # Return the final processed video
        return StreamingResponse(
            iterfile(compressed_video_path),
            media_type="video/mp4",
            headers={"Content-Disposition": f"attachment; filename=processed_{video_file.filename}"}
        )

    except Exception as e:
        return {"error": str(e)}

    finally:
        # Cleanup temporary files
        for file_path in [video_path, audio_path, translated_audio_path, output_video_path]:
            if os.path.exists(file_path):
                os.remove(file_path)
                
@app.get("/download/{file_name}")
async def download_file(file_name: str):
    """Endpoint to download the processed video."""
    file_path = os.path.join("output", file_name)
    if os.path.exists(file_path):
        return FileResponse(path=file_path, media_type="video/mp4", filename=file_name)
    return {"error": "File not found"}

      
@app.get("/")
async def root():
    return {"message": "Welcome to the Video Processing API"}
