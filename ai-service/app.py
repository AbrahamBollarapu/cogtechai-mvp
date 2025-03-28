import os
import openai
import traceback
from flask import Flask, request, jsonify
import os

app = Flask(__name__)

@app.route('/ai/generate', methods=['POST'])
def generate():
    data = request.get_json()
    prompt = data.get("prompt", "")

    # ✅ Mock response
    mock_response = f"🧠 MOCK AI RESPONSE: Here are interview questions for '{prompt}'"

    return jsonify({ "response": mock_response })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)