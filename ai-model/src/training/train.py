import os
import sys
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from sklearn.metrics import classification_report, confusion_matrix
from tqdm import tqdm

# Add parent directory to path so we can import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from src.models.architecture import MealBridgeFreshnessModel
from src.data.dataset import MealBridgeDataset, get_transforms, CATEGORIES, FRESHNESS

# Configuration
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_DIR = os.path.join(BASE_DIR, 'dataset')
MODEL_DIR = os.path.join(BASE_DIR, 'models')
os.makedirs(MODEL_DIR, exist_ok=True)

BATCH_SIZE = 16
EPOCHS = 5
LEARNING_RATE = 1e-3

def train():
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {device}")
    
    # Datasets and Loaders
    train_dataset = MealBridgeDataset(DATA_DIR, split='train', transform=get_transforms(is_train=True))
    val_dataset = MealBridgeDataset(DATA_DIR, split='val', transform=get_transforms(is_train=False))
    test_dataset = MealBridgeDataset(DATA_DIR, split='test', transform=get_transforms(is_train=False))
    
    train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False)
    test_loader = DataLoader(test_dataset, batch_size=BATCH_SIZE, shuffle=False)
    
    # Model Setup
    model = MealBridgeFreshnessModel(num_categories=len(CATEGORIES), num_freshness_classes=len(FRESHNESS))
    model = model.to(device)
    
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.AdamW(model.parameters(), lr=LEARNING_RATE)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='min', patience=1)
    
    best_val_loss = float('inf')
    
    for epoch in range(EPOCHS):
        model.train()
        train_loss = 0.0
        
        # Training Phase
        print(f"Epoch {epoch+1}/{EPOCHS}")
        for batch in tqdm(train_loader, desc="Training"):
            images = batch['image'].to(device)
            cat_targets = batch['category'].to(device)
            fresh_targets = batch['freshness'].to(device)
            
            optimizer.zero_grad()
            cat_out, fresh_out = model(images)
            
            loss_cat = criterion(cat_out, cat_targets)
            loss_fresh = criterion(fresh_out, fresh_targets)
            
            # Weighted loss prioritizing freshness detection slightly more
            loss = loss_cat + (loss_fresh * 1.5)
            
            loss.backward()
            optimizer.step()
            train_loss += loss.item()
            
        train_loss /= len(train_loader)
        
        # Validation Phase
        model.eval()
        val_loss = 0.0
        with torch.no_grad():
            for batch in val_loader:
                images = batch['image'].to(device)
                cat_targets = batch['category'].to(device)
                fresh_targets = batch['freshness'].to(device)
                
                cat_out, fresh_out = model(images)
                
                loss_cat = criterion(cat_out, cat_targets)
                loss_fresh = criterion(fresh_out, fresh_targets)
                loss = loss_cat + (loss_fresh * 1.5)
                val_loss += loss.item()
                
        val_loss /= len(val_loader)
        print(f"Train Loss: {train_loss:.4f} | Val Loss: {val_loss:.4f}")
        
        scheduler.step(val_loss)
        
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            model_path = os.path.join(MODEL_DIR, "mealbridge_freshness_v1.pth")
            torch.save(model.state_dict(), model_path)
            print("Saved new best model.")
            
    print("\n--- Training Complete ---")
    
    # Test Evaluation Phase
    print("Evaluating on Test Set...")
    model.load_state_dict(torch.load(os.path.join(MODEL_DIR, "mealbridge_freshness_v1.pth"), weights_only=True))
    model.eval()
    
    all_fresh_targets = []
    all_fresh_preds = []
    
    with torch.no_grad():
        for batch in tqdm(test_loader, desc="Testing"):
            images = batch['image'].to(device)
            fresh_targets = batch['freshness']
            _, fresh_out = model(images)
            
            fresh_preds = torch.argmax(fresh_out, dim=1).cpu().numpy()
            all_fresh_targets.extend(fresh_targets.numpy())
            all_fresh_preds.extend(fresh_preds)
            
    print("\nFreshness Classification Report:")
    print(classification_report(all_fresh_targets, all_fresh_preds, target_names=FRESHNESS))
    
    print("Confusion Matrix (Fresh, Moderate, Spoiled):")
    print(confusion_matrix(all_fresh_targets, all_fresh_preds))
    print("Remember: Row = Actual, Column = Predicted")

if __name__ == "__main__":
    train()
