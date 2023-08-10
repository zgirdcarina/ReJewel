import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import VGG16
from tensorflow.keras.layers import GlobalAveragePooling2D, Dense
from tensorflow.keras.models import Model

# Set up the image data generator
datagen = ImageDataGenerator(rescale=1./255, validation_split=0.2)

# Define the number of classes and categories
num_classes = 6
categories = ['Body', 'Bracelet', 'Earrings','Necklace', 'Ring', 'Watch']

# Load and prepare the training and validation datasets
train_data = datagen.flow_from_directory('train_directory', target_size=(224, 224), batch_size=32, class_mode='categorical', subset='training')
val_data = datagen.flow_from_directory('train_directory', target_size=(224, 224), batch_size=32, class_mode='categorical', subset='validation')

# Load the pre-trained VGG16 model without the top (classification) layers
base_model = VGG16(weights='imagenet', include_top=False, input_shape=(224, 224, 3))

# Freeze the base model's layers
for layer in base_model.layers:
    layer.trainable = False

# Add your custom classification layers on top of the base model
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(256, activation='relu')(x)
predictions = Dense(num_classes, activation='softmax')(x)

# Create the final model
model = Model(inputs=base_model.input, outputs=predictions)

# Compile the model
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Train the model
model.fit(train_data, epochs=10, validation_data=val_data)

# Save the trained model
model.save('model.h5')
