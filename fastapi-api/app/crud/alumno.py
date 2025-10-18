from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from app.models import Alumno
from app.schemas.alumno import AlumnoCreate, AlumnoUpdate

def get_alumnos(
    db: Session,
    skip: int = 0,
    limit: int = 10,
    search: Optional[str] = None
) -> tuple[List[Alumno], int]:
    query = db.query(Alumno)
    
    if search:
        query = query.filter(
            or_(
                Alumno.nombre.contains(search),
                Alumno.matricula.contains(search),
                Alumno.apellido_paterno.contains(search),
                Alumno.apellido_materno.contains(search)
            )
        )
    
    total = query.count()
    alumnos = query.offset(skip).limit(limit).all()
    
    return alumnos, total

def get_alumno_by_id(db: Session, alumno_id: int) -> Optional[Alumno]:
    return db.query(Alumno).filter(Alumno.id == alumno_id).first()

def get_alumno_by_matricula(db: Session, matricula: str) -> Optional[Alumno]:
    return db.query(Alumno).filter(Alumno.matricula == matricula).first()

def create_alumno(db: Session, alumno: AlumnoCreate) -> Alumno:
    db_alumno = Alumno(**alumno.model_dump())
    db.add(db_alumno)
    db.commit()
    db.refresh(db_alumno)
    return db_alumno

def update_alumno(db: Session, alumno_id: int, alumno: AlumnoUpdate) -> Optional[Alumno]:
    db_alumno = get_alumno_by_id(db, alumno_id)
    if not db_alumno:
        return None
    
    update_data = alumno.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_alumno, field, value)
    
    db.commit()
    db.refresh(db_alumno)
    return db_alumno

def delete_alumno(db: Session, alumno_id: int) -> bool:
    db_alumno = get_alumno_by_id(db, alumno_id)
    if not db_alumno:
        return False
    
    db.delete(db_alumno)
    db.commit()
    return True