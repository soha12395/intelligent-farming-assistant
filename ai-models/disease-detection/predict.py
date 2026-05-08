import sys
import json
from PIL import Image
import torch
from transformers import AutoModelForImageClassification
from torchvision import transforms

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
    'Cherry (including sour) healthy': 'Cherry_(including_sour)___healthy',
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
def predict(image_path, plant):
    model = AutoModelForImageClassification.from_pretrained(
        "linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification",
        ignore_mismatched_sizes=True
    )
    model.eval()

    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

    image = Image.open(image_path).convert('RGB')
    tensor = transform(image).unsqueeze(0)

    with torch.no_grad():
        outputs = model(tensor)
        probs = torch.softmax(outputs.logits, dim=1)
        all_probs = probs[0]

    plant_results = []
    for idx, prob in enumerate(all_probs):
        lbl = model.config.id2label[idx]
        if plant.lower() in lbl.lower():
            plant_results.append((lbl, prob.item()))

    if plant_results:
        best = max(plant_results, key=lambda x: x[1])
        label, score = best
    else:
        top_index = all_probs.argmax().item()
        label = model.config.id2label[top_index]
        score = all_probs[top_index].item()

    label = label_map.get(label, label)

    print(json.dumps({
        "label": label,
        "score": score
    }))

predict(sys.argv[1], sys.argv[2])