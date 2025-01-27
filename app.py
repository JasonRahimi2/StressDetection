from flask import Flask, request, jsonify
import tensorflow as tf
from PIL import Image
import numpy as np
from tensorflow.keras.models import load_model

detectionModel = load_model('FaceDetection.h5')
stressModel = load_model('stressed.h5')


def preprocess_image(image, target_size=(224, 224)):
    img = Image.open(image)
    img = img.resize(target_size)
    img_array = np.array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = tf.keras.applications.vgg16.preprocess_input(img_array)
    return img_array


def predict_image_class(image, model):
    print(model)
    if model == detectionModel:
        preprocessed_img = preprocess_image(image, (224, 224))
    
    else:
        preprocessed_img = preprocess_image(image, (256, 256))

    predictions = model.predict(preprocessed_img)
    return predictions


app = Flask(__name__)


@app.route('/prediction', methods=['POST'])
def prediction():
    image = request.files['image']
    predicted_class = predict_image_class(image, detectionModel)
    print(predicted_class)
    if predicted_class[0][0] >= 0.7:
        predicted_class = predict_image_class(image, stressModel)
        return jsonify({
        'prediction': {
            'class_0': float(predicted_class[0][0]),
            'class_1': float(predicted_class[0][1])
        }
    })
    else:
        return 'Face not detected in image.'


if __name__ == '__main__':
    app.run()