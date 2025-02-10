import subprocess
import os

def combine_video_and_audio(video_no_audio_path: str, translated_audio_path: str, output_video_path: str):
    """
    Combine a video with no audio and the translated audio using ffmpeg.

    :param video_no_audio_path: Path to the video file without audio.
    :param translated_audio_path: Path to the translated audio file.
    :param output_video_path: Path where the output video will be saved.
    """
    if not os.path.exists(video_no_audio_path):
        raise FileNotFoundError(f"Video file not found: {video_no_audio_path}")

    if not os.path.exists(translated_audio_path):
        raise FileNotFoundError(f"Audio file not found: {translated_audio_path}")

    command = [
        "ffmpeg",
        "-y",  # Overwrite output file if it exists
        "-i", video_no_audio_path,  # Input video file without audio
        "-i", translated_audio_path,  # Input translated audio
        "-c:v", "copy",  # Copy the video codec without re-encoding
        "-c:a", "aac",  # Use AAC for audio encoding
        "-shortest",  # Match the shorter duration between video and audio
        output_video_path
    ]

    try:
        subprocess.run(command, check=True)
        print(f"Video and audio combined successfully. Output video: {output_video_path}")
    except subprocess.CalledProcessError as e:
        print(f"Error occurred while combining video and audio: {e}")
        raise

