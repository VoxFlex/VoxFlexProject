from pydub import AudioSegment
from gtts import gTTS

def generate_speech_with_sync(text_segments, output_audio_path, target_language):
    """สร้างไฟล์เสียงจากข้อความและปรับตาม timestamps"""
    combined_audio = AudioSegment.silent(duration=0)
    for segment in text_segments:
        print("text_segments : ",text_segments)
        print("target_language :" , target_language)
        text = segment['text']
        start_time = segment['start'] * 1000  # convert to milliseconds
        end_time = segment['end'] * 1000  # convert to milliseconds
        duration = end_time - start_time
        
        # สร้างเสียงสำหรับข้อความ
        tts = gTTS(text=text, lang=target_language)
        temp_audio_path = "temp_segment.mp3"
        tts.save(temp_audio_path)
        
        segment_audio = AudioSegment.from_file(temp_audio_path)
        
        # ปรับความยาวเสียงให้ตรงกับ duration
        segment_audio = segment_audio.set_frame_rate(44100).set_channels(2)
        if len(segment_audio) > duration:
            segment_audio = segment_audio.speedup(playback_speed=len(segment_audio) / duration)
        else:
            segment_audio = segment_audio + AudioSegment.silent(duration=(duration - len(segment_audio)))
        
        combined_audio += segment_audio

    combined_audio.export(output_audio_path, format="wav")
    print(f"Translated and synced audio saved at: {output_audio_path}")
