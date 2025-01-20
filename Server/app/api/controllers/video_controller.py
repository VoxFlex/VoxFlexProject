import os
from fastapi import UploadFile
from fastapi.responses import StreamingResponse
from app.services.video_service import VideoService
from app.utils.file_utils import iterfile

class VideoController:
    @staticmethod
    async def process_video(video_file: UploadFile, target_language: str):
        print(f"Processing video: {video_file.filename}")
        try:
            result_path = await VideoService.process_video(video_file, target_language)

            # Verify file existence before streaming
            if not os.path.exists(result_path):
                raise FileNotFoundError(f"Resulting file not found: {result_path}")

            return StreamingResponse(
                iterfile(result_path),
                media_type="video/mp4",
                headers={"Content-Disposition": f"attachment; filename=processed_{video_file.filename}"}
            )
        except Exception as e:
            print(f"Error processing video: {e}")
            return {"error": str(e)}

