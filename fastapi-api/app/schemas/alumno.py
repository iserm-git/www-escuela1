from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime

# Schema base
class AlumnoBase(BaseModel):
    matricula: str = Field(..., min_length=1, max_length=20)
    nombre: str = Field(..., min_length=1, max_length=100)
    apellido_paterno: Optional[str] = Field(None, max_length=100)
    apellido_materno: Optional[str] = Field(None, max_length=100)
    curp: Optional[str] = Field(None, min_length=18, max_length=18)
    carrera_id: Optional[int] = None
    activo: bool = True

# Schema para crear
class AlumnoCreate(AlumnoBase):
    pass

# Schema para actualizar
class AlumnoUpdate(BaseModel):
    matricula: Optional[str] = Field(None, min_length=1, max_length=20)
    nombre: Optional[str] = Field(None, min_length=1, max_length=100)
    apellido_paterno: Optional[str] = Field(None, max_length=100)
    apellido_materno: Optional[str] = Field(None, max_length=100)
    curp: Optional[str] = Field(None, min_length=18, max_length=18)
    carrera_id: Optional[int] = None
    activo: Optional[bool] = None

# Schema de respuesta (incluye ID y timestamps)
class AlumnoResponse(AlumnoBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# Schema con carrera incluida
class AlumnoWithCarrera(AlumnoResponse):
    carrera: Optional[dict] = None