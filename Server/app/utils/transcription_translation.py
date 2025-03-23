
# import os
# from dotenv import load_dotenv
# import whisperx
# import openai
# from deep_translator import GoogleTranslator
# import torch
# import re
# from num2words import num2words
# import time

# load_dotenv(".env.local")
# api_key = os.getenv("OPENAI_API_KEY")
# if not api_key:
#     raise ValueError("OPENAI_API_KEY is not set in .env.local file")

# client = openai.OpenAI(api_key=api_key)


# def convert_numbers_to_words(text, lang="th"):
#     """แปลงตัวเลขในข้อความให้เป็นคำอ่าน"""
#     def replace_number(match):
#         number = match.group()
#         return num2words(int(number), lang=lang)

#     return re.sub(r'\b\d+\b', replace_number, text)


# def detect_language(text):
#     """ ตรวจสอบภาษาของข้อความด้วย GPT-4o """
#     response = client.chat.completions.create(
#         model="gpt-4o",
#         messages=[
#             {"role": "system",
#                 "content": "You are a language detection expert. Identify the language of the following text and return only the language code (e.g., 'en' for English, 'th' for Thai, 'es' for Spanish)."},
#             {"role": "user", "content": text}
#         ]
#     )
#     return response.choices[0].message.content.strip().lower()


# def translate_with_gpt(text, source_lang, target_lang, segment_duration):
#     """ใช้ GPT-4o แปลข้อความหาก Google Translate แปลผิดภาษา"""
#     max_words = int(segment_duration * 3)  # ใช้ค่าเฉลี่ย 3 คำต่อวินาที
#     response = client.chat.completions.create(
#         model="gpt-4o",
#         messages=[
#             {"role": "system", "content": f"You are a professional translator. Translate the following text to {target_lang} by number of word that get equal {max_words} but not smooth can use number of word equal +1 or -1 of word {max_words}."},
#             # {"role": "system", "content": f"You are a professional translator. Translate the following text from {source_lang} to {target_lang} by number of word that get equal {max_words} but not smooth can use number of word equal +1 or -1 of word {max_words}."},
#             {"role": "user", "content": text}
#         ]
#     )
#     return response.choices[0].message.content.strip()


# def refine_translation_with_gpt(text, segment_duration, previous_context=None, target_language="th"):
#     """ใช้ GPT-4o เพื่อปรับคำแปลให้สั้นลง ตามเวลาที่กำหนด โดยไม่เปลี่ยนภาษา"""
#     text = convert_numbers_to_words(text, lang=target_language)

#     # คำนวณจำนวนคำสูงสุดที่เหมาะสม (ใช้ 2.5 - 3 คำต่อวินาที)
#     max_words = int(segment_duration * 3)  # ใช้ค่าเฉลี่ย 3 คำต่อวินาที

#     messages = [
#         {"role": "system", "content":
#          f"You are a professional language editor. Your job is to shorten the text while keeping the meaning intact. "
#          f"DO NOT translate. DO NOT change the language. DO NOT add or repeat sentences from previous context. "
#          f"Ensure the text does not exceed {max_words} words and number of word that get equal {max_words}."},
#     ]
# #  by number of word that get equal {max_words} but not smooth can use number of word equal +1 or -1 of word {max_words}.
#     if previous_context:
#         recent_context = " ".join(previous_context[-2:])
#         messages.append(
#             # {"role": "user", "content": f"Previous context:\n{recent_context}\n"
#             #                             f"Now, shorten the following text to fit within {max_words} words while keeping its meaning: {text}"}
#             {"role": "user", "content": f"Previous context:\n{recent_context}\n"
#              f"Now, following text to fit within {max_words} words while keeping its meaning: {text} by number of word that get equal {max_words}"}

#         )
#     else:
#         messages.append(
#             # {"role": "user", "content": f"Shorten this text to fit within {max_words} words while keeping its meaning: {text}"}
#             {"role": "user", "content": f"text to fit within {max_words} words while keeping its meaning: {text} by number of word that get equal {max_words}"}

#         )

#     response = client.chat.completions.create(
#         model="gpt-4o",
#         messages=messages
#     )
#     return response.choices[0].message.content


# def transcribe_and_translate(audio_path, source_language="en", target_language="th", max_chunk_duration=10):
#     """ถอดเสียงจากไฟล์เสียงและแปลเป็นภาษาที่ต้องการโดยใช้ WhisperX"""

#     if not os.path.exists(audio_path):
#         raise FileNotFoundError(f"Audio file not found: {audio_path}")

#     device = "cuda" if torch.cuda.is_available() else "cpu"

#     compute_type = "float16" if torch.cuda.is_available(
#     ) and torch.cuda.get_device_capability(0) >= (7, 0) else "float32"

#     model = whisperx.load_model(
#         "small", device=device, compute_type=compute_type)

#     # ถอดเสียงพร้อม timestamps
#     result = model.transcribe(audio_path, language=source_language,
#                               print_progress=True, verbose=True, chunk_size=max_chunk_duration)

#     #  ตรวจสอบว่า transcription ได้ `segments` หรือไม่
#     if "segments" not in result or not result["segments"]:
#         raise ValueError("Transcription failed: No segments found.")

#     segments = result["segments"]

#     # #  Alignment
#     # align_model, align_metadata = whisperx.load_align_model(language_code=source_language, device=device)
#     # aligned_result = whisperx.align(segments, align_model, align_metadata, audio_path, device)

#     # #  ตรวจสอบ alignment output
#     # if "segments" not in aligned_result or not aligned_result["segments"]:
#     #     raise ValueError("Alignment failed: No aligned segments found.")

#     # #  ใช้ข้อมูลจาก `aligned_result["segments"]`
#     # segments = aligned_result["segments"]

#     translator = GoogleTranslator(source="auto", target=target_language)
#     previous_context = []

#     for seg in segments:
#         text_en = seg["text"].strip()
#         # คำนวณความยาว segment เป็นวินาที
#         segment_duration = seg["end"] - seg["start"]

#         # ✅ ใช้ Google Translate แปลก่อน
#         # translated_text = translator.translate(text_en)
#         # print(f"✅ Google Translate: {translated_text}")
#         translated_text = translate_with_gpt(text_en, source_language, target_language, segment_duration)
#         print(f"✅ GPT-4o Translation: {translated_text}")
#         time.sleep(0.5)
#         # ตรวจสอบภาษาหลังแปล
#         detected_translated_lang = detect_language(translated_text)
#         print(
#             f"🔍 Detected language after translation: {detected_translated_lang}")

#         if detected_translated_lang != target_language:
#             print(f"⚠️ Google Translate failed! Using GPT-4o for translation.")
#             translated_text = translate_with_gpt(text_en, source_language, target_language, segment_duration)
#             print(f"✅ GPT-4o Translation: {translated_text}")

#         # ✅ ปรับคำแปลให้กระชับ
#         refined_text = refine_translation_with_gpt(
#             translated_text, segment_duration, previous_context, target_language)
#         refined_text = convert_numbers_to_words(
#             refined_text, lang=target_language)

#         # ✅ อัปเดต context
#         previous_context.append(refined_text)
#         if len(previous_context) > 2:
#             previous_context.pop(0)

#         seg["text"] = refined_text

#     return segments

import os
from dotenv import load_dotenv
import whisperx
import openai
import torch
import re
from num2words import num2words
import time

language_mapper = {
    "th": "Thai",
    "en": "English",
    "es": "Spanish",
    "fr": "French",
    "de": "German",
    "af": "Afrikaans",
    "am": "Amharic",
    "ar": "Arabic",
    "bg": "Bulgarian",
    "bn": "Bengali",
    "bs": "Bosnian",
    "ca": "Catalan",
    "cs": "Czech",
    "cy": "Welsh",
    "da": "Danish",
    "el": "Greek",
    "et": "Estonian",
    "eu": "Basque",
    "fi": "Finnish",
    "ga": "Galician",
    "gu": "Gujarati",
    "ha": "Hausa",
    "hi": "Hindi",
    "hr": "Croatian",
    "hu": "Hungarian",
    "id": "Indonesian",
    "is": "Icelandic",
    "it": "Italian",
    "iw": "Hebrew",
    "ja": "Japanese",
    "jv": "Javanese",
    "km": "Khmer",
    "kn": "Kannada",
    "ko": "Korean",
    "la": "Latin",
    "lv": "Latvian",
    "ml": "Malayalam",
    "mr": "Marathi",
    "ms": "Malay",
    "my": "Myanmar (Burmese)",
    "ne": "Nepali",
    "nl": "Dutch",
    "no": "Norwegian",
    "pa": "Punjabi (Gurmukhi)",
    "pl": "Polish",
    "pt_PT": "Portuguese (Portugal)",
    "pt_BR": "Portuguese (Brazil)",
    "ro": "Romanian",
    "ru": "Russian",
    "si": "Sinhala",
    "sk": "Slovak",
    "sq": "Albanian",
    "sr": "Serbian",
    "su": "Sundanese",
    "sv": "Swedish",
    "sw": "Swahili",
    "ta": "Tamil",
    "te": "Telugu",
    "tl": "Filipino",
    "tr": "Turkish",
    "uk": "Ukrainian",
    "ur": "Urdu",
    "vi": "Vietnamese",
    "yue": "Cantonese",
    "zh_CN": "Chinese (Simplified)",
    "zh_TW": "Chinese (Mandarin/Taiwan)",
    "zh": "Chinese (Mandarin)"
}


load_dotenv(".env.local")
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY is not set in .env.local file")

client = openai.OpenAI(api_key=api_key)


def convert_numbers_to_words(text, lang="en"):
    try:
        return re.sub(r'\b\d+\b', lambda x: num2words(int(x.group()), lang=lang), text)
    except NotImplementedError:
        # หากภาษาไม่รองรับ ก็คืนข้อความเดิม
        return re.sub(r'\b\d+\b', lambda x: num2words(int(x.group()), lang="en"), text)


def detect_language(text):
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system",
                "content": "Identify language code only (e.g., 'en', 'th')."},
            {"role": "user", "content": text}
        ]
    )
    return response.choices[0].message.content.strip().lower()


def translate_full_context(text, target_lang):
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system",
                "content": f"Translate full context to {language_mapper[target_lang]}."},
            {"role": "user", "content": text}
        ]
    )

    return response.choices[0].message.content.strip().lower()


def translate_with_gpt(text, source_lang, target_lang, max_words, original_context=None):
    print(f"✅ Translating: {text}")
    print(
        f"✅ Source: {source_lang}, Target: {target_lang} / {language_mapper[target_lang]}")
    system_prompt = f"You are a professional translator. Translate text or sentence to {language_mapper[target_lang]} language. Ensure the translation smoothly connects with the original full context provided. Aim for approximately {max_words} words.(+/- 1 word is acceptable)."

    if original_context:
        user_prompt = f"Full original context:\n{original_context}\n\nSegment to translate:\n{text}\n\nTranslation: Translate text or sentence to {language_mapper[target_lang]} language:"
    else:
        user_prompt = f"Segment to translate:\n{text}\n\nTranslation: Translate text or sentence to {language_mapper[target_lang]} language:"

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )
    return response.choices[0].message.content.strip()


def refine_translation(text, max_words, previous_translation=None, lang="th"):
    prompt = f"You are a professional language editor. Your job is refine text by refined text MUST contain exactly {max_words} words in {language_mapper[lang]}.\n Keep meaning and smooth continuity. Do not translate."
    # prompt = (
    #     f"You are a professional language editor. Your task is to refine the given text to exactly {max_words} words in {language_mapper[lang]}. "
    #     "Maintain the original meaning, smooth continuity, and tone. Do NOT translate or add any additional meaning. "
    #     f"The refined text MUST contain exactly {max_words} words, no more"
    # )
    # if previous_translation:
    #     prompt += f" Previous text: '{previous_translation}'."

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "system", "content": prompt},
                  {"role": "user", "content": text}]
    )
    return response.choices[0].message.content.strip()


def transcribe_and_translate(audio_path, source_language="en", target_language="th", max_chunk_duration=7):
    if not os.path.exists(audio_path):
        raise FileNotFoundError(f"Audio file not found: {audio_path}")

    device = "cuda" if torch.cuda.is_available() else "cpu"
    compute_type = "float16" if torch.cuda.is_available() else "float32"
    model = whisperx.load_model(
        "small", device=device, compute_type=compute_type)

    result = model.transcribe(audio_path, language=source_language,
                              chunk_size=max_chunk_duration)

    if "segments" not in result:
        raise ValueError("No transcription segments found.")

    segments = result["segments"]

    original_full_text = " ".join([seg["text"].strip() for seg in segments])
    # context_full = understand_full_context(original_full_text, source_language)
    full_translation = translate_full_context(original_full_text, target_language)
    previous_translation = None

    for seg in segments:
        original_text = seg["text"].strip()
        segment_duration = seg["end"] - seg["start"]
        max_words = int(segment_duration * 2.3)

        translated_text = translate_with_gpt(original_text, source_language, target_language, max_words, full_translation)
        refined_text = refine_translation(translated_text, max_words, previous_translation, target_language)
        convert_numbers_text = convert_numbers_to_words(refined_text, lang=target_language)
        previous_translation = convert_numbers_text

        # translated_text = translate_with_gpt(original_text, source_language, target_language, max_words, original_full_text)
        # refined_text = convert_numbers_to_words(translated_text, lang=target_language)
        seg["text"] = convert_numbers_text

        time.sleep(0.5)

    return segments
