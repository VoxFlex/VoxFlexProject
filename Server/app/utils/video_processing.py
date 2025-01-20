import os
import subprocess

def convert_video_to_audio(video_path, audio_path):
    """Convert video to audio using ffmpeg."""
    if not os.path.exists(video_path):
        raise FileNotFoundError(f"Video file not found: {video_path}")

    video_path = os.path.abspath(video_path)
    audio_path = os.path.abspath(audio_path)

    command = ["ffmpeg", "-i", video_path, "-ab", "160k", "-ac", "2", "-ar", "44100", "-vn", audio_path]
    subprocess.run(command, check=True)
    print(f"Audio extracted: {audio_path}")

def compress_video(input_path, output_path):
    temp_output = f"{output_path}.mp4"
    command = [
        "ffmpeg", "-i", input_path,
        "-vcodec", "h264", "-acodec", "aac",
        "-preset", "fast", "-crf", "28",
        temp_output,
    ]
    try:
        subprocess.run(command, check=True)
        os.rename(temp_output, output_path)  # Rename to the final output
        print(f"Compressed video created at: {output_path}")
    except subprocess.CalledProcessError as e:
        if os.path.exists(temp_output):
            os.remove(temp_output)
        raise RuntimeError(f"Compression failed: {e}")