import os
from dotenv import load_dotenv
import openai
from pydub import AudioSegment

load_dotenv(".env.local")
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY is not set in .env.local file")

client = openai.OpenAI(api_key=api_key)

def generate_speech_with_sync(text_segments, output_audio_path, target_language,voice="alloy"):
    """สร้างไฟล์เสียงจากข้อความโดยใช้ OpenAI TTS-1 และปรับตาม timestamps"""
    combined_audio = AudioSegment.silent(duration=0)

    for idx, segment in enumerate(text_segments):
        text = segment['text']
        start_time = segment['start'] * 1000  # convert to milliseconds
        end_time = segment['end'] * 1000  # convert to milliseconds
        duration = end_time - start_time

        print(f"Processing segment {idx+1}/{len(text_segments)}: {text}")
        
        # ใช้ OpenAI TTS-1 สร้างเสียง 
        with client.audio.speech.with_streaming_response.create(
            model="tts-1",
            voice=voice,
            input=text
        ) as response:
            temp_audio_path = f"temp_segment_{idx}.mp3"
            response.stream_to_file(temp_audio_path)

        # โหลดไฟล์เสียงและปรับตาม duration
        segment_audio = AudioSegment.from_file(temp_audio_path)

        # ปรับความยาวเสียงให้ตรงกับ duration
        segment_audio = segment_audio.set_frame_rate(44100).set_channels(2)
        if len(segment_audio) > duration:
            segment_audio = segment_audio.speedup(playback_speed=len(segment_audio) / duration)
        else:
            segment_audio = segment_audio + AudioSegment.silent(duration=(duration - len(segment_audio)))

        combined_audio += segment_audio
        os.remove(temp_audio_path)  # 🔥 ลบไฟล์ชั่วคราว

    combined_audio.export(output_audio_path, format="wav")
    print(f"🎙️ Translated and synced audio saved at: {output_audio_path}")