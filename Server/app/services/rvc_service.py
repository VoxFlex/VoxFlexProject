import requests
from fastapi import UploadFile

RVC_SERVER_URL = "http://localhost:8001"  # เปลี่ยนเป็น URL จริงของ RVC-Server

class RVCService:
    @staticmethod
    async def convert_voice(file: UploadFile):
        """ส่งไฟล์เสียงไปที่ RVC-Server"""
        try:
            files = {"file": (file.filename, file.file, "audio/wav")}
            response = requests.post(f"{RVC_SERVER_URL}/voice/convert", files=files)

            if response.status_code != 200:
                return {"error": f"RVC-Server Error: {response.text}"}

            return response.json()
        except Exception as e:
            return {"error": str(e)}

    @staticmethod
    def list_models():
        """ดึงรายชื่อโมเดลจาก RVC-Server"""
        try:
            response = requests.get(f"{RVC_SERVER_URL}/models")
            return response.json()
        except Exception as e:
            return {"error": str(e)}

    @staticmethod
    def select_model(model_name: str):
        """เลือกโมเดลเสียงที่ต้องการใช้"""
        try:
            response = requests.post(f"{RVC_SERVER_URL}/models/select", params={"model_name": model_name})
            return response.json()
        except Exception as e:
            return {"error": str(e)}
        
    @staticmethod
    def health_check():
        """เลือกโมเดลเสียงที่ต้องการใช้"""
        try:
            response = requests.get(f"{RVC_SERVER_URL}/")
            print("response.json() :", response.json())
            return response.json()
        except Exception as e:
            return {"error": str(e)}