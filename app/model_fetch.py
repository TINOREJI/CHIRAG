def model_results(question):
    from transformers import BartTokenizer, BartForConditionalGeneration

    # Load the fine-tuned model and tokenizer
    model = BartForConditionalGeneration.from_pretrained('app\model\kid-bart')
    tokenizer = BartTokenizer.from_pretrained('app\model\kid-bart')


    def preprocess_question(question, tokenizer, max_length=512):
        inputs = tokenizer(
            question,
            max_length=max_length,
            truncation=True,
            padding='max_length',
            return_tensors='pt'
        )
        return inputs

    def generate_answer(inputs, model):
        outputs = model.generate(
            input_ids=inputs['input_ids'],
            attention_mask=inputs['attention_mask'],
            max_length=150,
            num_beams=5,
            early_stopping=True,
            no_repeat_ngram_size=2,
            temperature=1.0,
            top_k=50,
            top_p=0.95
        )
        return outputs

    def decode_answer(outputs, tokenizer):
        answer = tokenizer.decode(outputs[0], skip_special_tokens=True)
        return answer

    # Example question
    # question = "What is stock market?"

    # Process the question
    inputs = preprocess_question(question, tokenizer)

    # Generate the answer
    outputs = generate_answer(inputs, model)

    # Decode and print the answer
    answer = decode_answer(outputs, tokenizer)
    return answer
