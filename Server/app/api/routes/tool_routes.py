from fastapi import APIRouter, UploadFile, File, Form
from app.api.controllers.tool_controller import ToolController

router = APIRouter()

# ✅ Voice Translation Route
@router.post("/voice/translate")
async def voice_translation(
    audio_file: UploadFile = File(...),
    target_language: str = Form("en"),
    voice_model: str = Form("alloy")
):
    """แปลเสียงและสร้างเสียงใหม่ด้วยโมเดลที่กำหนด"""
    return await ToolController.voice_translation(audio_file, target_language, voice_model)

@router.post("/tts")
async def text_to_speech(
    text: str = Form(...),
    target_language: str = Form("en"),
    voice_model: str = Form("alloy")
):
    """แปลข้อความเป็นเสียง (Text-to-Speech)"""
    return await ToolController.text_to_speech(text, target_language, voice_model)