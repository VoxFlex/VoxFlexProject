import os
import subprocess

def convert_video_to_audio(video_path, audio_path):
    """แปลงไฟล์วิดีโอเป็นไฟล์เสียง"""
    if not os.path.exists(video_path):
        raise FileNotFoundError(f"Video file not found: {video_path}")

    command = f"ffmpeg -i {video_path} -ab 160k -ac 2 -ar 44100 -vn {audio_path}"
    subprocess.call(command, shell=True)
    print(f"Audio extracted: {audio_path}")
