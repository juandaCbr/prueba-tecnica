# Wrote README.md
# Plataforma de Cursos Educativos - Prueba Técnica Full Stack

Esta es una solución Full Stack desarrollada para gestionar el catálogo y las inscripciones de una academia virtual. El sistema permite la creación, edición y eliminación de cursos por parte de administradores, así como la exploración, búsqueda y registro en cursos por parte de los estudiantes.

## Tecnologías Utilizadas

* **Frontend:** Angular 21 (Componentes Standalone), Bootstrap 5, RxJS, SSR con Express.
* **Backend:** Flask (Python), Flask-JWT-Extended, SQLAlchemy (ORM).
* **Base de Datos:** SQLite.
* **Autenticación:** JWT (JSON Web Tokens).
* **Servidor Producción:** Gunicorn (backend), Node + Express SSR (frontend), Nginx (proxy inverso).

## Puntos Extra Implementados (Plus)

Se han cubierto requerimientos más allá de las historias de usuario básicas para asegurar un producto robusto y escalable:

1. **Gestión de Roles (RBAC):** Interfaces, componentes y accesos a la API estrictamente separados entre "Administrador" y "Estudiante".
2. **Buscador en Tiempo Real:** Filtro reactivo en el frontend para buscar cursos por título o instructor sin necesidad de recargar la página ni hacer peticiones extra al servidor.
3. **Manejo de Estados Vacíos (Empty States):** UI/UX mejorada que guía al usuario cuando no tiene cursos inscritos o cuando no hay resultados de búsqueda.
4. **Arquitectura UI/UX Defensiva y Reactiva:** Uso de `ChangeDetectorRef` para actualizaciones instantáneas del DOM y programación defensiva para parseo seguro de respuestas HTTP.
5. **Vista de Detalles Avanzada:**
   * **Para Estudiantes:** Prevención de doble inscripción y visualización del progreso.
   * **Para Administradores:** Tabla dinámica con el listado de todos los estudiantes inscritos por curso.
6. **Server-Side Rendering (SSR):** Renderizado híbrido con rutas estáticas prerenderizadas y dinámicas bajo demanda.

## Notas Importantes

* **Acceso de Administrador (Atajo de Evaluación):** Para facilitar la revisión de las vistas de creación y edición sin necesidad de manipular la base de datos manualmente, la lógica de registro asigna automáticamente el rol de `admin` a cualquier cuenta nueva cuyo correo electrónico contenga la palabra **"admin"** (ej. `admin@prueba.com`). Cualquier otro correo será registrado como `estudiante`.
* **Pruebas Unitarias:** Los archivos `.spec.ts` generados por defecto por Angular fueron omitidos/comentados para priorizar el desarrollo de las funcionalidades extra, la arquitectura de roles y el pulido de la interfaz gráfica dentro del tiempo establecido.

## Estructura del Proyecto

```
/
├── backend/                      # API REST en Flask
│   ├── app/
│   │   ├── __init__.py           # Factory pattern (create_app)
│   │   ├── models.py             # Modelos: Usuario, Curso, Inscripcion
│   │   ├── routes.py             # CRUD cursos, inscripciones, estadísticas
│   │   └── auth.py               # Login y registro con JWT
│   ├── config.py                 # Config class con variables de entorno
│   ├── .env                      # Variables de entorno (desarrollo)
│   ├── .env.example              # Template para producción
│   ├── requirements.txt          # Dependencias Python
│   ├── run.py                    # Punto de entrada
│   └── migrations/               # Migraciones SQLAlchemy
├── frontend/                     # SPA en Angular 21 (SSR con Express)
│   ├── src/
│   │   ├── main.ts               # Bootstrap de la app
│   │   ├── main.server.ts        # Entry point SSR
│   │   ├── server.ts             # Servidor Express para SSR
│   │   ├── environments/
│   │   │   ├── environment.ts         # API URL desarrollo
│   │   │   └── environment.prod.ts    # API URL producción
│   │   ├── app/
│   │   │   ├── app.ts                 # Componente raíz
│   │   │   ├── app.routes.ts          # Definición de rutas
│   │   │   ├── app.routes.server.ts   # RenderMode por ruta (SSR)
│   │   │   ├── app.config.ts          # Proveedores globales
│   │   │   ├── app.config.server.ts   # Config servidor SSR
│   │   │   ├── auth/                  # Login y Registro
│   │   │   ├── core/                  # Guards y Services
│   │   │   ├── cursos/                # CRUD cursos
│   │   │   ├── dashboard/             # Dashboard según rol
│   │   │   └── mis-cursos/            # Cursos del estudiante
│   │   └── styles.css
│   ├── angular.json
│   └── package.json
├── evidencias/                   # Capturas de pantalla
├── AGENTS.md                     # Guía para asistentes IA
└── README.md                     # Documentación principal
```

## SSR (Server-Side Rendering)

Las rutas se configuran en `frontend/src/app/app.routes.server.ts`:

| RenderMode | Rutas |
|---|---|
| **Prerender** (HTML estático en build) | `/login`, `/registro` |
| **Server** (renderizado bajo demanda) | `dashboard`, `cursos`, `cursos/crear`, `mis-cursos`, `cursos/editar/:id`, `cursos/detalle/:id` |

Las rutas que consumen datos de la API usan `RenderMode.Server` para evitar errores durante el prerenderizado.

## Variables de Entorno

### Backend (`backend/.env`)

| Variable | Desarrollo | Producción |
|---|---|---|
| `FLASK_DEBUG` | `True` | `False` |
| `JWT_SECRET_KEY` | `clave_secreta_super_segura` | Valor secreto aleatorio |
| `FRONTEND_URL` | `http://localhost:4200` | `https://tudominio.com` |
| `DATABASE_URL` | `sqlite:///academia.db` | `sqlite:///academia.db` |

El archivo `.env` se carga automáticamente gracias a `python-dotenv`.

### Frontend (`src/environments/`)

| Archivo | `apiUrl` | Uso |
|---|---|---|
| `environment.ts` | `http://127.0.0.1:5000/api` | Desarrollo (`ng serve`) |
| `environment.prod.ts` | `/api` | Producción (proxy Nginx) |

Angular reemplaza automáticamente los archivos al hacer `ng build --configuration production` gracias a `fileReplacements` en `angular.json`.

## Instrucciones de Instalación y Ejecución Local

### 1. Configuración del Backend (Flask)

Abra una terminal y ubíquese en el directorio del backend:

```bash
cd backend
```

Cree y active un entorno virtual:

```bash
# En Windows:
python -m venv venv
venv\Scripts\activate

# En Linux/Mac:
python3 -m venv venv
source venv/bin/activate
```

Instale las dependencias del proyecto:

```bash
pip install -r requirements.txt
```

Ejecute la aplicación (la base de datos SQLite se creará automáticamente):

```bash
flask run
```

El servidor backend estará escuchando en `http://127.0.0.1:5000`.

### 2. Configuración del Frontend (Angular)

Abra una nueva terminal y ubíquese en el directorio del frontend:

```bash
cd frontend
```

Instale las dependencias de Node.js:

```bash
npm install
```

Levante el servidor de desarrollo de Angular:

```bash
ng serve
```

La aplicación web estará disponible en su navegador en `http://localhost:4200`.

## Despliegue en Producción (VPS)

### Backend con Gunicorn + PM2

```bash
cd backend
pip install gunicorn
pm2 start /home/user/miniconda/envs/prueba_backend/bin/gunicorn --name "prueba-api" -- -w 4 -b 127.0.0.1:5000 run:app
pm2 save
```

### Frontend con SSR

```bash
cd frontend
ng build --configuration production
pm2 start node --name "prueba-frontend" -- dist/frontend/server/server.mjs
pm2 save
```

El servidor Node SSR escuchará en el puerto `4000` por defecto (configurable con `PORT`).

### Configuración de Nginx (proxy inverso)

Nginx redirige:
- `/api/*` → Flask en `127.0.0.1:5000`
- `/` → Node SSR en `127.0.0.1:3001` (o el puerto configurado)

Las rutas estáticas (CSS, JS, imágenes) se sirven directamente desde Nginx para velocidad.

## Evidencia de Ejecución

A continuación se adjuntan las capturas de pantalla que demuestran el funcionamiento de la aplicación:

### Vistas de Administrador
![Dashboard del Administrador](evidencias/Dashboard-Admin.png)
![Listado de Cursos - Vista Admin](evidencias/Cursos-vistaAdmin.png)
![Crear Curso](evidencias/Crear-curso.png)
![Actualizar Curso](evidencias/Actualizar-Curso.png)
![Detalle del Curso y Estudiantes](evidencias/DetalleCurso-Admin.png)

### Vistas de Estudiante (Usuario)
![Dashboard del Estudiante](evidencias/Dashboard-Usuario.png)
![Listado de Cursos - Vista Usuario](evidencias/Cursos-vistaUser.png)
![Detalle e Inscripción](evidencias/DetalleCurso-User.png)
![Mis Cursos Inscritos](evidencias/Mis-Cursos.png)

## Resumen de Endpoints REST (API)

### Autenticación
* `POST /api/auth/login` - Genera el token JWT.
* `POST /api/auth/registro` - Crea un nuevo usuario.

### Cursos (Público / Estudiantes)
* `GET /api/cursos` - Lista todos los cursos.
* `GET /api/cursos/<id>` - Detalles de un curso específico.
* `POST /api/cursos/<id>/inscribirse` - Registra al estudiante autenticado en un curso.
* `GET /api/mis-cursos` - Lista los cursos del estudiante autenticado.

### Gestión de Cursos (Solo Administradores)
* `POST /api/cursos` - Crea un nuevo curso.
* `PUT /api/cursos/<id>` - Actualiza un curso existente.
* `DELETE /api/cursos/<id>` - Elimina un curso.
* `GET /api/cursos/<id>/estudiantes` - Lista los alumnos inscritos en un curso específico.
* `GET /api/admin/stats` - Obtiene estadísticas globales de la plataforma.
