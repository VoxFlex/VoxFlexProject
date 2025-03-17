from fastapi import APIRouter, Form, UploadFile, File
from app.api.controllers.rvc_controller import RVCController

router = APIRouter()

@router.post("/voice/convert")
async def convert_voice(file: UploadFile = File(...)):
    """ส่งไฟล์ไปที่ RVC-Server เพื่อเปลี่ยนเสียง"""
    return await RVCController.convert_voice(file)

@router.post("/song/convert")
async def convert_song(file: UploadFile = File(...)):
    """ส่งไฟล์ไปที่ RVC-Server เพื่อแปลงเพลง"""
    return await RVCController.convert_song(file)

@router.post("/video/convert")
async def convert_video(
    file: UploadFile = File(...),
    is_music_video: str = Form("false")  # ✅ เพิ่ม `Form()` เพื่อรับค่าจาก `form-data`
):
    """ส่งไฟล์วิดีโอไปที่ RVC-Server"""
    return await RVCController.convert_video(file, is_music_video.lower() == "true")

@router.post("/models/upload")
async def upload_model_route(file: UploadFile = File(...)):
    """อัปโหลดโมเดล .zip ที่มีไฟล์ .pth สำหรับ RVC-Server"""
    return await RVCController.upload_model(file)

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
