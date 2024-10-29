from flask import Blueprint, render_template, jsonify

bp = Blueprint('main', __name__)

@bp.route('/')
def home():
    #return render_template("index.html", message="Bienvenido al servidor Flask")
    return jsonify({"message": "Hola, soy goku"})
