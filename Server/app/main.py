from utils.video_processing import convert_video_to_audio
from utils.transcription_translation import transcribe_and_translate
from utils.tts_generation import generate_speech_from_text_gtts
from utils.sync_audio_to_video import run_inference
import os

def main():
    # Define paths
    video_path = "input/my_video.mp4"
    audio_path = "temp/temp_audio.wav"
    translated_audio_path = "temp/translated_audio.wav"
    output_video_path = "output/output_video.mp4"
    checkpoint_path = os.path.join("Easy-Wav2Lip", "checkpoints", "wav2lip.pth")

    # Step 1: Convert video to audio
    convert_video_to_audio(video_path, audio_path)

    # Step 2: Transcribe and translate audio
    translated_text = transcribe_and_translate(audio_path, source_language="en", target_language="th")

    # Step 3: Generate speech from translated text
    generate_speech_from_text_gtts(translated_text, translated_audio_path)

    # Step 4: Run Wav2Lip inference
    run_inference(video_path, translated_audio_path, output_video_path, checkpoint_path)

    print(f"Final video saved at: {output_video_path}")

if __name__ == "__main__":
    main()
