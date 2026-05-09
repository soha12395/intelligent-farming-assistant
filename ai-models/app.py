from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route('/')
def health():
    return jsonify({'message': 'ML Service is running'})

@app.route('/predict/disease', methods=['POST'])
def disease_detection():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400

        image = request.files['image']

        from disease_detection.predict import predict_disease
        result = predict_disease(image)
        return jsonify(result)

    except Exception as e:
        import traceback
        print("FULL ERROR:", traceback.format_exc())
        return jsonify({'error': str(e)}), 500

@app.route('/predict/crop', methods=['POST'])
def crop_recommendation():
    try:
        data = request.get_json()
        soil_type = data.get('soil_type')
        region = data.get('region')
        season = data.get('season')
        water_availability = data.get('water_availability')

        from crop_recommendation.recommend import recommend_crops
        result = recommend_crops(soil_type, region, season, water_availability)
        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port)