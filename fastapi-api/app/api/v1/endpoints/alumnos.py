from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.crud import alumno as crud_alumno
from app.schemas.alumno import AlumnoCreate, AlumnoUpdate, AlumnoResponse
import math

router = APIRouter()

@router.get("/", response_model=dict)
def get_alumnos(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: str = Query(None),
    db: Session = Depends(get_db)
):
    """
    Obtener lista de alumnos con paginación y búsqueda
    """
    skip = (page - 1) * limit
    alumnos, total = crud_alumno.get_alumnos(db, skip=skip, limit=limit, search=search)
    
    return {
        "success": True,
        "data": alumnos,
        "pagination": {
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": math.ceil(total / limit)
        }
    }

@router.get("/{alumno_id}", response_model=dict)
def get_alumno(alumno_id: int, db: Session = Depends(get_db)):
    """
    Obtener un alumno por ID
    """
    alumno = crud_alumno.get_alumno_by_id(db, alumno_id)
    if not alumno:
        raise HTTPException(status_code=404, detail="Alumno no encontrado")
    
    return {
        "success": True,
        "data": alumno
    }

@router.post("/", response_model=dict, status_code=201)
def create_alumno(alumno: AlumnoCreate, db: Session = Depends(get_db)):
    """
    Crear un nuevo alumno
    """
    # Verificar si ya existe la matrícula
    existing = crud_alumno.get_alumno_by_matricula(db, alumno.matricula)
    if existing:
        raise HTTPException(status_code=409, detail="La matrícula ya está registrada")
    
    new_alumno = crud_alumno.create_alumno(db, alumno)
    
    return {
        "success": True,
        "message": "Alumno creado exitosamente",
        "data": new_alumno
    }

@router.put("/{alumno_id}", response_model=dict)
def update_alumno(alumno_id: int, alumno: AlumnoUpdate, db: Session = Depends(get_db)):
    """
    Actualizar un alumno existente
    """
    updated_alumno = crud_alumno.update_alumno(db, alumno_id, alumno)
    if not updated_alumno:
        raise HTTPException(status_code=404, detail="Alumno no encontrado")
    
    return {
        "success": True,
        "message": "Alumno actualizado exitosamente",
        "data": updated_alumno
    }

@router.delete("/{alumno_id}", response_model=dict)
def delete_alumno(alumno_id: int, db: Session = Depends(get_db)):
    """
    Eliminar un alumno
    """
    success = crud_alumno.delete_alumno(db, alumno_id)
    if not success:
        raise HTTPException(status_code=404, detail="Alumno no encontrado")
    
    return {
        "success": True,
        "message": "Alumno eliminado exitosamente"
    }