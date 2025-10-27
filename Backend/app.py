
from flask import Flask, jsonify
from flask_cors import CORS # Import the CORS extension
from utils.supabase import supabase
import os
import pyaudio
from pydub import AudioSegment

app = Flask(__name__)
UPLOAD_FOLDER = os.path.join(app.root_path, '..', 'uploads')

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)



app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

CORS(app) 


@app.route("/")
def home():
  response = supabase.table('users').select('*').execute()
  return jsonify(response.data)


from routes.recipe import recipe_bp
from routes.user import user_bp
from routes.chat import chat_bp

app.register_blueprint(recipe_bp)
app.register_blueprint(user_bp)
app.register_blueprint(chat_bp)




#############################
# FORMAT = pyaudio.paInt16  
# CHANNELS = 1     
# RATE = 16000          
# CHUNK = 1024          
# RECORD_SECONDS = 5      
# DEVICE_INDEX = 1          
# WAVE_OUTPUT_FILENAME = "output.wav"
# audio = pyaudio.PyAudio()


# stream = audio.open(format=FORMAT,
#                     channels=CHANNELS,
#                     rate=RATE,
#                     input=True,
#                     input_device_index=DEVICE_INDEX,
#                     frames_per_buffer=CHUNK)

# print("Recording...")

# frames = []


# for _ in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
#     data = stream.read(CHUNK)
#     audio_segment = AudioSegment(
#             data,
#             sample_width=audio.get_sample_size(FORMAT),
#             frame_rate=RATE,
#             channels=CHANNELS
#     )
#     amplitude = audio_segment.dBFS
#     if amplitude == float('-inf'):
#        continue
#     bar_length = int((60 + amplitude) / 2) 
#     bar = "#" * bar_length
    

#     print(f"Amplitude: {amplitude:.2f} dBFS | {bar}")

# print("Finished recording.")

# stream.stop_stream()
# stream.close()

# audio.terminate()

if __name__ == "__main__":
  app.run(host='0.0.0.0', port=5000, debug=True)


