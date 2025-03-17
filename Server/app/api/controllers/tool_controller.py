from fastapi import UploadFile
from app.services.tool_service import ToolService

class ToolController:
    @staticmethod
    async def voice_translation(audio_file: UploadFile, target_language: str, voice_model: str):
        return await ToolService.voice_translation(audio_file, target_language, voice_model)
    @staticmethod
    async def text_to_speech(text: str, target_language: str, voice_model: str):
        return await ToolService.text_to_speech(text, target_language, voice_model)