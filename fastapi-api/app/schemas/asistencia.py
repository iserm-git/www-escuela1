from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime, date
from app.models.asistencia import EstadoAsistencia

class AsistenciaBase(BaseModel):
    alumno_id: int = Field(..., gt=0)
    grupo_id: int = Field(..., gt=0)
    materia_id: int = Field(..., gt=0)
    fecha: date
    estado: EstadoAsistencia = EstadoAsistencia.ausente
    observaciones: Optional[str] = None

class AsistenciaCreate(AsistenciaBase):
    pass

class AsistenciaUpdate(BaseModel):
    estado: Optional[EstadoAsistencia] = None
    observaciones: Optional[str] = None

class AsistenciaResponse(AsistenciaBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)