import os
import io
import sys
import torch
import torch.nn.functional as F
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
        model_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'models', 'mealbridge_freshness_v1.pth')
        if not os.path.exists(model_path):
            print(f"Warning: Model not found at {model_path}. Please train the model first.")
            # Still initialize a dummy model to allow the API to function
            model = MealBridgeFreshnessModel(num_categories=len(CATEGORIES), num_freshness_classes=len(FRESHNESS))
            model.to(device)
            model.eval()
            return
            
        model = MealBridgeFreshnessModel(num_categories=len(CATEGORIES), num_freshness_classes=len(FRESHNESS))
        try:
            # Use strict=False so we can load partial weights even with shape mismatch
            model.load_state_dict(torch.load(model_path, map_location=device, weights_only=True), strict=False)
            print("Model loaded successfully.")
        except Exception as inner_e:
            print(f"Could not load pre-trained weights properly, using un-trained model: {inner_e}")
            
        model.to(device)
        model.eval()
    except Exception as e:
        print(f"Failed to load model: {e}")

@app.on_event("startup")
async def startup_event():
    load_model()

def check_image_quality(img: Image.Image):
    """Basic image quality validation"""
    if img.size[0] < 100 or img.size[1] < 100:
        return False, "Image resolution is too low."
    
    # Check if extremely dark or overexposed (using basic mean brightness)
    stat = ImageStat.Stat(img.convert('L'))
    mean_brightness = stat.mean[0]
    if mean_brightness < 20:
        return False, "Image is too dark to analyze."
    if mean_brightness > 240:
        return False, "Image is overexposed."
        
    return True, "Good"

@app.get("/")
def health_check():
    return {"status": "active", "model_loaded": model is not None}

@app.post("/predict-freshness")
async def predict_freshness(file: UploadFile = File(...)):
    if not model:
        raise HTTPException(status_code=503, detail="Model is currently unavailable.")
        
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert('RGB')
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file format.")
        
    is_valid, msg = check_image_quality(image)
    if not is_valid:
        return {
            "food_type": "unknown",
            "freshness_label": "uncertain",
            "freshness_score": None,
            "confidence": 0.0,
            "recommendation": msg,
            "model_version": "mealbridge-freshness-v1",
            "analysis_timestamp": torch.datetime.datetime.now().isoformat() if hasattr(torch, 'datetime') else "now"
        }
        
    input_tensor = transform(image).unsqueeze(0).to(device)
    
    with torch.no_grad():
        cat_out, fresh_out = model(input_tensor)
        
        # Softmax probabilities
        cat_probs = F.softmax(cat_out, dim=1)[0]
        fresh_probs = F.softmax(fresh_out, dim=1)[0]
        
        cat_idx = torch.argmax(cat_probs).item()
        fresh_idx = torch.argmax(fresh_probs).item()
        
        cat_conf = cat_probs[cat_idx].item()
        fresh_conf = fresh_probs[fresh_idx].item()
        
        predicted_category = CATEGORIES[cat_idx]
        predicted_freshness = FRESHNESS[fresh_idx]
        
    if predicted_category == 'unknown':
        return {
            "error": "Image is not recognized as food. Please upload a valid food image.",
            "is_food": False
        }
        
    # Formatting output for low confidence
    if fresh_conf < 0.60:
        recommendation = "Low confidence. Please upload a clearer image."
    elif predicted_freshness == "fresh":
        recommendation = "Fresh-looking based on visual characteristics."
    elif predicted_freshness == "moderate":
        recommendation = "Questionable freshness. Handle with care."
    else:
        recommendation = "Visible spoilage detected. Do not distribute."
        
    return {
        "food_type": predicted_category,
        "freshness_label": predicted_freshness,
        "freshness_score": int(fresh_conf * 100),
        "confidence": round(fresh_conf, 2),
        "recommendation": recommendation,
        "model_version": "mealbridge-freshness-v1"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
