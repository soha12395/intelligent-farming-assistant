from PIL import Image
import torch
from transformers import AutoModelForImageClassification
from torchvision import transforms
import io

label_map = {
    # Tomato
    'Tomato with Target Spot': 'Tomato___Target_Spot',
    'Tomato with Tomato Yellow Leaf Curl Virus': 'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    'Tomato with Tomato Mosaic Virus': 'Tomato___Tomato_mosaic_virus',
    'Tomato with Bacterial Spot': 'Tomato___Bacterial_spot',
    'Tomato with Early Blight': 'Tomato___Early_blight',
    'Tomato with Late Blight': 'Tomato___Late_blight',
    'Tomato with Leaf Mold': 'Tomato___Leaf_Mold',
    'Tomato with Septoria Leaf Spot': 'Tomato___Septoria_leaf_spot',
    'Tomato with Spider Mites': 'Tomato___Spider_mites',
    'Tomato healthy': 'Tomato___healthy',
    'Tomato___Bacterial_spot': 'Tomato___Bacterial_spot',
    'Tomato___Early_blight': 'Tomato___Early_blight',
    'Tomato___Late_blight': 'Tomato___Late_blight',
    'Tomato___Leaf_Mold': 'Tomato___Leaf_Mold',
    'Tomato___Septoria_leaf_spot': 'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites': 'Tomato___Spider_mites',
    'Tomato___Target_Spot': 'Tomato___Target_Spot',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus': 'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    'Tomato___Tomato_mosaic_virus': 'Tomato___Tomato_mosaic_virus',
    'Tomato___healthy': 'Tomato___healthy',
    # Potato
    'Potato with Early Blight': 'Potato___Early_blight',
    'Potato with Late Blight': 'Potato___Late_blight',
    'Potato healthy': 'Potato___healthy',
    'Potato___Early_blight': 'Potato___Early_blight',
    'Potato___Late_blight': 'Potato___Late_blight',
    'Potato___healthy': 'Potato___healthy',
    # Pepper
    'Pepper, bell with Bacterial Spot': 'Pepper___Bacterial_spot',
    'Pepper, bell healthy': 'Pepper___healthy',
    'Pepper___Bacterial_spot': 'Pepper___Bacterial_spot',
    'Pepper___healthy': 'Pepper___healthy',
    'Healthy Bell Pepper Plant': 'Pepper___healthy',
    'Bell Pepper with Bacterial Spot': 'Pepper___Bacterial_spot',
    # Corn
    'Corn (Maize) with Cercospora Leaf Spot': 'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
    'Corn (Maize) with Common Rust': 'Corn_(maize)___Common_rust_',
    'Corn (Maize) with Northern Leaf Blight': 'Corn_(maize)___Northern_Leaf_Blight',
    'Corn (Maize) healthy': 'Corn_(maize)___healthy',
    'Corn___Common_rust': 'Corn_(maize)___Common_rust_',
    'Corn___Cercospora_leaf_spot': 'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
    'Corn___Northern_Leaf_Blight': 'Corn_(maize)___Northern_Leaf_Blight',
    'Corn___healthy': 'Corn_(maize)___healthy',
    # Grape
    'Grape with Black Rot': 'Grape___Black_rot',
    'Grape with Esca': 'Grape___Esca_(Black_Measles)',
    'Grape with Leaf Blight': 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    'Grape healthy': 'Grape___healthy',
    'Grape___Black_rot': 'Grape___Black_rot',
    'Grape___Esca_(Black_Measles)': 'Grape___Esca_(Black_Measles)',
    'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)': 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    'Grape___healthy': 'Grape___healthy',
    'Grape with Esca (Black Measles)': 'Grape___Esca_(Black_Measles)',
    'Grape with Leaf Blight (Isariopsis Leaf Spot)': 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    # Apple
    'Apple with Apple Scab': 'Apple___Apple_scab',
    'Apple with Black Rot': 'Apple___Black_rot',
    'Apple with Cedar Apple Rust': 'Apple___Cedar_apple_rust',
    'Apple healthy': 'Apple___healthy',
    'Apple___Apple_scab': 'Apple___Apple_scab',
    'Apple___Black_rot': 'Apple___Black_rot',
    'Apple___Cedar_apple_rust': 'Apple___Cedar_apple_rust',
    'Apple___healthy': 'Apple___healthy',
    # Cherry
    'Cherry with Powdery Mildew': 'Cherry_(including_sour)___Powdery_mildew',
    'Cherry (including sour) with Powdery Mildew': 'Cherry_(including_sour)___Powdery_mildew',
    'Cherry healthy': 'Cherry_(including_sour)___healthy',
    'Cherry_(including_sour)___Powdery_mildew': 'Cherry_(including_sour)___Powdery_mildew',
    'Cherry_(including_sour)___healthy': 'Cherry_(including_sour)___healthy',
    # Peach
    'Peach with Bacterial Spot': 'Peach___Bacterial_spot',
    'Peach healthy': 'Peach___healthy',
    'Peach___Bacterial_spot': 'Peach___Bacterial_spot',
    'Peach___healthy': 'Peach___healthy',
    # Strawberry
    'Strawberry with Leaf Scorch': 'Strawberry___Leaf_scorch',
    'Strawberry healthy': 'Strawberry___healthy',
    'Strawberry___Leaf_scorch': 'Strawberry___Leaf_scorch',
    'Strawberry___healthy': 'Strawberry___healthy',
    # Raspberry
    'Raspberry healthy': 'Raspberry___healthy',
    'Raspberry___healthy': 'Raspberry___healthy',
    'Healthy Potato Plant': 'Potato___healthy',
    'Healthy Tomato Plant': 'Tomato___healthy',
    'Healthy Corn Plant': 'Corn_(maize)___healthy',
    'Healthy Grape Plant': 'Grape___healthy',
    'Healthy Apple Plant': 'Apple___healthy',
    'Healthy Cherry Plant': 'Cherry_(including_sour)___healthy',
    'Healthy Peach Plant': 'Peach___healthy',
    'Healthy Strawberry Plant': 'Strawberry___healthy',
    'Healthy Raspberry Plant': 'Raspberry___healthy',
    'Healthy Pepper Plant': 'Pepper___healthy',
    'Healthy Apple': 'Apple___healthy',
    'Healthy Grape': 'Grape___healthy',
    'Healthy Cherry': 'Cherry_(including_sour)___healthy',
    'Healthy Peach': 'Peach___healthy',
    'Healthy Strawberry': 'Strawberry___healthy',
    'Healthy Raspberry': 'Raspberry___healthy',
    'Healthy Tomato': 'Tomato___healthy',
    'Healthy Potato': 'Potato___healthy',
    'Healthy Corn': 'Corn_(maize)___healthy',
    'Healthy Pepper': 'Pepper___healthy',
}

TREATMENTS = {
    'Tomato___Bacterial_spot': 'Apply copper-based bactericide. Remove infected leaves. Avoid overhead irrigation.',
    'Tomato___Early_blight': 'Apply chlorothalonil fungicide. Remove lower infected leaves. Rotate crops.',
    'Tomato___Late_blight': 'Apply mancozeb fungicide immediately. Remove infected plants. Ensure good drainage.',
    'Tomato___Leaf_Mold': 'Improve air circulation. Apply fungicide. Reduce humidity.',
    'Tomato___Septoria_leaf_spot': 'Apply fungicide. Remove infected leaves. Avoid wetting foliage.',
    'Tomato___Spider_mites': 'Apply miticide or neem oil. Increase humidity. Remove heavily infested leaves.',
    'Tomato___Target_Spot': 'Apply fungicide. Remove infected leaves. Improve air circulation.',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus': 'No cure. Remove infected plants. Control whitefly vectors.',
    'Tomato___Tomato_mosaic_virus': 'No cure. Remove infected plants. Disinfect tools. Control aphids.',
    'Tomato___healthy': 'Plant is healthy! Keep monitoring regularly.',
    'Potato___Early_blight': 'Apply chlorothalonil fungicide. Remove infected leaves. Ensure proper nutrition.',
    'Potato___Late_blight': 'Apply mancozeb or copper fungicide. Remove infected plants immediately.',
    'Potato___healthy': 'Plant is healthy! Keep monitoring regularly.',
    'Pepper___Bacterial_spot': 'Apply copper bactericide. Avoid overhead watering. Remove infected leaves.',
    'Pepper___healthy': 'Plant is healthy! Keep monitoring regularly.',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot': 'Apply strobilurin fungicide. Use resistant varieties.',
    'Corn_(maize)___Common_rust_': 'Apply fungicide at early stages. Use resistant hybrid varieties.',
    'Corn_(maize)___Northern_Leaf_Blight': 'Apply fungicide. Use resistant varieties. Rotate crops.',
    'Corn_(maize)___healthy': 'Plant is healthy! Keep monitoring regularly.',
    'Grape___Black_rot': 'Apply mancozeb. Remove mummified berries. Prune for airflow.',
    'Grape___Esca_(Black_Measles)': 'Remove infected wood. Apply fungicide. Avoid water stress.',
    'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)': 'Apply copper fungicide. Remove infected leaves.',
    'Grape___healthy': 'Plant is healthy! Keep monitoring regularly.',
    'Apple___Apple_scab': 'Apply captan fungicide. Rake fallen leaves. Use resistant varieties.',
    'Apple___Black_rot': 'Apply fungicide. Remove infected fruit and branches. Prune dead wood.',
    'Apple___Cedar_apple_rust': 'Apply fungicide in spring. Remove nearby cedar trees if possible.',
    'Apple___healthy': 'Plant is healthy! Keep monitoring regularly.',
    'Cherry_(including_sour)___Powdery_mildew': 'Apply sulfur or potassium bicarbonate fungicide. Improve air circulation.',
    'Cherry_(including_sour)___healthy': 'Plant is healthy! Keep monitoring regularly.',
    'Peach___Bacterial_spot': 'Apply copper bactericide. Avoid overhead irrigation. Prune infected branches.',
    'Peach___healthy': 'Plant is healthy! Keep monitoring regularly.',
    'Strawberry___Leaf_scorch': 'Apply fungicide. Remove infected leaves. Avoid overhead watering.',
    'Strawberry___healthy': 'Plant is healthy! Keep monitoring regularly.',
    'Raspberry___healthy': 'Plant is healthy! Keep monitoring regularly.',
}

# Load model once when service starts
print("Loading AI model...")
model = AutoModelForImageClassification.from_pretrained(
    "linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification",
    ignore_mismatched_sizes=True
)
model.eval()
print("Model loaded successfully!")

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])


def predict_disease(image_file):
    """
    Predict plant disease from an uploaded image file object.
    """
    try:
        image_bytes = image_file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        tensor = transform(image).unsqueeze(0)

        with torch.no_grad():
            outputs = model(tensor)
            probs = torch.softmax(outputs.logits, dim=1)
            all_probs = probs[0]

        top_index = all_probs.argmax().item()
        label = model.config.id2label[top_index]
        score = all_probs[top_index].item()

        label = label_map.get(label, label)
        treatment = TREATMENTS.get(label, 'Consult a local agricultural expert for treatment advice.')

        return {
            'disease_name': label.replace('___', ' - ').replace('_', ' '),
            'confidence_score': round(score * 100, 2),
            'treatment': treatment
        }

    except Exception as e:
        return {'error': str(e)}