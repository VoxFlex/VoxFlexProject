from fastapi import UploadFile
from app.services.rvc_service import RVCService

class RVCController:
    @staticmethod
    async def convert_voice(file: UploadFile):
        """เรียกใช้ RVC-Service เพื่อเปลี่ยนเสียง"""
        return await RVCService.convert_voice(file)

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

