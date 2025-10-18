from app.core.database import Base
from .carrera import Carrera
from .alumno import Alumno
from .profesor import Profesor
from .materia import Materia
from .grupo import Grupo
from .inscripcion import Inscripcion
from .asistencia import Asistencia, EstadoAsistencia
from .calificacion import Calificacion

# GrupoMateria (tabla intermedia)
from sqlalchemy import Column, BigInteger, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

class GrupoMateria(Base):
    __tablename__ = "grupo_materias"
    
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    grupo_id = Column(BigInteger, ForeignKey("grupos.id", ondelete="CASCADE"), nullable=False)
    materia_id = Column(BigInteger, ForeignKey("materias.id", ondelete="CASCADE"), nullable=False)
    profesor_id = Column(BigInteger, ForeignKey("profesores.id", ondelete="SET NULL"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relaciones
    grupo = relationship("Grupo", back_populates="grupo_materias")
    materia = relationship("Materia", back_populates="grupo_materias")
    profesor = relationship("Profesor", back_populates="grupo_materias")
    
    __table_args__ = (
        UniqueConstraint('grupo_id', 'materia_id', name='unique_grupo_materia'),
    )