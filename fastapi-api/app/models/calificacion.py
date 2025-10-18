from sqlalchemy import Column, BigInteger, String, Numeric, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Calificacion(Base):
    __tablename__ = "calificaciones"
    
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    alumno_id = Column(BigInteger, ForeignKey("alumnos.id", ondelete="CASCADE"), nullable=False)
    grupo_id = Column(BigInteger, ForeignKey("grupos.id", ondelete="CASCADE"), nullable=False)
    materia_id = Column(BigInteger, ForeignKey("materias.id", ondelete="CASCADE"), nullable=False)
    evaluacion = Column(String(50), nullable=False)
    calificacion = Column(Numeric(4, 2), nullable=False)
    capturada_por = Column(BigInteger, ForeignKey("profesores.id", ondelete="SET NULL"))
    fecha_captura = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relaciones
    alumno = relationship("Alumno", back_populates="calificaciones")
    grupo = relationship("Grupo", back_populates="calificaciones")
    materia = relationship("Materia", back_populates="calificaciones")
    profesor = relationship("Profesor", foreign_keys=[capturada_por], back_populates="calificaciones")
    
    __table_args__ = (
        UniqueConstraint('alumno_id', 'grupo_id', 'materia_id', 'evaluacion', name='unique_calificacion'),
    )