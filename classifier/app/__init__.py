from flask import Flask
from app.routes import main, process

def create_app():
    app = Flask(__name__)

    #app.config.from_object('config.Config')

    #Registrar blueprints|rutas
    app.register_blueprint(main.bp)
    app.register_blueprint(process.bp)

    return app
