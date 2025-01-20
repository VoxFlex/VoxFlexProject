import os
import whisper
from deep_translator import GoogleTranslator

def transcribe_and_translate(audio_path, source_language=None, target_language="th"):
    """ถอดเสียงและแปลข้อความ"""
    if not os.path.exists(audio_path):
        raise FileNotFoundError(f"Audio file not found: {audio_path}")
    
    model = whisper.load_model("small")

    # Transcribe audio
    result = model.transcribe(audio=audio_path, language=source_language, task="translate")
    english_text = result["text"]
    segments = result["segments"]
    
    if len(english_text) > 5000:
        english_text = english_text[:4500]
    
    if target_language != "en":
        translator = GoogleTranslator(source="en", target=target_language)
        translated_text = translator.translate(english_text)
        print(f"Translated Text ({target_language}): {translated_text}")
        for segment in segments:
            segment["text"] = translator.translate(segment["text"])  # แปลข้อความในแต่ละ segment

        return segments

    return segments
