import os
import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

MOCK_MODE = os.getenv("MOCK_MODE", "True").lower() == "true"
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY)

def generate_ai_response(prompt):
    if MOCK_MODE or not OPENAI_API_KEY:
        return f"🧠 MOCK AI RESPONSE: Here are interview questions for '{prompt}'"

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=500
    )
    return response.choices[0].message.content.strip()

@app.route("/ai/generate", methods=["POST"])
def generate():
    try:
        data = request.get_json()
        prompt = data.get("prompt", "")
        reply = generate_ai_response(prompt)
        return jsonify({"response": reply})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Something went wrong"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)



