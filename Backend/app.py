from flask import Flask, request, render_template, redirect, url_for

app = Flask(__name__)

@app.route("/")
def home():
  return "Hello World Flask"

if __name__ == "__main__":
  app.run()