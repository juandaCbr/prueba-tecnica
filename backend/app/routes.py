from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from .models import db, Curso, Inscripcion, Usuario

cursos_bp = Blueprint('cursos', __name__)

# funcion auxiliar para validar si el token actual pertenece a un administrador
def es_admin():
    claims = get_jwt()
    return claims.get('rol') == 'admin'

@cursos_bp.route('/api/cursos', methods=['GET'])
def obtener_cursos():
    cursos = Curso.query.all()
    resultado = [{
        'id': c.id,
        'titulo': c.titulo,
        'descripcion': c.descripcion,
        'instructor': c.instructor,
        'fecha_creacion': c.fecha_creacion.isoformat()
    } for c in cursos]
    return jsonify(resultado), 200

@cursos_bp.route('/api/cursos/<int:id>', methods=['GET'])
def obtener_curso(id):
    curso = Curso.query.get_or_404(id)
    return jsonify({
        'id': curso.id,
        'titulo': curso.titulo,
        'descripcion': curso.descripcion,
        'instructor': curso.instructor,
        'fecha_creacion': curso.fecha_creacion.isoformat()
    }), 200

@cursos_bp.route('/api/admin/stats', methods=['GET'])
@jwt_required()
def get_stats():
    if not es_admin(): return jsonify({"error": "denegado"}), 403
    return jsonify({
        "total_cursos": Curso.query.count(),
        "total_inscripciones": Inscripcion.query.count()
    })

@cursos_bp.route('/api/cursos', methods=['POST'])
@jwt_required()
def crear_curso():
    if not es_admin():
        return jsonify({'mensaje': 'acceso denegado. requiere rol administrador'}), 403

    datos = request.get_json()
    if not datos.get('titulo'):
        return jsonify({'mensaje': 'el titulo es obligatorio'}), 400
        
    nuevo_curso = Curso(
        titulo=datos.get('titulo'),
        descripcion=datos.get('descripcion'),
        instructor=datos.get('instructor')
    )
    
    db.session.add(nuevo_curso)
    db.session.commit()
    return jsonify({'mensaje': 'curso creado exitosamente', 'id': nuevo_curso.id}), 201

@cursos_bp.route('/api/cursos/<int:id>', methods=['PUT'])
@jwt_required()
def actualizar_curso(id):
    if not es_admin():
        return jsonify({'mensaje': 'acceso denegado. requiere rol administrador'}), 403

    curso = Curso.query.get_or_404(id)
    datos = request.get_json()
    
    if 'titulo' in datos: curso.titulo = datos['titulo']
    if 'descripcion' in datos: curso.descripcion = datos['descripcion']
    if 'instructor' in datos: curso.instructor = datos['instructor']
        
    db.session.commit()
    return jsonify({'mensaje': 'curso actualizado exitosamente'}), 200

@cursos_bp.route('/api/cursos/<int:id>', methods=['DELETE'])
@jwt_required()
def eliminar_curso(id):
    if not es_admin():
        return jsonify({'mensaje': 'acceso denegado. requiere rol administrador'}), 403

    curso = Curso.query.get_or_404(id)
    db.session.delete(curso)
    db.session.commit()
    return jsonify({'mensaje': 'curso eliminado exitosamente'}), 200

@cursos_bp.route('/api/cursos/<int:id>/inscribirse', methods=['POST'])
@jwt_required()
def inscribirse_curso(id):
    usuario_id = get_jwt_identity()
    curso = Curso.query.get_or_404(id)
    
    inscripcion_previa = Inscripcion.query.filter_by(usuario_id=usuario_id, curso_id=id).first()
    if inscripcion_previa:
        return jsonify({'mensaje': 'ya estas inscrito en este curso'}), 400
        
    nueva_inscripcion = Inscripcion(usuario_id=usuario_id, curso_id=id)
    db.session.add(nueva_inscripcion)
    db.session.commit()
    return jsonify({'mensaje': 'inscripcion exitosa al curso'}), 201

@cursos_bp.route('/api/mis-cursos', methods=['GET'])
@jwt_required()
def mis_cursos():
    usuario_id = get_jwt_identity()
    inscripciones = Inscripcion.query.filter_by(usuario_id=usuario_id).all()
    
    resultado = []
    for inscripcion in inscripciones:
        curso = Curso.query.get(inscripcion.curso_id)
        if curso:
            resultado.append({
                'inscripcion_id': inscripcion.id,
                'curso_id': curso.id,
                'titulo': curso.titulo,
                'instructor': curso.instructor,
                'fecha_inscripcion': inscripcion.fecha_inscripcion.isoformat()
            })
            
    return jsonify(resultado), 200

# nueva ruta para que el admin vea los inscritos en un curso especifico
@cursos_bp.route('/api/cursos/<int:id>/estudiantes', methods=['GET'])
@jwt_required()
def estudiantes_por_curso(id):
    if not es_admin():
        return jsonify({'mensaje': 'acceso denegado'}), 403
        
    inscripciones = Inscripcion.query.filter_by(curso_id=id).all()
    resultado = []
    
    for insc in inscripciones:
        usuario = Usuario.query.get(insc.usuario_id)
        if usuario:
            resultado.append({
                'id': usuario.id,
                'nombre': usuario.nombre,
                'email': usuario.email,
                'fecha_inscripcion': insc.fecha_inscripcion.isoformat()
            })
            
    return jsonify(resultado), 200