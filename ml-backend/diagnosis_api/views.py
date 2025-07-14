from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from django.core.files.storage import default_storage
import os
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
from PIL import Image
import logging

# Set up logging
logger = logging.getLogger(__name__)

# Load the model once at startup
try:
    MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'models', 'pneumonia_model.h5')
    model = load_model(MODEL_PATH)
except Exception as e:
    model = None
    logger.error(f'Could not load pneumonia model: {e}')

try:
    TB_MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'models', 'tb_model.h5')
    tb_model = load_model(TB_MODEL_PATH)
except Exception as e:
    tb_model = None
    logger.error(f'Could not load TB model: {e}')

# Create your views here.

class ReportUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, format=None):
        if model is None:
            logger.error('Pneumonia model is not available.')
            return Response({'error': 'Pneumonia model not available.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        file_obj = request.FILES.get('file')
        if not file_obj:
            logger.error('No file provided in request.')
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate file type
        valid_mime_types = ['image/jpeg', 'image/png']
        if file_obj.content_type not in valid_mime_types:
            logger.error(f'Invalid file type: {file_obj.content_type}')
            return Response({'error': 'Invalid file type. Only JPG and PNG are supported.'}, status=status.HTTP_400_BAD_REQUEST)

        # Save file temporarily
        file_path = default_storage.save(file_obj.name, file_obj)
        abs_file_path = os.path.join(default_storage.location, file_path)
        try:
            # Preprocess the image
            img = Image.open(abs_file_path).convert('RGB')
            img = img.resize((220, 220))  # Model expects 220x220
            img_array = np.array(img) / 255.0
            img_array = np.expand_dims(img_array, axis=0)  # Shape: (1, 220, 220, 3)
            # Predict
            preds = model.predict(img_array)
            print('Raw model prediction:', preds)
            # Assume binary classification: 0=Normal, 1=Pneumonia
            pred_class = int(preds[0][0] > 0.5)
            confidence = float(preds[0][0]) if pred_class == 1 else 1 - float(preds[0][0])
            diagnosis = 'Pneumonia' if pred_class == 1 else 'Normal'
            result = {'diagnosis': diagnosis, 'confidence': round(confidence, 4)}
            logger.info(f'Prediction result: {result}')
        except Exception as e:
            logger.error(f'Failed to process image: {str(e)}', exc_info=True)
            return Response({'error': f'Failed to process image: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        finally:
            if default_storage.exists(file_path):
                os.remove(abs_file_path)
        return Response({'result': result}, status=status.HTTP_200_OK)

class TBReportUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, format=None):
        if tb_model is None:
            logger.error('TB model is not available.')
            return Response({'error': 'TB model not available.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        file_obj = request.FILES.get('file')
        if not file_obj:
            logger.error('No file provided in request.')
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate file type
        valid_mime_types = ['image/jpeg', 'image/png']
        if file_obj.content_type not in valid_mime_types:
            logger.error(f'Invalid file type: {file_obj.content_type}')
            return Response({'error': 'Invalid file type. Only JPG and PNG are supported.'}, status=status.HTTP_400_BAD_REQUEST)

        # Save file temporarily
        file_path = default_storage.save(file_obj.name, file_obj)
        abs_file_path = os.path.join(default_storage.location, file_path)
        try:
            # Preprocess the image
            img = Image.open(abs_file_path).convert('RGB')
            img = img.resize((220, 220))  # Model expects 220x220
            img_array = np.array(img) / 255.0
            img_array = np.expand_dims(img_array, axis=0)  # Shape: (1, 220, 220, 3)
            # Predict
            preds = tb_model.predict(img_array)
            print('Raw TB model prediction:', preds)
            # Assume binary classification: 0=Normal, 1=TB
            pred_class = int(preds[0][0] > 0.5)
            confidence = float(preds[0][0]) if pred_class == 1 else 1 - float(preds[0][0])
            diagnosis = 'TB' if pred_class == 1 else 'Normal'
            result = {'diagnosis': diagnosis, 'confidence': round(confidence, 4)}
            logger.info(f'TB Prediction result: {result}')
        except Exception as e:
            logger.error(f'Failed to process TB image: {str(e)}', exc_info=True)
            return Response({'error': f'Failed to process image: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        finally:
            if default_storage.exists(file_path):
                os.remove(abs_file_path)
        return Response({'result': result}, status=status.HTTP_200_OK)
