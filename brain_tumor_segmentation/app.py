from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from PIL import Image
import io
import numpy as np
import os
import torch
import torchvision.transforms as transforms
import torch.nn as nn

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
RESULT_FOLDER = 'results'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULT_FOLDER, exist_ok=True)

# SegmentationAE model class from your notebook
class SegmentationAE(nn.Module):
    def __init__(self):
        super(SegmentationAE, self).__init__()
        # --- Encoder ---
        self.encoder = nn.Sequential(
            nn.Conv2d(1, 32, 3, 2, 1),  
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.Dropout(0.3), 

            nn.Conv2d(32, 48, 3, 2, 1),  
            nn.BatchNorm2d(48),
            nn.ReLU(),
            nn.Dropout(0.3),  

            nn.Conv2d(48, 64, 3, 2, 1), 
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.Dropout(0.4),  

            nn.Conv2d(64, 128, 3, 2, 1),  
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.Dropout(0.4),  

            nn.Conv2d(128, 256, 3, 2, 1), 
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
            nn.Dropout(0.5)  
        )
        
        # --- Decoder ---
        self.decoder = nn.Sequential(
            nn.ConvTranspose2d(256, 128, 3, 2, padding=1, output_padding=1), 
            nn.BatchNorm2d(128),
            
            nn.ReLU(inplace=True),
            nn.Dropout(0.4),  

            nn.ConvTranspose2d(128, 64, 3,2, padding=1, output_padding=1), 
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.Dropout(0.4),  

            nn.ConvTranspose2d(64, 48, 3, 2, padding=1, output_padding=1), 
            nn.BatchNorm2d(48),
            
            nn.ReLU(inplace=True),
            nn.Dropout(0.3),  

            nn.ConvTranspose2d(48, 32, 3, 2, padding=1, output_padding=1),  
            nn.BatchNorm2d(32),
            
            nn.ReLU(inplace=True),
            nn.Dropout(0.3),  

            nn.ConvTranspose2d(32, 1,3, 2, padding=1, output_padding=1), 
            
            nn.Sigmoid() 
        )
        
    def forward(self, x):
        x = self.encoder(x)
        x = self.decoder(x)
        return x

# Load PyTorch model
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model', '26100177_part3')
device = torch.device('cpu')
model = SegmentationAE()
model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model.eval()

def preprocess_image(img):
    transform = transforms.Compose([
        transforms.Resize((256, 256)),
        transforms.ToTensor()  # Converts to [0, 1]
        # Removed Normalize([0.5], [0.5]) to match training
    ])
    img = img.convert('L')  # Convert to grayscale for 1 channel
    return transform(img).unsqueeze(0)  # Add batch dimension

@app.route('/segment', methods=['POST'])
def segment_brain_tumor():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
    file = request.files['image']
    img = Image.open(file.stream).convert('L')
    img_tensor = preprocess_image(img)

    # Model inference
    with torch.no_grad():
        mask_pred = model(img_tensor)
        mask_np = mask_pred.squeeze().cpu().numpy()
        print("Raw mask_pred min:", mask_np.min(), "max:", mask_np.max(), "mean:", mask_np.mean())
        # Binarize the mask: threshold at 0.5
        mask_bin = (mask_np > 0.5).astype(np.uint8) * 255
        print("Mask sum:", np.sum(mask_bin))
        mask_img = Image.fromarray(mask_bin.astype(np.uint8))
        mask_img = mask_img.resize(img.size)

        # Visualize and save the raw mask before thresholding
        raw_mask_img = Image.fromarray((mask_np * 255).astype(np.uint8))
        raw_mask_img = raw_mask_img.resize(img.size)
        raw_mask_img.save('debug_raw_mask.png')

    img_rgb = img.convert('RGB')
    # Overlay mask on original image (matplotlib style)
    img_np = np.array(img_rgb).astype(np.float32) / 255.0  # shape (H, W, 3)
    mask_np = np.array(mask_img).astype(np.float32) / 255.0  # shape (H, W), values 0 or 1

    # Create a red mask
    red_mask = np.zeros_like(img_np)
    red_mask[..., 0] = 1.0  # Red channel

    # Overlay: where mask is 1, blend red with original
    alpha = 0.5  # More visible
    overlay = img_np.copy()
    overlay[mask_np > 0] = (1 - alpha) * img_np[mask_np > 0] + alpha * red_mask[mask_np > 0]

    # Convert back to uint8 Pillow image
    overlay_img = Image.fromarray((overlay * 255).astype(np.uint8))

    # Save debug images
    mask_img.save('debug_mask.png')
    overlay_img.save('debug_overlay.png')

    # Save original and masked images
    orig_path = os.path.join(RESULT_FOLDER, 'original.png')
    mask_path = os.path.join(RESULT_FOLDER, 'masked.png')
    img_rgb.save(orig_path)
    overlay_img.save(mask_path)

    # Tumor detection: if mask has any nonzero, say tumor present
    tumor_present = np.array(mask_img).sum() > 0
    result = 'Tumor Detected' if tumor_present else 'No Tumor Detected'

    # Return result and image URLs (for now, just send the images directly)
    buf_mask = io.BytesIO()
    overlay_img.save(buf_mask, format='PNG')
    buf_mask.seek(0)

    return send_file(buf_mask, mimetype='image/png')

if __name__ == "__main__":
    app.run(debug=False, use_reloader=False, port=8000)