from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# importamos la unica instancia de db directamente desde models
from .models import db, Usuario, Curso, Inscripcion
from config import Config

def create_app():
    app = Flask(__name__)

    # cargamos la configuracion desde config.py con variables de entorno
    app.config.from_object(Config)

    # aplicamos cors solo al frontend definido en las variables de entorno
    CORS(app, origins=[Config.FRONTEND_URL])

    # inicializamos las extensiones con nuestra unica instancia de db
    db.init_app(app)
    JWTManager(app)

    # forzamos la creacion automatica de las tablas en la base de datos si no existen
    with app.app_context():
        db.create_all()

    # importacion y registro de las rutas (blueprints)
    from .auth import auth_bp
    from .routes import cursos_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(cursos_bp)

    return app