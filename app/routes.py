from flask import Blueprint, render_template, request, jsonify
from werkzeug.utils import secure_filename
import os
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

main = Blueprint('main', __name__)

# Load the model when the app starts
model = load_model(os.path.join(os.path.dirname(__file__), 'model', 'model.h5'))

def translate_to_eng(text):
    # Implement actual translation logic here
    return "Translated English Text"

def translate_to_native(text):
    # Implement actual translation logic here
    return {"text": "Translated Native Text", "audio_url": "http://example.com/audio/native.wav"}


@main.route('/')
def index():
    return render_template('index.html')

# INPUT AS VOICE/TEXT in any language :


@main.route('/process_input', methods=['POST'])
def process_input():
    data = request.json
    text = data.get('text')
    audio_file = data.get('audio')

    if text:
        # Process text input
        translated_text = translate_to_eng(text)
        response = process_text(translated_text)
        
        native_response = translate_to_native(response)
        return jsonify({
            "translated_text": translated_text,
            "response": response,
            "native_response": native_response['text'],
            "audio_url": native_response['audio_url']
        })
    
    if audio_file:
        # Process audio input
        audio_path = os.path.join('temp', secure_filename(audio_file.filename))
        audio_file.save(audio_path)
        translated_text = translate_to_eng(audio_path)
        response = process_text(translated_text)
        
        native_response = translate_to_native(response)
        return jsonify({
            "translated_text": translated_text,
            "response": response,
            "native_response": native_response['text'],
            "audio_url": native_response['audio_url']
        })

# HERE We have the Translated text into english, which is being fed to the LLM MODEL:

def process_text(text):
    # Preprocess the input text for the model
    input_data = preprocess_input(text)

    # Get the model's prediction
    prediction = model.predict(input_data)

    # Process the prediction to get a response
    response = postprocess_output(prediction)
    return response

def preprocess_input(text):
    # Implement your preprocessing steps here
    tokenizer = Tokenizer(num_words=10000)  # Ensure tokenizer fits your model's training
    sequences = tokenizer.texts_to_sequences([text])
    input_data = pad_sequences(sequences, maxlen=100)  # Ensure maxlen fits your model's training
    return input_data

def postprocess_output(prediction):
    # Implement your postprocessing steps here
    response = np.argmax(prediction)
    return str(response)  # Convert the response to a string or appropriate format

