from flask import Flask, request, jsonify
from transformers import BertTokenizer, BertForSequenceClassification
import torch
import numpy as np

app = Flask(__name__)

# Load pre-trained BERT model and tokenizer
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertForSequenceClassification.from_pretrained('bert-base-uncased')

@app.route('/analyze', methods=['POST'])
def analyze_text():
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({'error': 'Missing text field'}), 400
            
        text = str(data['text']).strip()
        if not text:
            return jsonify({'error': 'Text cannot be empty'}), 400
        
        # Tokenize with improved settings
        inputs = tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            padding=True,
            max_length=512,
            add_special_tokens=True
        )
        
        # Get model prediction with confidence scores
        with torch.no_grad():
            outputs = model(**inputs)
            probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
            confidence, pred_class = torch.max(probs, dim=-1)
            
        # Format response with more detailed output
        return jsonify({
            'text': text,
            'prediction': 'Positive' if pred_class.item() == 1 else 'Negative',
            'confidence': round(confidence.item() * 100, 2),
            'class_probabilities': {
                'negative': round(probs[0][0].item() * 100, 2),
                'positive': round(probs[0][1].item() * 100, 2)
            },
        })
        
    except Exception as e:
        return jsonify({
            'error': 'Prediction failed',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    app.run(port=8000)
