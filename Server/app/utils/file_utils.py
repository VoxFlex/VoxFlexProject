import os

from fastapi import UploadFile

def save_uploaded_file(video_file: UploadFile, video_path_destination):
    with open(video_path_destination, "wb") as f:
        f.write(video_file.file.read())

def iterfile(file_path):
    with open(file_path, "rb") as file:
        yield from file

def cleanup_files(file_paths: list[str], exclude: str = None):
    for path in file_paths:
        if exclude and path == exclude:
            continue
        if os.path.exists(path):
            os.remove(path)

