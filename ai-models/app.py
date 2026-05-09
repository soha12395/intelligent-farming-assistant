from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import traceback

app = Flask(__name__)
CORS(app)

# Try to import predict_disease at startup to catch errors early
try:
    from disease_detection.predict import predict_disease
    print("✅ predict_disease imported successfully")
except Exception as e:
    print("❌ IMPORT ERROR:", traceback.format_exc())
    predict_disease = None

@app.route('/')
def health():
    return jsonify({'message': 'ML Service is running', 'model_loaded': predict_disease is not None})

@app.route('/predict/disease', methods=['POST'])
def disease_detection():
    try:
        if predict_disease is None:
            return jsonify({'error': 'Model failed to load at startup'}), 500

        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400

        image = request.files['image']
        result = predict_disease(image)
        return jsonify(result)

    except Exception as e:
        print("FULL ERROR:", traceback.format_exc())
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port)