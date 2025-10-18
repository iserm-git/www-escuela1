from sqlalchemy import Column, BigInteger, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Alumno(Base):
    __tablename__ = "alumnos"
    
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    matricula = Column(String(20), unique=True, nullable=False, index=True)
    nombre = Column(String(100), nullable=False)
    apellido_paterno = Column(String(100))
    apellido_materno = Column(String(100))
    curp = Column(String(18), unique=True)
    carrera_id = Column(BigInteger, ForeignKey("carreras.id", ondelete="SET NULL"))
    activo = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relaciones
    carrera = relationship("Carrera", back_populates="alumnos")
    inscripciones = relationship("Inscripcion", back_populates="alumno", cascade="all, delete-orphan")
    asistencias = relationship("Asistencia", back_populates="alumno", cascade="all, delete-orphan")
    calificaciones = relationship("Calificacion", back_populates="alumno", cascade="all, delete-orphan")