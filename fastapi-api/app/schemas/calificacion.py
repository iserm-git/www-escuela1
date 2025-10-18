from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime
from decimal import Decimal

class CalificacionBase(BaseModel):
    alumno_id: int = Field(..., gt=0)
    grupo_id: int = Field(..., gt=0)
    materia_id: int = Field(..., gt=0)
    evaluacion: str = Field(..., min_length=1, max_length=50)
    calificacion: float = Field(..., ge=0, le=10)
    capturada_por: Optional[int] = None

class CalificacionCreate(CalificacionBase):
    pass

class CalificacionUpdate(BaseModel):
    calificacion: Optional[float] = Field(None, ge=0, le=10)
    capturada_por: Optional[int] = None

class CalificacionResponse(CalificacionBase):
    id: int
    fecha_captura: datetime
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)