from sqlalchemy import Column, BigInteger, String, SmallInteger, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Materia(Base):
    __tablename__ = "materias"
    
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    clave = Column(String(20), unique=True, nullable=False, index=True)
    nombre = Column(String(200), nullable=False)
    creditos = Column(SmallInteger, default=0)
    activo = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relaciones
    grupo_materias = relationship("GrupoMateria", back_populates="materia")
    asistencias = relationship("Asistencia", back_populates="materia")
    calificaciones = relationship("Calificacion", back_populates="materia")