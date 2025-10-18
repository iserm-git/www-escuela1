from fastapi import APIRouter
from app.api.v1.endpoints import alumnos
# from app.api.v1.endpoints import profesores, materias, grupos, asistencias, calificaciones, reportes

api_router = APIRouter()

api_router.include_router(alumnos.router, prefix="/alumnos", tags=["Alumnos"])
# api_router.include_router(profesores.router, prefix="/profesores", tags=["Profesores"])
# api_router.include_router(materias.router, prefix="/materias", tags=["Materias"])
# api_router.include_router(grupos.router, prefix="/grupos", tags=["Grupos"])
# api_router.include_router(asistencias.router, prefix="/asistencias", tags=["Asistencias"])
# api_router.include_router(calificaciones.router, prefix="/calificaciones", tags=["Calificaciones"])
# api_router.include_router(reportes.router, prefix="/reportes", tags=["Reportes"])