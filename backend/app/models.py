from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    # la contraseña se guardara como un hash por seguridad
    password = db.Column(db.String(200), nullable=False)
    # se agrega el campo rol con valor por defecto estudiante
    rol = db.Column(db.String(20), nullable=False, default='estudiante')

    # constructor explicito actualizado
    def __init__(self, nombre, email, password, rol='estudiante'):
        self.nombre = nombre
        self.email = email
        self.password = password
        self.rol = rol

class Curso(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.Text)
    instructor = db.Column(db.String(100))
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    
    # cascade asegura que si se borra un curso, se borren sus inscripciones asociadas
    inscripciones = db.relationship('Inscripcion', backref='curso_rel', cascade="all, delete-orphan", lazy=True)

    def __init__(self, titulo, descripcion=None, instructor=None):
        self.titulo = titulo
        self.descripcion = descripcion
        self.instructor = instructor

class Inscripcion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    curso_id = db.Column(db.Integer, db.ForeignKey('curso.id'), nullable=False)
    fecha_inscripcion = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, usuario_id, curso_id):
        self.usuario_id = usuario_id
        self.curso_id = curso_id