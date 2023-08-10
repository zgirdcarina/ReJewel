from flask import Flask, request, jsonify
from tensorflow import keras
from flask_cors import CORS, cross_origin
from tensorflow.keras.preprocessing import image
from PIL import Image
from io import BytesIO
import numpy as np

app = Flask(__name__)
CORS(app,origins="http://localhost:3000")
# Load the trained model
model = keras.models.load_model('train_directory\model.h5')

# Define the categories
categories = ['Body', 'Bracelet', 'Earrings','Necklace', 'Ring', 'Watch']

# Define the endpoint for image classification
@app.route('/api/classifyJewelry', methods=['POST'])
@cross_origin()
def classify_jewelry():
    try:
        # Retrieve the image from the request
        image_data = request.files['image']
        print(image_data)

        # Convert the FileStorage to bytes, and load as an image
        img = Image.open(BytesIO(image_data.read())).resize((224, 224))


        # Convert the image to a numpy array
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = img_array / 255.0

        # print(img_array)

        # Perform the prediction
        prediction = model.predict(img_array)

        # Get the predicted class label
        predicted_class_index = np.argmax(prediction)
        print(predicted_class_index)
        print(categories)
        print(prediction)
        predicted_class = categories[predicted_class_index]
        

        # Return the predicted class as the response
        return jsonify({'predicted_class': predicted_class})
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

    
