from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from .models import db, Usuario
import traceback # libreria nativa para imprimir el error exacto en la terminal

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    try:
        datos = request.get_json()
        email = datos.get('email')
        password = datos.get('password')

        usuario = Usuario.query.filter_by(email=email).first()

        if usuario and check_password_hash(usuario.password, password):
            token = create_access_token(identity=str(usuario.id), additional_claims={"rol": usuario.rol})
            return jsonify({'token': token, 'rol': usuario.rol, 'mensaje': 'login exitoso'}), 200

        return jsonify({'mensaje': 'credenciales invalidas'}), 401
    except Exception as e:
        # captura cualquier error de base de datos o sintaxis
        print("error en login:", e)
        traceback.print_exc()
        return jsonify({'mensaje': f'error interno: {str(e)}'}), 500

@auth_bp.route('/api/auth/registro', methods=['POST'])
def registro():
    try:
        datos = request.get_json()
        
        # validacion de seguridad por si los datos llegan vacios
        if not datos:
            return jsonify({'mensaje': 'no se recibieron datos'}), 400

        email = datos.get('email', '')
        nombre = datos.get('nombre', '')
        password = datos.get('password', '')

        if not email or not password:
            return jsonify({'mensaje': 'email y password son obligatorios'}), 400

        # consulta a la base de datos
        if Usuario.query.filter_by(email=email).first():
            return jsonify({'mensaje': 'el correo ya esta registrado'}), 400

        password_hash = generate_password_hash(password)
        rol_asignado = 'admin' if 'admin' in email.lower() else 'estudiante'
        
        nuevo_usuario = Usuario(
            nombre=nombre,
            email=email,
            password=password_hash,
            rol=rol_asignado
        )
        
        db.session.add(nuevo_usuario)
        db.session.commit()
        
        return jsonify({'mensaje': 'usuario creado exitosamente', 'rol': rol_asignado}), 201
        
    except Exception as e:
        # si ocurre un error, deshacemos la transaccion para no bloquear la base de datos
        db.session.rollback()
        print("error en registro detectado:")
        traceback.print_exc()
        # enviamos el error exacto al frontend en formato json para que el cors no lo bloquee
        return jsonify({'mensaje': f'error del servidor: {str(e)}'}), 500