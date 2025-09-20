import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template, redirect, url_for
from supabase import create_client, Client

app = Flask(__name__)

load_dotenv()
supa_url: str = os.environ.get("SUPABASE_URL")
supa_key: str = os.environ.get("SUPABASE_KEY")

supabase: Client = create_client(supabase_url=supa_url, supabase_key=supa_key)

@app.route("/")
def home():
  response = supabase.table('users').select('*').execute()
  return jsonify(response.data)

if __name__ == "__main__":
  app.run(host='0.0.0.0', port=5000, debug=True)