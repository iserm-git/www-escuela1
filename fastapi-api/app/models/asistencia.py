from sqlalchemy import Column, BigInteger, String, Date, Text, DateTime, ForeignKey, UniqueConstraint, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class EstadoAsistencia(str, enum.Enum):
    presente = "presente"
    ausente = "ausente"
    retardo = "retardo"
    justificado = "justificado"

class Asistencia(Base):
    __tablename__ = "asistencias"
    
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    alumno_id = Column(BigInteger, ForeignKey("alumnos.id", ondelete="CASCADE"), nullable=False)
    grupo_id = Column(BigInteger, ForeignKey("grupos.id", ondelete="CASCADE"), nullable=False)
    materia_id = Column(BigInteger, ForeignKey("materias.id", ondelete="CASCADE"), nullable=False)
    fecha = Column(Date, nullable=False, index=True)
    estado = Column(Enum(EstadoAsistencia), default=EstadoAsistencia.ausente)
    observaciones = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relaciones
    alumno = relationship("Alumno", back_populates="asistencias")
    grupo = relationship("Grupo", back_populates="asistencias")
    materia = relationship("Materia", back_populates="asistencias")
    
    __table_args__ = (
        UniqueConstraint('alumno_id', 'grupo_id', 'materia_id', 'fecha', name='unique_asistencia'),
    )