from sqlalchemy import Column, BigInteger, Date, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Inscripcion(Base):
    __tablename__ = "inscripciones"
    
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    alumno_id = Column(BigInteger, ForeignKey("alumnos.id", ondelete="CASCADE"), nullable=False)
    grupo_id = Column(BigInteger, ForeignKey("grupos.id", ondelete="CASCADE"), nullable=False)
    fecha_inscripcion = Column(Date, server_default=func.current_date())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relaciones
    alumno = relationship("Alumno", back_populates="inscripciones")
    grupo = relationship("Grupo", back_populates="inscripciones")
    
    __table_args__ = (
        UniqueConstraint('alumno_id', 'grupo_id', name='unique_alumno_grupo'),
    )