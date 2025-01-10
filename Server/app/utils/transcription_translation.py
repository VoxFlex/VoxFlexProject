import os
import whisper
# from googletrans import Translator
from deep_translator import GoogleTranslator

# def transcribe_and_translate(audio_path, source_language=None, target_language="th"):
#     """ถอดเสียงและแปลข้อความ"""
#     if not os.path.exists(audio_path):
#         raise FileNotFoundError(f"Audio file not found: {audio_path}")

#     print(f"Transcribing and translating audio: {audio_path}")
    
#     # Load the Whisper model
#     model = whisper.load_model("small")

#     # Transcribe audio
#     result = model.transcribe(audio=audio_path, language=source_language, task="translate")
#     english_text = result["text"]
#     segments = result["segments"]  # ดึง segments เพื่อเก็บ timestamps
    
#     # print(f"Translated Text (English): {english_text}")
#     if len(english_text) > 5000:
#         english_text = english_text[:4500]
#     print(f"Translated Text (English): {english_text}")
    
#     # If target language is not English, translate the text -> target thai,japn etc
#     if target_language != "en":
#         translator = GoogleTranslator(source="en", target=target_language)
#         translated_text = translator.translate(english_text)  # Use english_text here
#         print(f"Translated Text ({target_language}): {translated_text}")

#         return translated_text ,segments
    
#     return english_text ,segments

def transcribe_and_translate(audio_path, source_language=None, target_language="th"):
    """ถอดเสียงและแปลข้อความ"""
    if not os.path.exists(audio_path):
        raise FileNotFoundError(f"Audio file not found: {audio_path}")

    print(f"Transcribing and translating audio: {audio_path}")
    
    # Load the Whisper model
    model = whisper.load_model("small")

    # Transcribe audio
    result = model.transcribe(audio=audio_path, language=source_language, task="translate")
    english_text = result["text"]
    segments = result["segments"]  # ดึง segments เพื่อเก็บ timestamps
    
    if len(english_text) > 5000:
        english_text = english_text[:4500]
    print(f"Translated Text (English): {english_text}")
    
    # If target language is not English, translate the text
    if target_language != "en":
        translator = GoogleTranslator(source="en", target=target_language)
        translated_text = translator.translate(english_text)
        print(f"Translated Text ({target_language}): {translated_text}")

        # Translate each segment text
        for segment in segments:
            segment["text"] = translator.translate(segment["text"])  # แปลข้อความในแต่ละ segment

        return translated_text, segments

    return english_text, segments
