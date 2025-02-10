import os
import subprocess

def run_inference(video_path, audio_path, output_path, checkpoint_path):
    """Run the inference process with Easy-Wav2Lip."""
    script_path = os.path.join(os.path.dirname(__file__), "../../Easy-Wav2Lip/inference.py")
    print("checkpoint_path", checkpoint_path)
    command = [
        "python", script_path,
        "--checkpoint_path", checkpoint_path,
        "--face", video_path,
        "--audio", audio_path,
        "--outfile", output_path
    ]

    subprocess.run(command, check=True)


def remove_audio_from_video(video_path, output_path):
    """Remove audio from video using ffmpeg."""
    command = [
        "ffmpeg",
        "-y",  # Overwrite output file if exists
        "-i", video_path,  # Input video file
        "-an",  # Remove audio
        "-c:v", "copy",  # Copy video codec (no re-encoding)
        output_path
    ]
    try:
        subprocess.run(command, check=True)
        print(f"Audio removed. Output video at: {output_path}")
    except subprocess.CalledProcessError as e:
        print(f"Error occurred while removing audio from video: {e}")
        raise

# def run_inference(video_path, audio_path, output_path):
#     """Mix audio and video using ffmpeg."""
#     command = [
#         "ffmpeg",
#         "-y",  # Overwrite output file if exists
#         "-i", video_path,  # Input video file
#         "-i", audio_path,  # Input audio file
#         "-c:v", "copy",  # Copy video codec (no re-encoding)
#         "-c:a", "aac",  # Use AAC for audio encoding
#         "-shortest",  # Match the shorter duration (audio or video)
#         output_path
#     ]
#     try:
#         subprocess.run(command, check=True)
#         print(f"Audio and video mixed successfully. Output file at: {output_path}")
#     except subprocess.CalledProcessError as e:
#         print(f"Error occurred while mixing audio and video: {e}")
#         raise