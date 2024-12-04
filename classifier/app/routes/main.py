from flask import Blueprint, render_template, jsonify, request, send_file
from app.controller import binarizador
from app.controller import classifier
import os

bp = Blueprint('main', __name__)

@bp.route('/test-binarized', methods=['POST'])
def test_binarized():

    if 'imagen' not in request.files:
        return jsonify({"message": "No se encontró ninguna imagen"}), 400
    
    image = request.files['imagen']
    id_image = request.form.get('id_image')       
    
    if not image and not id_image:
        return jsonify({'error': 'No se seleccionó ningún archivo.'}), 400
    
    extension = image.filename.split('.')[-1].lower()
    new_filename = f"{id_image}.{extension}"
    #print(new_filename)

    upload_folder = os.path.abspath('./app/uploads_temp')
    os.makedirs(upload_folder, exist_ok=True)  
    image_path = os.path.join(upload_folder, new_filename)
    #print(image_path)
    image.save(image_path)
    ##binary_image = binarizador.get_binariry_image(image)
    binarizador.get_binariry_image(image_path)

    #Devolver la imagen directamente desde memoria
    return send_file(image_path, mimetype=image.mimetype)

    #Leer la imagen en memoria
    #image_bytes = BytesIO(image.read())

    #Devolver la imagen cargada en la respuesta
    #return send_file(image_bytes, mimetype=image.mimetype)

    ##Guardar la imagen procesada en memoria para devolverla al cliente
    ##_, buffer = cv2.imencode('.jpg', binary_image)
    ##image_bytes = BytesIO(buffer)

    #return send_file(image_bytes, mimetype='image/jpeg')

@bp.route('/classification/<id_image>', methods=['DELETE'])
def classification(id_image):

    image_path = f"./app/uploads_temp/{id_image}.jpg"
    os.remove(image_path)

    return jsonify({"message": "Archivo eliminados correctamente."}), 200


@bp.route('/classification/<id_imagen>', methods=['GET'])
def classification(id_imagen):
    #id_image = request.form.get('id_image')

    image_path = f"./app/uploads_temp/{id_imagen}.jpg"

    class_image = classifier.get_class_image(image_path)

    return jsonify(class_image), 200



@bp.route('/classim/<id_imagen>', methods=['GET'])
def classification_ssim(id_imagen):

    image_path = f"./app/uploads_temp/{id_imagen}.jpg"


