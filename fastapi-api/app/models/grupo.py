from sqlalchemy import Column, BigInteger, String, SmallInteger, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Grupo(Base):
    __tablename__ = "grupos"
    
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    clave = Column(String(20), unique=True, nullable=False)
    nombre = Column(String(100), nullable=False)
    carrera_id = Column(BigInteger, ForeignKey("carreras.id", ondelete="CASCADE"), nullable=False)
    limite_alumnos = Column(SmallInteger, default=30)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relaciones
    carrera = relationship("Carrera", back_populates="grupos")
    inscripciones = relationship("Inscripcion", back_populates="grupo", cascade="all, delete-orphan")
    grupo_materias = relationship("GrupoMateria", back_populates="grupo", cascade="all, delete-orphan")
    asistencias = relationship("Asistencia", back_populates="grupo")
    calificaciones = relationship("Calificacion", back_populates="grupo")