import os
import uuid
from app.utils.combine_video_and_audio import combine_video_and_audio
from app.utils.video_processing import convert_video_to_audio, compress_video
from app.utils.transcription_translation import transcribe_and_translate
from app.utils.tts_generation_with_sync import generate_speech_with_sync
from app.utils.sync_audio_to_video import remove_audio_from_video, run_inference
from app.utils.file_utils import save_uploaded_file, cleanup_files

class VideoService:
    @staticmethod
    async def process_video(video_file, target_language, voice_model: str):
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
            "no_audio_video": os.path.join(temp_dir, f"no_audio_{file_id}.mp4"),
            "audio": os.path.join(temp_dir, f"temp_audio_{file_id}.wav"),
            "translated_audio": os.path.join(temp_dir, f"translated_audio_{file_id}.wav"),
            "output_video": os.path.join(output_dir, f"output_video_{file_id}.mp4"),
            "compressed_video": os.path.join(output_dir, f"compressed_{file_id}.mp4"),
        }

        try:
            save_uploaded_file(video_file, paths["video"])
            print(f"Uploaded video saved at: {paths['video']}")
            
             # Step 1: Remove audio from the original video
            remove_audio_from_video(paths["video"], paths["no_audio_video"])
            print(f"Video without audio saved at: {paths['no_audio_video']}")

             # Step 2: Convert video to audio for transcription and translation
            convert_video_to_audio(paths["video"], paths["audio"])
            print(f"Audio extracted to: {paths['audio']}")
            
            # Step 3: Transcribe and translate audio
            segments = transcribe_and_translate(paths["audio"], target_language=target_language)
            print("Transcription and translation complete.")

            # Step 4: Generate speech audio from translated text
            generate_speech_with_sync(segments, paths["translated_audio"], target_language, voice_model)
            print(f"Translated audio saved at: {paths['translated_audio']}")
            print("service voice model: ", voice_model)

            # run_inference(
            #     video_path=paths["video"],
            #     audio_path=paths["translated_audio"],
            #     output_path=paths["output_video"],
            #     checkpoint_path=os.path.join(base_dir, "../../Easy-Wav2Lip/checkpoints/Wav2Lip.pth"),
            # )
            
            # Step 5: Combine translated audio with video without audio
            combine_video_and_audio(
                video_no_audio_path=paths["no_audio_video"],
                translated_audio_path=paths["translated_audio"],
                output_video_path=paths["output_video"]
            )

            # print(f"Inference completed. Output video at: {paths['output_video']}")
            
            # Step 6: Compress the final output video
            compress_video(paths["output_video"], paths["compressed_video"])

            # Verify the compressed file exists
            if not os.path.exists(paths["compressed_video"]):
                raise FileNotFoundError(f"Compressed video file not created: {paths['compressed_video']}")

            print(f"Compressed video verified at: {paths['compressed_video']}")
            return paths["compressed_video"]
        
        except Exception as e:
            print(f"An error occurred during processing: {e}")
            raise
        
        finally:
            cleanup_files(list(paths.values()), exclude=paths["compressed_video"])
