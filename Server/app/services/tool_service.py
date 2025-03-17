import base64
import os
import uuid
from fastapi import UploadFile, HTTPException
from fastapi.responses import JSONResponse
from app.utils.generate_speech import generate_speech
from app.utils.transcription_translation import transcribe_and_translate
from app.utils.tts_generation_with_sync import generate_speech_with_sync
from app.utils.file_utils import save_uploaded_file, cleanup_files

class ToolService:
    @staticmethod
    async def voice_translation(audio_file: UploadFile, target_language: str, voice_model: str):
        """แปลเสียงและสร้างเสียงใหม่ด้วยโมเดลที่กำหนด"""

        # สร้าง Path สำหรับไฟล์ชั่วคราว
        base_dir = os.path.dirname(os.path.abspath(__file__))
        input_dir = os.path.abspath(os.path.join(base_dir, "../../input"))
        temp_dir = os.path.abspath(os.path.join(base_dir, "../../temp"))
        output_dir = os.path.abspath(os.path.join(base_dir, "../../output"))

        os.makedirs(input_dir, exist_ok=True)
        os.makedirs(temp_dir, exist_ok=True)
        os.makedirs(output_dir, exist_ok=True)

        # ตั้งชื่อไฟล์ชั่วคราว
        file_id = str(uuid.uuid4())
        paths = {
            "audio": os.path.join(temp_dir, f"temp_audio_{file_id}.wav"),
            "translated_audio": os.path.join(temp_dir, f"translated_audio_{file_id}.wav"),
        }

        try:
            # Step 1: บันทึกไฟล์ที่อัปโหลด
            save_uploaded_file(audio_file, paths["audio"])
            print(f"Uploaded audio saved at: {paths['audio']}")

            # Step 2: ถอดเสียงและแปลภาษา
            segments = transcribe_and_translate(paths["audio"], target_language=target_language)
            print("Transcription and translation complete.")

            # Step 3: สร้างเสียงใหม่จากคำแปล
            generate_speech_with_sync(segments, paths["translated_audio"], target_language, voice_model)
            print(f"Translated audio saved at: {paths['translated_audio']}")

            # Step 4: ตรวจสอบว่าไฟล์เสียงที่แปลงแล้วถูกสร้างหรือไม่
            if not os.path.exists(paths["translated_audio"]):
                raise FileNotFoundError(f"❌ Translated audio file not created: {paths['translated_audio']}")

            # Step 5: แปลงไฟล์เป็น Base64 เพื่อนำไปใช้งานต่อ
            encoded_audio = ""
            with open(paths["translated_audio"], "rb") as output_file:
                encoded_audio = base64.b64encode(output_file.read()).decode()

            return JSONResponse(content={
                "message": " Voice translation completed successfully.",
                "translated_audio_path": paths["translated_audio"],
                "voice_model": voice_model,
                "audio_base64": encoded_audio
            })

        except Exception as e:
            print(f"❌ Error during voice translation: {e}")
            raise HTTPException(status_code=500, detail=f"❌ Error: {str(e)}")

        finally:
            cleanup_files([paths["audio"], paths["translated_audio"]])
    
    @staticmethod
    async def text_to_speech(text: str, target_language: str, voice_model: str):
        """สร้างเสียงจากข้อความ (Text-to-Speech)"""
        
        # สร้าง Path สำหรับไฟล์ชั่วคราว
        base_dir = os.path.dirname(os.path.abspath(__file__))
        temp_dir = os.path.abspath(os.path.join(base_dir, "../../temp"))
        output_dir = os.path.abspath(os.path.join(base_dir, "../../output"))

        os.makedirs(temp_dir, exist_ok=True)
        os.makedirs(output_dir, exist_ok=True)

        # ตั้งชื่อไฟล์ชั่วคราว
        file_id = str(uuid.uuid4())
        output_path = os.path.join(output_dir, f"tts_{file_id}.wav")

        try:
            # ✅ Step 1: สร้างเสียงจากข้อความ
            generate_speech(text, output_path, voice_model)

            # ✅ Step 2: ตรวจสอบว่าไฟล์ TTS ถูกสร้างขึ้นหรือไม่
            if not os.path.exists(output_path):
                raise FileNotFoundError(f"❌ TTS audio file not created: {output_path}")

            # ✅ Step 3: แปลงไฟล์เป็น Base64 เพื่อส่งกลับ
            encoded_audio = ""
            with open(output_path, "rb") as audio_file:
                encoded_audio = base64.b64encode(audio_file.read()).decode()

            return JSONResponse(content={
                "message": "✅ Text-to-Speech completed successfully.",
                "tts_audio_path": output_path,
                "voice_model": voice_model,
                "audio_base64": encoded_audio
            })

        except Exception as e:
            print(f"❌ Error during TTS generation: {e}")
            raise HTTPException(status_code=500, detail=f"❌ Error: {str(e)}")

        finally:
            cleanup_files([output_path])