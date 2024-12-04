from tensorflow.keras.preprocessing.image import load_img, img_to_array
from flask import current_app
import tensorflow as tf
import numpy as np

#Función para cargar y preprocesar la imagen
def preprocess_image(image_path, target_size=(224, 224)):
    #Cargar la imagen en escala de grises
    img = load_img(image_path, target_size=target_size, color_mode='grayscale')
    #Convertir la imagen a un array NumPy
    img_array = img_to_array(img)
    #Normalizar (los valores deben estar entre 0 y 1)
    img_array = img_array / 255.0
    #Expandir dimensiones para simular un lote (1, 224, 224, 1)
    img_array = np.expand_dims(img_array, axis=0)
    return img_array


def get_class_image(image_path): 

    class_names = ['GasketGenius_05', 'GasketGenius_06', 'GasketGenius_07', 'GasketGenius_08', 'GasketGenius_09', 'GasketGenius_10', 'GasketGenius_11', 'GasketGenius_12', 'GasketGenius_13', 'GasketGenius_14', 'GasketGenius_15', 'GasketGenius_16', 'GasketGenius_17', 'GasketGenius_18', 'GasketGenius_19']
    loaded_model = current_app.loaded_model

    preprocessed_image = preprocess_image(image_path)

    predictions = loaded_model.predict(preprocessed_image)
    #print(predictions)

    prob_predict = predictions[0].tolist()

    #probability_percent = [p * 100 for p in prob_predict]

    #Obtener la clase con mayor probabilidad
    #predicted_class = np.argmax(predictions[0])

    return prob_predict

    #Imprimir las probabilidades para todas las clases
    #print("Probabilidades por clase:")
    #for i, prob in enumerate(predictions[0]):
    #    print(f"Clase {i}: {prob * 100:.2f}%")

    #print(f"Clase predicha: {class_names[predicted_class]}")
