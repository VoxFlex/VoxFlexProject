import os
from dotenv import load_dotenv
import openai
from pydub import AudioSegment

load_dotenv(".env.local")
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY is not set in .env.local file")

client = openai.OpenAI(api_key=api_key)

def generate_speech(text: str, output_audio_path: str, voice_model: str = "alloy"):
    """
    สร้างเสียงจากข้อความโดยใช้ OpenAI TTS-1
    ✅ รองรับโมเดลเสียง: alloy, ash, coral, echo, fable, onyx, nova, sage, shimmer
    """
    try:
        print(f"🗣️ Generating TTS with voice model: {voice_model}")

        # ✅ สร้างเสียงจากข้อความ
        with client.audio.speech.with_streaming_response.create(
            model="tts-1",
            voice=voice_model,
            input=text
        ) as response:
            temp_audio_path = "temp_tts_output.mp3"
            response.stream_to_file(temp_audio_path)

        # ✅ แปลงไฟล์เสียงให้เป็น .wav (คุณภาพสูงขึ้น)
        segment_audio = AudioSegment.from_file(temp_audio_path)

        # ✅ แปลงไฟล์เป็น WAV format
        segment_audio = segment_audio.set_frame_rate(44100).set_channels(2)

        # ✅ Export to the specified output path
        segment_audio.export(output_audio_path, format="wav")
        print(f"✅ TTS generated successfully at: {output_audio_path}")

        # ✅ ลบไฟล์ชั่วคราว
        os.remove(temp_audio_path)

    except Exception as e:
        print(f"❌ Error during TTS generation: {e}")
        raise RuntimeError(f"❌ Error generating speech: {e}")
