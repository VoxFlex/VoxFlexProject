from gtts import gTTS

def generate_speech_from_text_gtts(text, output_audio_path):
    """สร้างไฟล์เสียงจากข้อความโดยใช้ gTTS"""
    print("Generating speech using gTTS...")
    tts = gTTS(text=text, lang='th')  # ตั้งค่า `lang` ตามภาษาที่ต้องการ
    tts.save(output_audio_path)
    print(f"Translated audio saved at: {output_audio_path}")
