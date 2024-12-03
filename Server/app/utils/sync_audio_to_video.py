import os
import subprocess

def run_inference(video_path, audio_path, output_path, checkpoint_path):
    """Run the inference process with Easy-Wav2Lip."""
    # Get the absolute path to inference.py
    script_path = os.path.join(os.path.dirname(__file__), "../../Easy-Wav2Lip/inference.py")

    # Create the command to execute inference.py
    command = [
        "python", script_path,
        "--checkpoint_path", checkpoint_path,
        "--face", video_path,
        "--audio", audio_path,
        "--outfile", output_path
    ]

    # Execute the command
    subprocess.run(command, check=True)

