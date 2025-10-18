from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime

class GrupoBase(BaseModel):
    clave: str = Field(..., min_length=1, max_length=20)
    nombre: str = Field(..., min_length=1, max_length=100)
    carrera_id: int = Field(..., gt=0)
    limite_alumnos: int = Field(default=30, ge=1, le=100)

class GrupoCreate(GrupoBase):
    pass

class GrupoUpdate(BaseModel):
    clave: Optional[str] = Field(None, min_length=1, max_length=20)
    nombre: Optional[str] = Field(None, min_length=1, max_length=100)
    carrera_id: Optional[int] = Field(None, gt=0)
    limite_alumnos: Optional[int] = Field(None, ge=1, le=100)

class GrupoResponse(GrupoBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class GrupoWithStats(GrupoResponse):
    alumnos_inscritos: int = 0