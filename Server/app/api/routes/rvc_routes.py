from fastapi import APIRouter, UploadFile, File
from app.api.controllers.rvc_controller import RVCController

router = APIRouter()

@router.post("/voice/convert")
async def convert_voice(file: UploadFile = File(...)):
    """ส่งไฟล์ไปที่ RVC-Server เพื่อเปลี่ยนเสียง"""
    return await RVCController.convert_voice(file)

@router.get("/models")
def get_models():
    """ดึงรายชื่อโมเดลที่มีใน RVC-Server"""
    return RVCController.list_models()

@router.post("/models/select")
def select_model(model_name: str):
    """เลือกโมเดลเสียง"""
    return RVCController.select_model(model_name)

@router.get("/health_check")
def health_check_rvc():
    """ดึงรายชื่อโมเดลที่มีใน RVC-Server"""
    return RVCController.health_check()
