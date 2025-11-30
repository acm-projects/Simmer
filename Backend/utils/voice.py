# import os
# from gtts import gTTS
# from google.oauth2 import service_account
# from google.cloud import speech
# from google.cloud import texttospeech
# import pyaudio

# current_dir = os.path.dirname(os.path.abspath(__file__))
# key_path = os.path.join(current_dir, '..', 'sttKey.json')
# credentials = service_account.Credentials.from_service_account_file(key_path)
# client = speech.SpeechClient(credentials=credentials)
# clientSpeaker = texttospeech.TextToSpeechClient(credentials=credentials)
# voice = texttospeech.VoiceSelectionParams(
#     language_code="en-US", name="Archenar"
# )
# audio_config = texttospeech.AudioConfig(
#     audio_encoding=texttospeech.AudioEncoding.MP3
# )


# # fileName= path to recording file (will switch for streaming later)

# def stt(audio_data):
#     # with open(fileName,"rb") as file:
#     #     audio_data = file.read()
    
#     audio = speech.RecognitionAudio(content=audio_data)
#     config = speech.RecognitionConfig(
#         encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
#         sample_rate_hertz=16000,
#         language_code="en-US"
#     )

#     response = client.recognize(config=config, audio=audio)
#     transcript = ""
#     transcript += " ".join([result.alternatives[0].transcript for result in response.results])
#     return transcript

# def speak(words):
#     tts = gTTS(words)
#     tts.save("recipe.mp3")

# def speaks(text):
#     synthesis_input = texttospeech.SynthesisInput(text=text)
#     response = clientSpeaker.synthesize_speech(
#         input=synthesis_input, voice=voice, audio_config=audio_config
#     )
#     with open("output.mp3", "wb") as out:
#         # Write the response to the output file.
#         out.write(response.audio_content)
#         print('Audio content written to file "output.mp3"')

# # Audio recording parameters
# RATE = 41000
# CHUNK = int(RATE / 10)  # 100ms

# # #Testing for backend streaming
# # def microphone_stream():
# #     """Generator that yields raw audio chunks from the microphone."""
# #     p = pyaudio.PyAudio()
# #     stream = p.open(
# #         format=pyaudio.paInt16,
# #         channels=1,
# #         rate=RATE,
# #         input=True,
# #         frames_per_buffer=CHUNK
# #     )
# #     print("🎤 Listening... (Ctrl+C to stop)\n")
# #     try:
# #         while True:
# #             data = stream.read(CHUNK, exception_on_overflow=False)
# #             yield data
# #     except KeyboardInterrupt:
# #         print("\n🛑 Stopped listening.")
# #     finally:
# #         stream.stop_stream()
# #         stream.close()
# #         p.terminate()

# # #streaming
# # def stt_live_pyaudio():
# #     """Stream microphone audio to Google Cloud Speech-to-Text API."""
# #     config = speech.RecognitionConfig(
# #         encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
# #         sample_rate_hertz=RATE,
# #         language_code="en-US"
# #     )
# #     streaming_config = speech.StreamingRecognitionConfig(
# #         config=config,
# #         interim_results=True
# #     )

# #     # Convert the raw audio chunks into request objects
# #     requests = (
# #         speech.StreamingRecognizeRequest(audio_content=chunk)
# #         for chunk in microphone_stream()
# #     )

# #     responses = client.streaming_recognize(
# #         config=streaming_config,
# #         requests=requests
# #     )

# #     # Handle streaming responses in real time
# #     try:
# #         for response in responses:
# #             for result in response.results:
# #                 if result.is_final:
# #                     print("Final:", result.alternatives[0].transcript)
# #                 else:
# #                     print("Interim:", result.alternatives[0].transcript, end="\r")
# #     except KeyboardInterrupt:
# #         print("\n🛑 Exiting...")

# # stt_live_pyaudio()

# # RATE = 41000

# # client = speech.SpeechClient()

# # def stt_stream(audio_chunks, rate=RATE):
# #     """Streams audio chunks to Google Cloud Speech-to-Text API."""
# #     config = speech.RecognitionConfig(
# #         encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
# #         sample_rate_hertz=rate,
# #         language_code="en-US"
# #     )

# #     streaming_config = speech.StreamingRecognitionConfig(
# #         config=config,
# #         interim_results=True,
# #         single_utterance=True
# #     )

# #     # Convert generator of raw bytes → request objects
# #     requests = (
# #         speech.StreamingRecognizeRequest(audio_content=chunk)
# #         for chunk in audio_chunks
# #     )

# #     responses = client.streaming_recognize(
# #         config=streaming_config,
# #         requests=requests
# #     )

# #     transcript = ""
# #     for response in responses:
# #         for result in response.results:
# #             if result.is_final:
# #                 transcript += result.alternatives[0].transcript + " "
# #                 print("Final:", result.alternatives[0].transcript)
# #             else:
# #                 print("Interim:", result.alternatives[0].transcript, end="\r")

# #     print(transcript.strip())
# #     return transcript.strip()

# import os
# from gtts import gTTS
# from google.oauth2 import service_account
# from google.cloud import speech
# from google.cloud import texttospeech
# import pyaudio

# # Load credentials from sttKey.json
# current_dir = os.path.dirname(os.path.abspath(__file__))
# key_path = os.path.join(current_dir, '..', 'sttKey.json')
# credentials = service_account.Credentials.from_service_account_file(key_path)

# # Initialize Google Cloud Speech client with credentials
# client = speech.SpeechClient(credentials=credentials)

# # Initialize Text-to-Speech client with credentials
# clientSpeaker = texttospeech.TextToSpeechClient(credentials=credentials)
# voice = texttospeech.VoiceSelectionParams(
#     language_code="en-US", name="Archenar"
# )
# audio_config = texttospeech.AudioConfig(
#     audio_encoding=texttospeech.AudioEncoding.MP3
# )

# # Audio recording parameters
# RATE = 16000
# CHUNK = int(RATE / 10)  # 100ms

# def stt(audio_bytes):
#     """
#     Standard speech-to-text for complete audio.
    
#     Args:
#         audio_bytes: Raw PCM audio bytes (16-bit, 16kHz, mono)
    
#     Returns:
#         str: Transcribed text
#     """
#     audio = speech.RecognitionAudio(content=audio_bytes)
#     config = speech.RecognitionConfig(
#         encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
#         sample_rate_hertz=RATE,
#         language_code="en-US",
#         enable_automatic_punctuation=True
#     )
    
#     response = client.recognize(config=config, audio=audio)
    
#     transcript = ""
#     for result in response.results:
#         transcript += result.alternatives[0].transcript + " "
    
#     return transcript.strip()

# def stt_stream(audio_chunks, rate=RATE):
#     """
#     Streams audio chunks to Google Cloud Speech-to-Text API.
#     Used for HTTP-based streaming where chunks are sent sequentially.
    
#     Args:
#         audio_chunks: List of raw PCM audio byte chunks
#         rate: Sample rate in Hz (default: 16000)
    
#     Returns:
#         str: Complete transcribed text
#     """
#     config = speech.RecognitionConfig(
#         encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
#         sample_rate_hertz=rate,
#         language_code="en-US",
#         enable_automatic_punctuation=True
#     )

#     streaming_config = speech.StreamingRecognitionConfig(
#         config=config,
#         interim_results=True,
#         single_utterance=True
#     )

#     # Convert list of raw bytes → request objects
#     requests = (
#         speech.StreamingRecognizeRequest(audio_content=chunk)
#         for chunk in audio_chunks
#     )

#     try:
#         responses = client.streaming_recognize(
#             config=streaming_config,
#             requests=requests
#         )

#         transcript = ""
#         for response in responses:
#             for result in response.results:
#                 if result.is_final:
#                     transcript += result.alternatives[0].transcript + " "
#                     print("Final:", result.alternatives[0].transcript)
#                 else:
#                     print("Interim:", result.alternatives[0].transcript, end="\r")

#         final_transcript = transcript.strip()
#         print(f"\nComplete transcript: {final_transcript}")
#         return final_transcript
#     except Exception as e:
#         print(f"STT Stream Error: {str(e)}")
#         return ""

# def stt_stream_realtime(audio_chunks, rate=RATE):
#     """
#     Real-time streaming STT for WebSocket chunks.
#     Handles chunks received over network in real-time.
    
#     Args:
#         audio_chunks: List of raw PCM audio byte chunks received via WebSocket
#         rate: Sample rate in Hz (default: 16000)
    
#     Returns:
#         str: Complete transcribed text
#     """
#     config = speech.RecognitionConfig(
#         encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
#         sample_rate_hertz=rate,
#         language_code="en-US",
#         enable_automatic_punctuation=True,
#         model="latest_long"  # Better for longer utterances
#     )

#     streaming_config = speech.StreamingRecognitionConfig(
#         config=config,
#         interim_results=False,  # Only final results for WebSocket
#         single_utterance=False  # Allow multiple utterances
#     )

#     # Create request generator
#     def request_generator():
#         for chunk in audio_chunks:
#             if chunk and len(chunk) > 0:  # Skip empty chunks
#                 yield speech.StreamingRecognizeRequest(audio_content=chunk)

#     try:
#         responses = client.streaming_recognize(
#             config=streaming_config,
#             requests=request_generator()
#         )

#         transcript = ""
#         for response in responses:
#             for result in response.results:
#                 if result.is_final:
#                     transcript += result.alternatives[0].transcript + " "
#                     print(f"Final transcript segment: {result.alternatives[0].transcript}")

#         final_transcript = transcript.strip()
#         print(f"Complete WebSocket transcript: {final_transcript}")
#         return final_transcript
#     except Exception as e:
#         print(f"STT Realtime Error: {str(e)}")
#         # Try fallback: combine all chunks and use standard STT
#         try:
#             print("Attempting fallback to standard STT...")
#             combined_audio = b''.join(audio_chunks)
#             return stt(combined_audio)
#         except Exception as fallback_error:
#             print(f"Fallback STT Error: {str(fallback_error)}")
#             return ""

# def speak(words):
#     """
#     Generate speech using gTTS and save to file.
    
#     Args:
#         words: Text to convert to speech
#     """
#     tts = gTTS(words)
#     tts.save("recipe.mp3")

# def speaks(text):
#     """
#     Generate speech using Google Cloud Text-to-Speech with Archenar voice.
    
#     Args:
#         text: Text to convert to speech
#     """
#     synthesis_input = texttospeech.SynthesisInput(text=text)
#     response = clientSpeaker.synthesize_speech(
#         input=synthesis_input, voice=voice, audio_config=audio_config
#     )
#     with open("output.mp3", "wb") as out:
#         out.write(response.audio_content)
#         print('Audio content written to file "output.mp3"')

import os
from gtts import gTTS
from google.oauth2 import service_account
from google.cloud import speech
from google.cloud import texttospeech
import time

# Load credentials from sttKey.json
current_dir = os.path.dirname(os.path.abspath(__file__))
key_path = os.path.join(current_dir, '..', 'sttKey.json')
credentials = service_account.Credentials.from_service_account_file(key_path)

# Initialize Google Cloud Speech client with credentials
client = speech.SpeechClient(credentials=credentials)

# Audio recording parameters
RATE = 16000
CHUNK = int(RATE / 10)  # 100ms

def stt(audio_bytes):
    """
    Standard speech-to-text for complete audio.
    
    Args:
        audio_bytes: Raw PCM audio bytes (16-bit, 16kHz, mono)
    
    Returns:
        str: Transcribed text
    """
    print(f"[STT] Starting standard STT with {len(audio_bytes)} bytes")
    
    audio = speech.RecognitionAudio(content=audio_bytes)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=RATE,
        language_code="en-US",
        enable_automatic_punctuation=True
    )
    
    try:
        response = client.recognize(config=config, audio=audio)
        
        transcript = ""
        for result in response.results:
            transcript += result.alternatives[0].transcript + " "
        
        final_transcript = transcript.strip()
        # print(f"[STT] Standard STT result: '{final_transcript}'")
        return final_transcript
        
    except Exception as e:
        print(f"[STT] Standard STT Error: {type(e).__name__}: {str(e)}")
        return ""

def stt_stream(audio_chunks, rate=RATE):
    """
    Streams audio chunks to Google Cloud Speech-to-Text API.
    Used for HTTP-based streaming where chunks are sent sequentially.
    
    Args:
        audio_chunks: List of raw PCM audio byte chunks
        rate: Sample rate in Hz (default: 16000)
    
    Returns:
        str: Complete transcribed text
    """
    print("Received")
    print(f"[STT_STREAM] Starting with {len(audio_chunks)} chunks")
    total_bytes = sum(len(chunk) for chunk in audio_chunks)
    print(f"[STT_STREAM] Total audio: {total_bytes} bytes ({total_bytes/32000:.2f} seconds)")
    
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=rate,
        language_code="en-US",
        enable_automatic_punctuation=True
    )

    streaming_config = speech.StreamingRecognitionConfig(
        config=config,
        interim_results=True,
        single_utterance=True
    )

    # Convert list of raw bytes → request objects
    requests = (
        speech.StreamingRecognizeRequest(audio_content=chunk)
        for chunk in audio_chunks
    )

    try:
        print("[STT_STREAM] Sending to Google Speech API...")
        responses = client.streaming_recognize(
            config=streaming_config,
            requests=requests
        )

        transcript = ""
        for response in responses:
            for result in response.results:
                if result.is_final:
                    transcript += result.alternatives[0].transcript + " "
                    print(f"[STT_STREAM] Final: {result.alternatives[0].transcript}")
                else:
                    print(f"[STT_STREAM] Interim: {result.alternatives[0].transcript}", end="\r")

        final_transcript = transcript.strip()
        print(f"\n[STT_STREAM] ✓ Complete transcript: '{final_transcript}'")
        return final_transcript
        
    except Exception as e:
        print(f"[STT_STREAM] ✗ Error: {type(e).__name__}: {str(e)}")
        return ""

def stt_stream_realtime(audio_chunks, rate=RATE):
    print("Received")
    """
    Real-time streaming STT for WebSocket chunks.
    Handles chunks received over network in real-time.
    
    Args:
        audio_chunks: List of raw PCM audio byte chunks received via WebSocket
        rate: Sample rate in Hz (default: 16000)
    
    Returns:
        str: Complete transcribed text
    """
    print(f"\n{'='*60}")
    print(f"[STT_REALTIME] Starting with {len(audio_chunks)} chunks")
    
    # Log chunk sizes
    if audio_chunks:
        total_bytes = sum(len(chunk) for chunk in audio_chunks)
        avg_chunk_size = total_bytes / len(audio_chunks)
        print(f"[STT_REALTIME] Total audio: {total_bytes} bytes ({total_bytes/32000:.2f} seconds)")
        print(f"[STT_REALTIME] Average chunk size: {avg_chunk_size:.0f} bytes")
        print(f"[STT_REALTIME] First chunk size: {len(audio_chunks[0])} bytes")
        print(f"[STT_REALTIME] Last chunk size: {len(audio_chunks[-1])} bytes")
    else:
        print(f"[STT_REALTIME] ✗ No audio chunks provided")
        return ""
    
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=rate,
        language_code="en-US",
        enable_automatic_punctuation=True,
        model="latest_long"  # Better for longer utterances
    )

    streaming_config = speech.StreamingRecognitionConfig(
        config=config,
        interim_results=False,  # Only final results for WebSocket
        single_utterance=False  # Allow multiple utterances
    )

    # Create request generator
    def request_generator():
        chunk_count = 0
        for i, chunk in enumerate(audio_chunks):
            if chunk and len(chunk) > 0:  # Skip empty chunks
                chunk_count += 1
                if i % 20 == 0:  # Log every 20th chunk
                    print(f"[STT_REALTIME] Sending chunk {i+1}/{len(audio_chunks)}, size: {len(chunk)} bytes")
                yield speech.StreamingRecognizeRequest(audio_content=chunk)
        print(f"[STT_REALTIME] Sent {chunk_count} non-empty chunks")

    try:
        print("[STT_REALTIME] Calling Google Speech API...")
        responses = client.streaming_recognize(
            config=streaming_config,
            requests=request_generator()
        )

        transcript = ""
        result_count = 0
        
        print("[STT_REALTIME] Processing responses...")
        for response in responses:
            for result in response.results:
                result_count += 1
                if result.is_final:
                    segment = result.alternatives[0].transcript
                    transcript += segment + " "
                    print(f"[STT_REALTIME] Final segment {result_count}: '{segment}'")

        final_transcript = transcript.strip()
        
        if final_transcript:
            print(f"[STT_REALTIME] ✓ Complete transcript ({result_count} segments): '{final_transcript}'")
        else:
            print(f"[STT_REALTIME] ⚠ Empty transcript (received {result_count} results)")
        
        print(f"{'='*60}\n")
        return final_transcript
        
    except Exception as e:
        print(f"[STT_REALTIME] ✗ Error: {type(e).__name__}: {str(e)}")
        
        # Try fallback: combine all chunks and use standard STT
        try:
            print("[STT_REALTIME] Attempting fallback to standard STT...")
            combined_audio = b''.join(audio_chunks)
            print(f"[STT_REALTIME] Fallback: combined {len(combined_audio)} bytes")
            
            result = stt(combined_audio)
            
            if result:
                print(f"[STT_REALTIME] ✓ Fallback successful: '{result}'")
            else:
                print(f"[STT_REALTIME] ⚠ Fallback returned empty result")
            
            print(f"{'='*60}\n")
            return result
            
        except Exception as fallback_error:
            print(f"[STT_REALTIME] ✗ Fallback failed: {type(fallback_error).__name__}: {str(fallback_error)}")
            print(f"{'='*60}\n")
            return ""


##################### TTS ############################

clientSpeaker = texttospeech.TextToSpeechClient(credentials=credentials)
voice = texttospeech.VoiceSelectionParams(
    language_code="en-US", name="Fenrir", model_name = "gemini-2.5-flash-tts"
)
audio_config = texttospeech.AudioConfig(
    audio_encoding=texttospeech.AudioEncoding.MP3
)

def speak(words):
    """
    Generate speech using gTTS and save to file.
    
    Args:
        words: Text to convert to speech
    """
    print(f"[TTS] Generating speech with gTTS: '{words[:50]}...'")
    try:
        tts = gTTS(words)
        tts.save("recipe.mp3")
        print("[TTS] ✓ Audio saved to recipe.mp3")
    except Exception as e:
        print(f"[TTS] ✗ Error: {type(e).__name__}: {str(e)}")

def speaks(text):
    """
    Generate speech using Google Cloud Text-to-Speech with Archenar voice.
    
    Args:
        text: Text to convert to speech
    """
    # print(f"[TTS_CLOUD] Generating speech with Google Cloud TTS: '{text[:50]}...'")
    try:
        start_time = time.perf_counter()
        synthesis_input = texttospeech.SynthesisInput(text=text)
        response = clientSpeaker.synthesize_speech(
            input=synthesis_input, voice=voice, audio_config=audio_config
        )
        end_time = time.perf_counter()
        print(f"Time by TTS: {end_time - start_time:.6f}s")
        return response.audio_content
        # with open("output.mp3", "wb") as out:
            # out.write(response.audio_content)
            #return response.audio_content
            # print('[TTS_CLOUD] ✓ Audio content written to file "output.mp3"')
    except Exception as e:
        print(f"[TTS_CLOUD] ✗ Error: {type(e).__name__}: {str(e)}")

    
