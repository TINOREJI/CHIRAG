import os
from flask import Blueprint, render_template, request, jsonify
from tensorflow.keras.models import load_model
import tensorflow as tf
import numpy as np

main = Blueprint('main', __name__)

# Load the model when the app starts
model = load_model(os.path.join(os.path.dirname(__file__), 'model', 'model.h5'))

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/search', methods=['POST'])
def search():


    #SOund input 
     
    search_query = request.form['query']
    
    # Preprocess the input text for the model
    input_data = preprocess_input(search_query)

    # Get the model's prediction
    prediction = model.predict(input_data)

    # Process the prediction to get a response
    response = postprocess_output(prediction)

    # SOund output

    return jsonify({"message": response})

def preprocess_input(text):
    # Implement your preprocessing steps here
    # This might include tokenization, padding, etc.
    # Here is a simple example assuming you have a tokenizer
    # and a max_length defined for your model
    from tensorflow.keras.preprocessing.text import Tokenizer
    from tensorflow.keras.preprocessing.sequence import pad_sequences

    tokenizer = Tokenizer(num_words=10000)  # Ensure tokenizer fits your model's training
    sequences = tokenizer.texts_to_sequences([text])
    input_data = pad_sequences(sequences, maxlen=100)  # Ensure maxlen fits your model's training
    return input_data

def postprocess_output(prediction):
    # Implement your postprocessing steps here
    # This depends on what your model's output represents
    # For example, if it's a classification model
    response = np.argmax(prediction)
    return str(response)  # Convert the response to a string or appropriate format
