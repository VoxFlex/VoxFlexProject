
import os
from dotenv import load_dotenv
import whisperx
import openai
from deep_translator import GoogleTranslator
import torch
import re
from num2words import num2words

load_dotenv(".env.local")
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY is not set in .env.local file")

client = openai.OpenAI(api_key=api_key)

def convert_numbers_to_words(text, lang="th"):
    """แปลงตัวเลขในข้อความให้เป็นคำอ่าน"""
    def replace_number(match):
        number = match.group()
        return num2words(int(number), lang=lang)

    return re.sub(r'\b\d+\b', replace_number, text)
def refine_translation_with_gpt(text, segment_duration, previous_context=None, target_language="th"):
    """ใช้ GPT-4o เพื่อปรับคำแปลให้สั้นลง ตามเวลาที่กำหนด โดยไม่เปลี่ยนภาษา"""
    text = convert_numbers_to_words(text, lang=target_language)

    # คำนวณจำนวนคำสูงสุดที่เหมาะสม (ใช้ 2.5 - 3 คำต่อวินาที)
    max_words = int(segment_duration * 3)  # ใช้ค่าเฉลี่ย 3 คำต่อวินาที

    messages = [
        {"role": "system", "content": 
         f"You are a professional language editor. Your job is to shorten the text while keeping the meaning intact. "
         f"DO NOT translate. DO NOT change the language. DO NOT add or repeat sentences from previous context. "
         f"Ensure the text does not exceed {max_words} words."}
    ]

    if previous_context:
        recent_context = " ".join(previous_context[-2:])
        messages.append(
            {"role": "user", "content": f"Previous context:\n{recent_context}\n"
                                        f"Now, shorten the following text to fit within {max_words} words while keeping its meaning: {text}"}
        )
    else:
        messages.append(
            {"role": "user", "content": f"Shorten this text to fit within {max_words} words while keeping its meaning: {text}"}
        )

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=messages
    )
    return response.choices[0].message.content

def transcribe_and_translate(audio_path, source_language="en", target_language="th", max_chunk_duration=7):
    """ถอดเสียงจากไฟล์เสียงและแปลเป็นภาษาที่ต้องการโดยใช้ WhisperX"""

    if not os.path.exists(audio_path):
        raise FileNotFoundError(f"Audio file not found: {audio_path}")

    device = "cuda" if torch.cuda.is_available() else "cpu"
    
    compute_type = "float16" if torch.cuda.is_available() and torch.cuda.get_device_capability(0) >= (7, 0) else "float32"

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
    previous_context = [] 

    for seg in segments:
        text_en = seg["text"].strip()
        segment_duration = seg["end"] - seg["start"]  # คำนวณความยาว segment เป็นวินาที

        # Translate to target language
        translated_text = translator.translate(text_en)

        # ปรับคำแปลให้กระชับ
        refined_text = refine_translation_with_gpt(translated_text, segment_duration, previous_context, target_language)
        refined_text = convert_numbers_to_words(refined_text, lang=target_language)
        
         # อัปเดต context
        previous_context.append(refined_text)
        if len(previous_context) > 2:
            previous_context.pop(0)

        seg["text"] = refined_text

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

# feat: Enhance AI dubbing with number conversion & GPT-4o refinement

# - Switched to GPT-4o for improved translation accuracy and contextual coherence.
# - Implemented `convert_numbers_to_words()` to replace numeric digits with Thai words for better readability.
# - Updated `refine_translation_with_gpt()` to maintain language consistency and prevent unwanted merging.
# - Introduced `previous_context` tracking to improve sentence flow without repetition.
# - Retained WhisperX speech-to-text optimization with GPU acceleration (`float16` if supported).
# - Ensured translated segments remain concise and correctly formatted.
# - Maintained debugging support with `print_progress=True` and `verbose=True`.

# 💡 Summary:
# 🔹 GPT-4o now respects natural speaking pace (max 3 words/sec).
# 🔹 Translations are shorter and fit within each segment's duration.
# 🔹 Numbers are automatically converted to words before processing.
# 🔹 Better sentence consistency with improved context tracking.