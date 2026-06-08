# AGENTS.md - Guía para asistentes IA

## Descripción del proyecto

Plataforma web de gestión académica virtual (Full Stack) para administrar catálogo de cursos e inscripciones de estudiantes.

- **Frontend:** Angular 21 (standalone components), Bootstrap 5, RxJS
- **Backend:** Flask (Python 3), Flask-JWT-Extended, SQLAlchemy ORM
- **Base de datos:** SQLite
- **Autenticación:** JWT (JSON Web Tokens)

## Estructura del proyecto

```
/
├── backend/                  # API REST en Flask
│   ├── app/
│   │   ├── __init__.py       # Factory pattern (create_app)
│   │   ├── models.py         # Modelos: Usuario, Curso, Inscripcion
│   │   ├── routes.py         # CRUD cursos, inscripciones, estadísticas
│   │   └── auth.py           # Login y registro con JWT
│   ├── config.py             # Config class con variables de entorno
│   ├── .env                  # Variables de entorno (desarrollo)
│   ├── .env.example          # Template para producción
│   ├── requirements.txt      # Dependencias Python
│   ├── run.py                # Punto de entrada
│   └── migrations/           # Migraciones SQLAlchemy
├── frontend/                 # SPA en Angular 21 (SSR con Express)
│   ├── src/
│   │   ├── main.ts           # Bootstrap de la app
│   │   ├── main.server.ts    # Entry point SSR
│   │   ├── server.ts         # Servidor Express para SSR
│   │   ├── environments/
│   │   │   ├── environment.ts      # API URL desarrollo
│   │   │   └── environment.prod.ts # API URL producción
│   │   ├── app/
│   │   │   ├── app.ts              # Componente raíz
│   │   │   ├── app.routes.ts       # Definición de rutas
│   │   │   ├── app.routes.server.ts # RenderMode por ruta (SSR)
│   │   │   ├── app.config.ts       # Proveedores globales
│   │   │   ├── app.config.server.ts# Config servidor SSR
│   │   │   ├── auth/               # Login y Registro
│   │   │   ├── core/               # Guards y Services
│   │   │   ├── cursos/             # CRUD cursos (listado, crear, editar, detalle)
│   │   │   ├── dashboard/          # Dashboard según rol
│   │   │   └── mis-cursos/         # Cursos del estudiante
│   │   └── styles.css
│   ├── angular.json
│   └── package.json
├── evidencias/               # Capturas de pantalla
├── AGENTS.md                 # Este archivo
└── README.md                 # Documentación principal
```

## Roles y permisos (RBAC)

- **admin**: Crear, editar, eliminar cursos; ver estadísticas; listar estudiantes inscritos.
- **estudiante**: Ver catálogo, inscribirse en cursos, ver "mis cursos".

Asignación automática: si el email contiene "admin", se asigna rol admin.

## Endpoints API

### Autenticación
- `POST /api/auth/login` → login, devuelve JWT
- `POST /api/auth/registro` → registro de usuario

### Cursos (público / estudiantes)
- `GET /api/cursos` → listar todos
- `GET /api/cursos/<id>` → detalle
- `POST /api/cursos/<id>/inscribirse` → inscribirse (requiere JWT)
- `GET /api/mis-cursos` → cursos del estudiante autenticado

### Cursos (solo admin)
- `POST /api/cursos` → crear
- `PUT /api/cursos/<id>` → actualizar
- `DELETE /api/cursos/<id>` → eliminar
- `GET /api/cursos/<id>/estudiantes` → inscritos
- `GET /api/admin/stats` → estadísticas globales

## Variables de entorno

### Backend (backend/.env)

| Variable | Desarrollo | Producción |
|---|---|---|
| `FLASK_DEBUG` | `True` | `False` |
| `JWT_SECRET_KEY` | `clave_secreta_super_segura` | Valor secreto aleatorio |
| `FRONTEND_URL` | `http://localhost:4200` | `https://tudominio.com` |
| `DATABASE_URL` | `sqlite:///academia.db` | `sqlite:///academia.db` |

Flask carga automáticamente el archivo `.env` gracias a `python-dotenv`.

### Frontend (src/environments/)

- `environment.ts` → `apiUrl: 'http://127.0.0.1:5000/api'` (desarrollo)
- `environment.prod.ts` → `apiUrl: '/api'` (producción, mismo dominio con proxy inverso)

Angular reemplaza automáticamente los archivos al hacer `ng build --configuration production` gracias a `fileReplacements` en `angular.json`.

## SSR (Server-Side Rendering)

Las rutas se configuran en `app.routes.server.ts`:

- **Prerender** (HTML estático en build): `/login`, `/registro`, `/dashboard`, `/cursos`, `/cursos/crear`, `/mis-cursos`
- **Server** (renderizado bajo demanda): `/cursos/editar/:id`, `/cursos/detalle/:id`

## Convenciones de código

- Backend: Python con Flask, blueprints para rutas, SQLAlchemy como ORM.
- Frontend: Angular standalone components, Bootstrap 5 para estilos.
- Comentarios en español en el código existente.
- No agregar comentarios nuevos a menos que se solicite explícitamente.
- Seguir el estilo existente del código (formato, naming, etc.).
- No modificar el README.md ni archivos de evidencia a menos que se solicite.
- Las variables de entorno se definen en `backend/.env` (nunca comitear) y en `frontend/src/environments/`.

## Comandos útiles

```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate      # Windows
pip install -r requirements.txt
flask run                  # http://127.0.0.1:5000

# Frontend (desarrollo)
cd frontend
npm install
ng serve                  # http://localhost:4200

# Frontend (build producción con SSR)
cd frontend
ng build --configuration production
node dist/frontend/server/server.mjs   # http://localhost:4000

# Producción con Gunicorn (backend)
cd backend
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 run:app
```
