from sqlalchemy import Column, BigInteger, String, Boolean, DateTime, Date, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Profesor(Base):
    __tablename__ = "profesores"
    
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    clave = Column(String(20), unique=True, nullable=False, index=True)
    nombre = Column(String(100), nullable=False)
    apellido_paterno = Column(String(100))
    apellido_materno = Column(String(100))
    carrera_id = Column(BigInteger, ForeignKey("carreras.id", ondelete="SET NULL"))
    email = Column(String(100))
    telefono = Column(String(20))
    activo = Column(Boolean, default=True)
    fecha_ingreso = Column(Date)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relaciones
    carrera = relationship("Carrera", back_populates="profesores")
    grupo_materias = relationship("GrupoMateria", back_populates="profesor")
    calificaciones = relationship("Calificacion", foreign_keys="Calificacion.capturada_por", back_populates="profesor")