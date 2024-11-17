import cv2
import numpy as np

def get_binariry_image(image_path):
    #Cargar la imagen a memoria
    ##file_bytes = np.frombuffer(image.read(), np.uint8)  # Convertir a un array de bytes
    ##image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)  # Decodificar la imagen desde bytes
    image = cv2.imread(image_path)

    #if image is None:
    # raise ValueError("La imagen no pudo ser decodificada. Asegúrate de enviar un archivo válido.")

    #Convertir a escala de grises
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    #Aplicar desenfoque Gaussiano para reducir el ruido
    blurred_image = cv2.GaussianBlur(gray_image, (5, 5), 0)

    #Binarizar la imagen usando el umbral de Otsu
    _, binary_image = cv2.threshold(blurred_image, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    binary_image = cv2.bitwise_not(binary_image)

    #Guardar la imagen binarizada en una carpeta
    output_path = image_path 
    cv2.imwrite(output_path, binary_image)

    ##return binary_image