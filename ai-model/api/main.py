import os
import io
import sys
import torch
import torch.nn.functional as F
import numpy as np
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image, ImageStat
from torchvision import transforms

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.models.architecture import MealBridgeFreshnessModel
from src.data.dataset import get_transforms, CATEGORIES, FRESHNESS

app = FastAPI(title="MealBridge AI Freshness API", version="1.0")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model instance
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = None
transform = get_transforms(is_train=False)

def load_model():
    global model
    try:
        print("Loading custom MealBridgeFreshnessModel...")
        model = MealBridgeFreshnessModel(num_categories=len(CATEGORIES), num_freshness_classes=len(FRESHNESS))
        model_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "models", "mealbridge_freshness_v1.pth")
        if os.path.exists(model_path):
            model.load_state_dict(torch.load(model_path, map_location=device, weights_only=True))
            print(f"Loaded model weights from {model_path}")
        else:
            print(f"Warning: Model weights not found at {model_path}. Running with random initialization.")
        model.to(device)
        model.eval()
        print("Model loaded successfully!")
    except Exception as e:
        print(f"Failed to load model: {e}")

@app.on_event("startup")
async def startup_event():
    load_model()

def check_image_quality(img: Image.Image):
    """Basic image quality validation including resolution, brightness, and blur"""
    # 1. Resolution Check
    if img.size[0] < 200 or img.size[1] < 200:
        return False, "Image resolution is too low."
    
    # 2. Brightness Check
    stat = ImageStat.Stat(img.convert('L'))
    mean_brightness = stat.mean[0]
    if mean_brightness < 25:
        return False, "Image is too dark to analyze."
    if mean_brightness > 235:
        return False, "Image is overexposed."
    
    # 3. Blur Check using Laplacian variance
    try:
        gray = np.array(img.convert('L'), dtype=np.float32)
        # Compute Laplacian: [[0, 1, 0], [1, -4, 1], [0, 1, 0]]
        laplacian = gray[1:-1, 1:-1] * 4.0 - gray[:-2, 1:-1] - gray[2:, 1:-1] - gray[1:-1, :-2] - gray[1:-1, 2:]
        variance = np.var(laplacian)
        if variance < 80.0:  # Threshold for blurry images
            return False, "Image is too blurry to analyze confidently."
    except Exception as e:
        print(f"Failed to check blur: {e}")
        
    return True, "Good"

@app.get("/")
def health_check():
    return {"status": "active", "model_loaded": model is not None}

@app.post("/predict-freshness")
async def predict_freshness(file: UploadFile = File(...)):
    global model, device, transform
    if model is None:
        raise HTTPException(status_code=503, detail="Model is currently unavailable.")
        
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert('RGB')
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file format.")
        
    # Check image quality
    is_valid, q_msg = check_image_quality(image)
    if not is_valid:
        return {
            "is_valid_image": False,
            "rejection_reason": f"Unable to confidently analyze this image. {q_msg} Please upload a clearer image showing the food clearly.",
            "food_type": "unknown",
            "freshness_label": "uncertain",
            "confidence": 0.0,
            "freshness_score": 0,
            "recommendation": "Unable to confidently analyze this image. Please upload a clearer image showing the food clearly."
        }
        
    try:
        # Preprocess and predict using the custom MobileNetV3 model
        image_tensor = transform(image).unsqueeze(0).to(device)
        with torch.no_grad():
            cat_out, fresh_out = model(image_tensor)
            cat_probs = F.softmax(cat_out, dim=1)
            fresh_probs = F.softmax(fresh_out, dim=1)
            
            cat_idx = torch.argmax(cat_probs, dim=1).item()
            fresh_idx = torch.argmax(fresh_probs, dim=1).item()
            
            cat_conf = cat_probs[0, cat_idx].item()
            fresh_conf = fresh_probs[0, fresh_idx].item()
            
            predicted_category = CATEGORIES[cat_idx]
            predicted_freshness = FRESHNESS[fresh_idx]
            
        # Check if the predicted category is unknown
        if predicted_category == "unknown" or cat_conf < 0.35:
            return {
                "is_valid_image": False,
                "rejection_reason": "Unable to confidently analyze this image. Food not clearly visible or contains unrelated objects. Please upload a clearer image showing the food clearly.",
                "food_type": "unknown",
                "freshness_label": "uncertain",
                "confidence": 0.0,
                "freshness_score": 0,
                "recommendation": "Unable to confidently analyze this image. Please upload a clearer image showing the food clearly."
            }

        # Recommendations based on freshness
        if predicted_freshness == "spoiled":
            recommendation = "Potential spoilage detected. Do not distribute."
        elif predicted_freshness == "moderate":
            recommendation = "Questionable freshness. Handle with care."
        else:
            recommendation = "Fresh-looking based on visible characteristics."

        return {
            "is_valid_image": True,
            "rejection_reason": None,
            "food_type": predicted_category,
            "freshness_label": predicted_freshness,
            "confidence": round(cat_conf, 2),
            "freshness_score": int(fresh_conf * 100),
            "recommendation": recommendation,
            "model_version": "mealbridge-freshness-v1"
        }
    except Exception as e:
        print(f"Prediction failed: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
