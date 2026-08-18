import os
from PIL import Image
from torch.utils.data import Dataset
from torchvision import transforms

CATEGORIES = ['biryani', 'rice', 'dal', 'curry', 'roti', 'pizza', 'pasta', 'sandwich', 'fried', 'unknown']
FRESHNESS = ['fresh', 'moderate', 'spoiled']

# Mappings for categorical to integer
CAT_TO_IDX = {cat: idx for idx, cat in enumerate(CATEGORIES)}
FRESH_TO_IDX = {fresh: idx for idx, fresh in enumerate(FRESHNESS)}

class MealBridgeDataset(Dataset):
    def __init__(self, root_dir, split='train', transform=None):
        self.root_dir = root_dir
        self.split_dir = os.path.join(root_dir, split)
        self.transform = transform
        self.samples = []
        
        # Parse directory structure: split / category / freshness / image.jpg
        for category in CATEGORIES:
            cat_path = os.path.join(self.split_dir, category)
            if not os.path.exists(cat_path):
                continue
                
            for freshness in FRESHNESS:
                fresh_path = os.path.join(cat_path, freshness)
                if not os.path.exists(fresh_path):
                    continue
                    
                for img_name in os.listdir(fresh_path):
                    if img_name.endswith('.jpg') or img_name.endswith('.png'):
                        self.samples.append({
                            'path': os.path.join(fresh_path, img_name),
                            'category_idx': CAT_TO_IDX[category],
                            'freshness_idx': FRESH_TO_IDX[freshness]
                        })

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        sample = self.samples[idx]
        image = Image.open(sample['path']).convert('RGB')
        
        if self.transform:
            image = self.transform(image)
            
        return {
            'image': image,
            'category': sample['category_idx'],
            'freshness': sample['freshness_idx']
        }

def get_transforms(is_train=True):
    if is_train:
        return transforms.Compose([
            transforms.RandomResizedCrop(224, scale=(0.8, 1.0)),
            transforms.RandomHorizontalFlip(),
            transforms.ColorJitter(brightness=0.2, contrast=0.2),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])
    else:
        return transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])
