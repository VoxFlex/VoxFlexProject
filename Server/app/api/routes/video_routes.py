from fastapi import APIRouter, UploadFile, Form
from app.api.controllers.video_controller import VideoController

router = APIRouter()

@router.post("/process/")
async def process_video(
    video_file: UploadFile, 
    target_language: str = Form("th"),
    voice_model: str = Form("alloy")
):  
    print("route voice_model: ", voice_model)
    return await VideoController.process_video(video_file, target_language, voice_model)
