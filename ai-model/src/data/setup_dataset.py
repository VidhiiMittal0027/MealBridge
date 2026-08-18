import os
import random
from PIL import Image, ImageDraw
import numpy as np

# Configuration
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATASET_DIR = os.path.join(BASE_DIR, 'dataset')
SPLITS = ['train', 'val', 'test']
CATEGORIES = ['tomato', 'banana', 'biryani', 'roti']
FRESHNESS = ['fresh', 'moderate', 'spoiled']

# Generate mock data properties for different classes so the model actually learns something
# Format: (R, G, B) base color
CLASS_COLORS = {
    'tomato': {'fresh': (255, 60, 60), 'moderate': (200, 100, 50), 'spoiled': (100, 50, 20)},
    'banana': {'fresh': (255, 255, 0), 'moderate': (200, 200, 100), 'spoiled': (100, 50, 0)},
    'biryani': {'fresh': (255, 200, 100), 'moderate': (200, 180, 150), 'spoiled': (150, 150, 150)},
    'roti': {'fresh': (210, 170, 120), 'moderate': (190, 150, 100), 'spoiled': (120, 150, 100)}, # Spoiled roti is greenish (mold)
}

def generate_mock_image(filepath, category, freshness, size=(224, 224)):
    base_color = CLASS_COLORS[category][freshness]
    
    # Create image with base color and some noise
    img_array = np.zeros((size[1], size[0], 3), dtype=np.uint8)
    img_array[:, :, 0] = np.clip(np.random.normal(base_color[0], 20, (size[1], size[0])), 0, 255)
    img_array[:, :, 1] = np.clip(np.random.normal(base_color[1], 20, (size[1], size[0])), 0, 255)
    img_array[:, :, 2] = np.clip(np.random.normal(base_color[2], 20, (size[1], size[0])), 0, 255)
    
    img = Image.fromarray(img_array)
    
    # Add some random shapes
    draw = ImageDraw.Draw(img)
    
    if category == 'roti':
        # Roti naturally has dark char marks when fresh
        for _ in range(15):
            x0 = random.randint(0, size[0] - 20)
            y0 = random.randint(0, size[1] - 20)
            if freshness == 'spoiled':
                # Spoiled roti gets green/blue mold spots
                spot_color = (0, random.randint(100,200), random.randint(50,150))
            else:
                # Fresh roti gets natural dark brown char spots
                spot_color = (60, 30, 10)
            draw.ellipse([x0, y0, x0+random.randint(10,30), y0+random.randint(10,30)], fill=spot_color)
    else:
        for _ in range(5):
            x0 = random.randint(0, size[0] - 20)
            y0 = random.randint(0, size[1] - 20)
            draw.ellipse([x0, y0, x0+20, y0+20], fill=(random.randint(0,255), random.randint(0,255), random.randint(0,255)))
        
    img.save(filepath)

def setup():
    print("Setting up mock dataset for MealBridge AI...")
    
    for split in SPLITS:
        num_images = 40 if split == 'train' else 10 # small numbers for quick MVP training
        
        for category in CATEGORIES:
            for freshness in FRESHNESS:
                # e.g., dataset/train/tomato_fresh
                # Wait, the prompt specifies:
                # dataset/train/fresh, dataset/train/moderate, etc.
                # but we also need category.
                # Let's use: dataset/train/{category}_{freshness} to easily map both labels from directory name
                # OR: dataset/train/{category}/{freshness}
                dir_path = os.path.join(DATASET_DIR, split, category, freshness)
                os.makedirs(dir_path, exist_ok=True)
                
                for i in range(num_images):
                    filepath = os.path.join(dir_path, f"img_{i:03d}.jpg")
                    generate_mock_image(filepath, category, freshness)
                    
    print("Mock dataset generated successfully.")

if __name__ == "__main__":
    setup()
