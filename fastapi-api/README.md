# API FastAPI - Gestión Escolar

API REST desarrollada con FastAPI, SQLAlchemy y MySQL.

## Requisitos

- Python 3.11+
- MySQL 8.0+

## Instalación

```bash
# Crear entorno virtual
python3.11 -m venv venv

# Activar entorno virtual
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales
```

## Configuración de Base de Datos

```bash
# Asegurarse que MySQL esté corriendo
docker ps

# Configurar Alembic (primera vez)
alembic stamp head

# Crear migración
alembic revision --autogenerate -m "Descripción"

# Aplicar migraciones
alembic upgrade head
```

## Ejecutar

```bash
# Modo desarrollo
uvicorn app.main:app --reload --port 8000

# Modo producción
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## Endpoints principales

- **Documentación Swagger**: http://localhost:8000/docs
- **Documentación ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

### Recursos disponibles

- `/api/v1/alumnos` - CRUD de alumnos
- `/api/v1/profesores` - CRUD de profesores
- `/api/v1/materias` - CRUD de materias
- `/api/v1/grupos` - CRUD de grupos
- `/api/v1/asistencias` - Gestión de asistencias
- `/api/v1/calificaciones` - Gestión de calificaciones
- `/api/v1/reportes` - Generación de reportes

## Testing

```bash
# Ejecutar tests
pytest

# Con cobertura
pytest --cov=app tests/
```

`````

---

## 9. Testing y verificación

### 9.1 Colección Postman

Crear archivo `postman_collection.json`:
````json
{
  "info": {
    "name": "API Escuela",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Node.js API",
      "item": [
        {
          "name": "Health Check",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "http://localhost:3000/health",
              "protocol": "http",
              "host": ["localhost"],
              "port": "3000",
              "path": ["health"]
            }
          }
        },
        {
          "name": "Listar Alumnos",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "http://localhost:3000/api/alumnos?page=1&limit=10",
              "protocol": "http",
              "host": ["localhost"],
              "port": "3000",
              "path": ["api", "alumnos"],
              "query": [
                {"key": "page", "value": "1"},
                {"key": "limit", "value": "10"}
              ]
            }
          }
        },
        {
          "name": "Crear Alumno",
          "request": {
            "method": "POST",
            "header": [
              {"key": "Content-Type", "value": "application/json"}
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"matricula\": \"A20250010\",\n  \"nombre\": \"Juan\",\n  \"apellidoPaterno\": \"Pérez\",\n  \"apellidoMaterno\": \"García\",\n  \"carreraId\": 1,\n  \"activo\": true\n}"
            },
            "url": {
              "raw": "http://localhost:3000/api/alumnos",
              "protocol": "http",
              "host": ["localhost"],
              "port": "3000",
              "path": ["api", "alumnos"]
            }
          }
        },
        {
          "name": "Obtener Alumno por ID",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "http://localhost:3000/api/alumnos/1",
              "protocol": "http",
              "host": ["localhost"],
              "port": "3000",
              "path": ["api", "alumnos", "1"]
            }
          }
        }
      ]
    },
    {
      "name": "FastAPI",
      "item": [
        {
          "name": "Health Check",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "http://localhost:8000/health",
              "protocol": "http",
              "host": ["localhost"],
              "port": "8000",
              "path": ["health"]
            }
          }
        },
        {
          "name": "Listar Alumnos",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "http://localhost:8000/api/v1/alumnos?page=1&limit=10",
              "protocol": "http",
              "host": ["localhost"],
              "port": "8000",
              "path": ["api", "v1", "alumnos"],
              "query": [
                {"key": "page", "value": "1"},
                {"key": "limit", "value": "10"}
              ]
            }
          }
        },
        {
          "name": "Crear Alumno",
          "request": {
            "method": "POST",
            "header": [
              {"key": "Content-Type", "value": "application/json"}
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"matricula\": \"A20250011\",\n  \"nombre\": \"María\",\n  \"apellido_paterno\": \"López\",\n  \"apellido_materno\": \"Martínez\",\n  \"carrera_id\": 2,\n  \"activo\": true\n}"
            },
            "url": {
              "raw": "http://localhost:8000/api/v1/alumnos",
              "protocol": "http",
              "host": ["localhost"],
              "port": "8000",
              "path": ["api", "v1", "alumnos"]
            }
          }
        }
      ]
    }
  ]
}
`````
