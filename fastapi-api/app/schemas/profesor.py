from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional
from datetime import datetime, date

class ProfesorBase(BaseModel):
    clave: str = Field(..., min_length=1, max_length=20)
    nombre: str = Field(..., min_length=1, max_length=100)
    apellido_paterno: Optional[str] = Field(None, max_length=100)
    apellido_materno: Optional[str] = Field(None, max_length=100)
    carrera_id: Optional[int] = None
    email: Optional[EmailStr] = None
    telefono: Optional[str] = Field(None, max_length=20)
    activo: bool = True
    fecha_ingreso: Optional[date] = None

class ProfesorCreate(ProfesorBase):
    pass

class ProfesorUpdate(BaseModel):
    clave: Optional[str] = Field(None, min_length=1, max_length=20)
    nombre: Optional[str] = Field(None, min_length=1, max_length=100)
    apellido_paterno: Optional[str] = Field(None, max_length=100)
    apellido_materno: Optional[str] = Field(None, max_length=100)
    carrera_id: Optional[int] = None
    email: Optional[EmailStr] = None
    telefono: Optional[str] = Field(None, max_length=20)
    activo: Optional[bool] = None
    fecha_ingreso: Optional[date] = None

class ProfesorResponse(ProfesorBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)