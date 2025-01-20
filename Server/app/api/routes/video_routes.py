from fastapi import APIRouter, UploadFile, Form
from app.api.controllers.video_controller import VideoController

router = APIRouter()

@router.post("/process/")
async def process_video(video_file: UploadFile, target_language: str = Form("th")):
    return await VideoController.process_video(video_file, target_language)
