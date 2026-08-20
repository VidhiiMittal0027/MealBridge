import torch
import torch.nn as nn
from torchvision.models import mobilenet_v3_small

class MealBridgeFreshnessModel(nn.Module):
    def __init__(self, num_categories=3, num_freshness_classes=3):
        super().__init__()
        
        # Load MobileNetV3 without pretrained weights (our own weights are loaded via load_state_dict)
        self.backbone = mobilenet_v3_small(weights=None)
        
        # Extract the number of features entering the classifier
        in_features = self.backbone.classifier[0].in_features
        
        # Remove the original classification head completely
        self.backbone.classifier = nn.Identity()
        
        # Create multi-task heads
        self.category_head = nn.Sequential(
            nn.Linear(in_features, 256),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(256, num_categories)
        )
        
        self.freshness_head = nn.Sequential(
            nn.Linear(in_features, 256),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(256, num_freshness_classes)
        )
        
    def forward(self, x):
        features = self.backbone(x)
        category_out = self.category_head(features)
        freshness_out = self.freshness_head(features)
        return category_out, freshness_out

if __name__ == "__main__":
    # Test model instantiation
    model = MealBridgeFreshnessModel()
    dummy_input = torch.randn(1, 3, 224, 224)
    cat, fresh = model(dummy_input)
    print(f"Category output shape: {cat.shape}")
    print(f"Freshness output shape: {fresh.shape}")
