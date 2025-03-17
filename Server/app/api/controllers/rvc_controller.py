from fastapi import UploadFile
from app.services.rvc_service import RVCService

class RVCController:
    @staticmethod
    async def convert_voice(file: UploadFile):
        """เรียกใช้ RVC-Service เพื่อเปลี่ยนเสียง"""
        return await RVCService.convert_voice(file)
    
    @staticmethod
    async def convert_song(file: UploadFile):
        return await RVCService.convert_song(file)

    @staticmethod
    async def convert_video(file: UploadFile, is_music_video: bool):
        """เรียกใช้ RVC-Service เพื่อแปลงวิดีโอ"""
        return await RVCService.convert_video(file, is_music_video)

    @staticmethod
    async def upload_model(file: UploadFile):
        return await RVCService.upload_model(file)

    @staticmethod
    def list_models():
        """เรียกใช้ RVC-Service เพื่อดูรายชื่อโมเดล"""
        return RVCService.list_models()

    @staticmethod
    def select_model(model_name: str):
        """เรียกใช้ RVC-Service เพื่อเลือกโมเดล"""
        return RVCService.select_model(model_name)
    
    @staticmethod
    def health_check():
        return RVCService.health_check()

