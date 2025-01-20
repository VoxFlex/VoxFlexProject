import os
import uuid
from app.utils.video_processing import convert_video_to_audio, compress_video
from app.utils.transcription_translation import transcribe_and_translate
from app.utils.tts_generation_with_sync import generate_speech_with_sync
from app.utils.sync_audio_to_video import run_inference
from app.utils.file_utils import save_uploaded_file, cleanup_files

class VideoService:
    @staticmethod
    async def process_video(video_file, target_language):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        input_dir = os.path.abspath(os.path.join(base_dir, "../../input"))
        temp_dir = os.path.abspath(os.path.join(base_dir, "../../temp"))
        output_dir = os.path.abspath(os.path.join(base_dir, "../../output"))

        os.makedirs(input_dir, exist_ok=True)
        os.makedirs(temp_dir, exist_ok=True)
        os.makedirs(output_dir, exist_ok=True)

        file_id = str(uuid.uuid4())
        paths = {
            "video": os.path.join(input_dir, f"{file_id}.mp4"),
            "audio": os.path.join(temp_dir, f"temp_audio_{file_id}.wav"),
            "translated_audio": os.path.join(temp_dir, f"translated_audio_{file_id}.wav"),
            "output_video": os.path.join(output_dir, f"output_video_{file_id}.mp4"),
            "compressed_video": os.path.join(output_dir, f"compressed_{file_id}.mp4"),
        }

        try:
            save_uploaded_file(video_file, paths["video"])
            print(f"Uploaded video saved at: {paths['video']}")

            convert_video_to_audio(paths["video"], paths["audio"])
            print(f"Audio extracted to: {paths['audio']}")

            segments = transcribe_and_translate(paths["audio"], target_language=target_language)
            print("Transcription and translation complete.")

            generate_speech_with_sync(segments, paths["translated_audio"], target_language)
            print(f"Translated audio saved at: {paths['translated_audio']}")

            run_inference(
                video_path=paths["video"],
                audio_path=paths["translated_audio"],
                output_path=paths["output_video"],
                checkpoint_path=os.path.join(base_dir, "../../Easy-Wav2Lip/checkpoints/Wav2Lip.pth"),
            )
            print(f"Inference completed. Output video at: {paths['output_video']}")

            compress_video(paths["output_video"], paths["compressed_video"])

            # Verify the compressed file exists
            if not os.path.exists(paths["compressed_video"]):
                raise FileNotFoundError(f"Compressed video file not created: {paths['compressed_video']}")

            print(f"Compressed video verified at: {paths['compressed_video']}")
            return paths["compressed_video"]

        finally:
            cleanup_files(list(paths.values()), exclude=paths["compressed_video"])
