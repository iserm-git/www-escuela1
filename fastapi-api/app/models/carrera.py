from sqlalchemy import Column, BigInteger, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Carrera(Base):
    __tablename__ = "carreras"
    
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    clave = Column(String(10), unique=True, nullable=False, index=True)
    nombre = Column(String(200), nullable=False)
    activo = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relaciones
    alumnos = relationship("Alumno", back_populates="carrera")
    profesores = relationship("Profesor", back_populates="carrera")
    grupos = relationship("Grupo", back_populates="carrera")