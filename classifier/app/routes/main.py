from flask import Blueprint, render_template, jsonify, request, send_file
from app.controller import binarizador
import os
from io import BytesIO
import cv2

bp = Blueprint('main', __name__)

@bp.route('/test-binarized', methods=['POST'])
def test_binarized():

    if 'imagen' not in request.files:
        return jsonify({"message": "No se encontró ninguna imagen"}), 400
    
    image = request.files['imagen']

    if image.filename == '':
        return jsonify({'error': 'No se seleccionó ningún archivo.'}), 400

    # Guardar la imagen en un directorio (opcional)
    upload_folder = '/app/uploads_temp'
    os.makedirs(upload_folder, exist_ok=True)  # Crear la carpeta si no existe
    image_path = os.path.join(upload_folder, image.filename)
    image.save(image_path)
    binarizador.get_binariry_image(image_path)

    # Devolver la imagen directamente desde memoria
    return send_file(image_path, mimetype=image.mimetype)

    # Leer la imagen en memoria
    #image_bytes = BytesIO(image.read())

    # Devolver la imagen cargada en la respuesta
    #return send_file(image_bytes, mimetype=image.mimetype)
    #return jsonify({'message': f'Imagen subida con éxito: {image.filename}'}), 200
    
    #return render_template("index.html", message="Bienvenido al servidor Flask")
    #return jsonify({"message": "Hola, soy goku"})

    # Guardar la imagen procesada en memoria para devolverla al cliente
    #_, buffer = cv2.imencode('.jpg', binary_image)
    #image_bytes = BytesIO(buffer)

    #return send_file(image_bytes, mimetype='image/jpeg')
