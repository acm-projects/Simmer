
from flask import Flask, jsonify
from flask_cors import CORS # Import the CORS extension
from utils.supabase import supabase
import os


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


if __name__ == "__main__":
  app.run(host='0.0.0.0', port=5000, debug=True)








