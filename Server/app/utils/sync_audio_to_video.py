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

