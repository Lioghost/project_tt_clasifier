from flask import Flask
from flask_cors import CORS
from tensorflow.keras.models import load_model
from app.routes import main, process

def create_app():
    app = Flask(__name__)

    #app.config.from_object('config.Config')
    CORS(app)

    app.loaded_model = load_model('./app/ai_model/modelo_convolucional0_3D2Ep_binario.keras')

    #Registrar blueprints|rutas
    app.register_blueprint(main.bp)
    app.register_blueprint(process.bp)

    return app
