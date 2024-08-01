from transformers import TFBartForConditionalGeneration, BartTokenizer

from flask import Blueprint, render_template, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os
from transformers import BartTokenizer, BartForConditionalGeneration

main = Blueprint('main', __name__)

# Ensure 'temp' directory exists
if not os.path.exists('temp'):
    os.makedirs('temp')

def translate_to_eng(text):
    # Implement actual translation logic here
    return text

def translate_to_native(text):
    # Implement actual translation logic here
    # return {"text": "Translated Native Text", "audio_url": "http://example.com/audio/native.wav"}
    return text

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/process_input', methods=['POST'])
def process_input():
    try:
        data = request.json
        text = data.get('text')
        audio_file = request.files.get('audio')

        if text:
            response = model_results(text)
            # response = text 
            return jsonify({
                "response": response,
            })

        if audio_file:
            audio_path = os.path.join('temp', secure_filename(audio_file.filename))
            audio_file.save(audio_path)
            translated_text = translate_to_eng(audio_path)
            response = process_text(translated_text)
            native_response = translate_to_native(response)
            return jsonify({
                "response": response,
                "native_response": native_response
            })
    except Exception as e:
        current_app.logger.error(f"Error processing input: {e}")
        return jsonify({"error": "Internal Server Error"}), 500


# def model_results(x):
#     # Load the fine-tuned model and tokenizer
#     model = TFBartForConditionalGeneration.from_pretrained('app/model/kid-bart')
#     tokenizer = BartTokenizer.from_pretrained('app/model/kid-bart')

#     def preprocess_question(question, tokenizer, max_length=512):
#         inputs = tokenizer(
#             question,
#             max_length=max_length,
#             truncation=True,
#             padding='max_length',
#             return_tensors='tf'  # Use 'tf' for TensorFlow
#         )
#         return inputs

#     def generate_answer(inputs, model):
#         outputs = model.generate(
#             input_ids=inputs['input_ids'],
#             attention_mask=inputs['attention_mask'],
#             max_length=150,
#             num_beams=5,
#             early_stopping=True,
#             no_repeat_ngram_size=2,
#             temperature=1.0,
#             top_k=50,
#             top_p=0.95
#         )
#         return outputs

#     def decode_answer(outputs, tokenizer):
#         answer = tokenizer.decode(outputs[0], skip_special_tokens=True)
#         return answer

#     inputs = preprocess_question(x, tokenizer)
#     outputs = generate_answer(inputs, model)
#     answer = decode_answer(outputs, tokenizer)
#     return answer


# def model_results(x):
#     # Load the fine-tuned model and tokenizer
#     model = TFBartForConditionalGeneration.from_pretrained('app/model/kid-bart')
#     tokenizer = BartTokenizer.from_pretrained('app/model/kid-bart')

#     def preprocess_question(question, tokenizer, max_length=128):
#         inputs = tokenizer(
#             question,
#             max_length=max_length,
#             truncation=True,
#             padding='max_length',
#             return_tensors='tf'  # Use 'tf' for TensorFlow
#         )
#         return inputs

#     def generate_answer(inputs, model):
#         outputs = model.generate(
#             input_ids=inputs['input_ids'],
#             attention_mask=inputs['attention_mask'],
#             max_length=150,
#             num_beams=5,
#             early_stopping=True,
#             no_repeat_ngram_size=2,
#             temperature=1.0,
#             top_k=50,
#             top_p=0.95
#         )
#         return outputs

#     def decode_answer(outputs, tokenizer):
#         answer = tokenizer.decode(outputs[0], skip_special_tokens=True)
#         return answer

#     inputs = preprocess_question(x, tokenizer)
#     outputs = generate_answer(inputs, model)
#     answer = decode_answer(outputs, tokenizer)
    
#     # Clear TensorFlow session to free up memory
#     tf.keras.backend.clear_session()
    
#     return answer


def model_results(x):
    # Load the same fine-tuned model and tokenizer
    model = TFBartForConditionalGeneration.from_pretrained('app/model/kid-bart')
    tokenizer = BartTokenizer.from_pretrained('app/model/kid-bart')

    def preprocess_question(question, tokenizer, max_length=50):
        inputs = tokenizer(
            question,
            max_length=max_length,  # Reduced max length for inputs
            truncation=True,
            padding='max_length',
            return_tensors='tf'
        )
        return inputs

    def generate_answer(inputs, model):
        outputs = model.generate(
            input_ids=inputs['input_ids'],
            attention_mask=inputs['attention_mask'],
            max_length=50,  # Reduced max length for outputs
            num_beams=2,    # Fewer beams for less computation
            early_stopping=True
        )
        return outputs

    def decode_answer(outputs, tokenizer):
        answer = tokenizer.decode(outputs[0], skip_special_tokens=True)
        return answer

    # Process the input and generate the answer
    inputs = preprocess_question(x, tokenizer)
    outputs = generate_answer(inputs, model)
    answer = decode_answer(outputs, tokenizer)

    # Clear TensorFlow session to free up memory
    # tf.keras.backend.clear_session()

    return answer



# def model_results(x):
#     # Load the fine-tuned model and tokenizer
#     model = BartForConditionalGeneration.from_pretrained('app/model/kid-bart')
#     tokenizer = BartTokenizer.from_pretrained('app/model/kid-bart')

#     def preprocess_question(question, tokenizer, max_length=512):
#         inputs = tokenizer(
#             question,
#             max_length=max_length,
#             truncation=True,
#             padding='max_length',
#             return_tensors='pt'
#         )
#         return inputs

#     def generate_answer(inputs, model):
#         outputs = model.generate(
#             input_ids=inputs['input_ids'],
#             attention_mask=inputs['attention_mask'],
#             max_length=150,
#             num_beams=5,
#             early_stopping=True,
#             no_repeat_ngram_size=2,
#             temperature=1.0,
#             top_k=50,
#             top_p=0.95
#         )
#         return outputs

#     def decode_answer(outputs, tokenizer):
#         answer = tokenizer.decode(outputs[0], skip_special_tokens=True)
#         return answer

#     inputs = preprocess_question(x, tokenizer)
#     outputs = generate_answer(inputs, model)
#     answer = decode_answer(outputs, tokenizer)
#     return answer

# def process_text(text):
    # input_data = text
    # ans = model_results(input_data)
    # return ans

