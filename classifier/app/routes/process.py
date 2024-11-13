from flask import Blueprint, jsonify, request
from app.controller import data_controller

bp = Blueprint('api', __name__, url_prefix='/api')

@bp.route('/data', methods=['GET'])
def get_data():
    data = data_controller.get_data()
    return jsonify(data)

@bp.route('/data', methods=['POST'])
def post_data():
    data = request.get_json()
    response = data_controller.create_data(data)
    return jsonify(response), 201
