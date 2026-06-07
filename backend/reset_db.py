import os
from app import create_app, db

# inicializamos la aplicacion para tener el contexto de flask
app = create_app()

with app.app_context():
    # define las posibles rutas donde sqlite guarda el archivo
    rutas_db = ['academia.db', 'instance/academia.db', 'app/academia.db']
    
    # busca el archivo fisico y lo elimina para asegurar una instalacion limpia
    for ruta in rutas_db:
        if os.path.exists(ruta):
            try:
                os.remove(ruta)
                print(f"archivo {ruta} antiguo eliminado.")
            except Exception as e:
                print(f"no se pudo eliminar {ruta}. asegurese de detener el servidor flask primero.")
    
    # le decimos a sqlalchemy que borre cualquier rastro en memoria y cree las tablas de cero
    db.drop_all()
    db.create_all()
    
    print("\n--- exito ---")
    print("la base de datos se ha reiniciado por completo.")
    print("las tablas ahora incluyen la estructura nueva con los roles.")