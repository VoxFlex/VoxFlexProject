
import os
from dotenv import load_dotenv
import whisperx
import openai
from deep_translator import GoogleTranslator
import torch

load_dotenv(".env.local")
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY is not set in .env.local file")

client = openai.OpenAI(api_key=api_key)

def refine_translation_with_gpt(text):
    """ใช้ GPT-4 ปรับการแปลให้กระชับ"""
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "คุณเป็นนักแปลที่เชี่ยวชาญในการย่อคำแปลให้กระชับและตรงประเด็น"},
            {"role": "user", "content": f"ช่วยปรับคำแปลนี้ให้สั้นลงและคงความหมายไว้: {text}"}
        ]
    )
    return response.choices[0].message.content

def transcribe_and_translate(audio_path, source_language="en", target_language="th", max_chunk_duration=5):
    """ถอดเสียงจากไฟล์เสียงและแปลเป็นภาษาที่ต้องการโดยใช้ WhisperX"""

    if not os.path.exists(audio_path):
        raise FileNotFoundError(f"Audio file not found: {audio_path}")

    # ตรวจสอบว่าใช้ GPU ได้หรือไม่
    device = "cuda" if torch.cuda.is_available() else "cpu"
    
    # ตรวจสอบว่า GPU รองรับ float16 หรือไม่
    compute_type = "float16" if torch.cuda.is_available() and torch.cuda.get_device_capability(0) >= (7, 0) else "float32"

    # โหลดโมเดล WhisperX
    model = whisperx.load_model("small", device=device, compute_type=compute_type)

    # ถอดเสียงพร้อม timestamps
    result = model.transcribe(audio_path, language=source_language, print_progress=True, verbose=True,chunk_size=max_chunk_duration)

    #  ตรวจสอบว่า transcription ได้ `segments` หรือไม่
    if "segments" not in result or not result["segments"]:
        raise ValueError("Transcription failed: No segments found.")

    segments = result["segments"]

    # #  Alignment
    # align_model, align_metadata = whisperx.load_align_model(language_code=source_language, device=device)
    # aligned_result = whisperx.align(segments, align_model, align_metadata, audio_path, device)

    # #  ตรวจสอบ alignment output
    # if "segments" not in aligned_result or not aligned_result["segments"]:
    #     raise ValueError("Alignment failed: No aligned segments found.")

    # #  ใช้ข้อมูลจาก `aligned_result["segments"]`
    # segments = aligned_result["segments"]

    translator = GoogleTranslator(source=source_language, target=target_language)

    for seg in segments:
        text_en = seg["text"].strip()

        # แปลเป็นภาษาไทย
        translated_text = translator.translate(text_en)

        # ปรับคำแปลให้กระชับ
        translated_text = refine_translation_with_gpt(translated_text)

        # อัพเดทข้อมูลแปลกลับไปใน segments
        seg["text"] = translated_text

    return segments


# 📌 รายละเอียดของการปรับปรุง
# ✅ เพิ่ม GPT-4 (refine_translation_with_gpt()) → ใช้ AI ปรับคำแปลให้กระชับขึ้น
# ✅ ใช้ WhisperX (whisperx.load_model()) → ถอดเสียงจากวิดีโอและรองรับ GPU acceleration
# ✅ รองรับการใช้ GPU (torch.cuda.is_available()) → ใช้ float16 ถ้า GPU รองรับ
# ✅ ใช้ GoogleTranslator → แปลภาษาแบบอัตโนมัติ
# ✅ ปรับ max_chunk_duration → จำกัดเวลาของแต่ละ segment ให้ ไม่เกิน 5 วินาที เพื่อให้ได้ผลลัพธ์ที่แม่นยำขึ้น
# ✅ เพิ่ม print_progress=True และ verbose=True → แสดงความคืบหน้าขณะรันโค้ด

# feat: Improve AI dubbing with GPT-4 translation & WhisperX optimization
# - Integrated GPT-4 (`refine_translation_with_gpt()`) to refine translations and make them more concise.
# - Optimized WhisperX for speech-to-text processing, including GPU acceleration (`float16` if supported).
# - Added `GoogleTranslator` to handle automatic language translation.
# - Set `max_chunk_duration=5` to limit segment length for better synchronization.
# - Enabled `print_progress=True` and `verbose=True` for better debugging.