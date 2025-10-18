from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime

class MateriaBase(BaseModel):
    clave: str = Field(..., min_length=1, max_length=20)
    nombre: str = Field(..., min_length=1, max_length=200)
    creditos: int = Field(default=0, ge=0, le=32767)
    activo: bool = True

class MateriaCreate(MateriaBase):
    pass

class MateriaUpdate(BaseModel):
    clave: Optional[str] = Field(None, min_length=1, max_length=20)
    nombre: Optional[str] = Field(None, min_length=1, max_length=200)
    creditos: Optional[int] = Field(None, ge=0, le=32767)
    activo: Optional[bool] = None

class MateriaResponse(MateriaBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)