
from flask import Flask, jsonify
from flask_cors import CORS # Import the CORS extension
from utils.supabase import supabase



app = Flask(__name__)

CORS(app) 




@app.route("/")
def home():
  response = supabase.table('users').select('*').execute()
  return jsonify(response.data)


from routes.recipe import recipe_bp
from routes.user import user_bp

app.register_blueprint(recipe_bp)
app.register_blueprint(user_bp)


if __name__ == "__main__":
  app.run(host='0.0.0.0', port=5000, debug=True)








