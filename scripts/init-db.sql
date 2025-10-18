-- Crear base de datos
CREATE DATABASE IF NOT EXISTS escuela_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE escuela_db;

-- Tabla: carreras
CREATE TABLE carreras (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  clave VARCHAR(10) NOT NULL UNIQUE COMMENT 'ISC, ITIC, IIND, CP, etc.',
  nombre VARCHAR(200) NOT NULL,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: alumnos
CREATE TABLE alumnos (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  matricula VARCHAR(20) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  apellido_paterno VARCHAR(100),
  apellido_materno VARCHAR(100),
  curp VARCHAR(18) UNIQUE,
  carrera_id BIGINT UNSIGNED,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (carrera_id) REFERENCES carreras(id) ON DELETE SET NULL,
  INDEX idx_matricula (matricula),
  INDEX idx_carrera (carrera_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: profesores
CREATE TABLE profesores (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  clave VARCHAR(20) NOT NULL UNIQUE COMMENT 'Clave empleado',
  nombre VARCHAR(100) NOT NULL,
  apellido_paterno VARCHAR(100),
  apellido_materno VARCHAR(100),
  carrera_id BIGINT UNSIGNED COMMENT 'Adscripción principal',
  email VARCHAR(100),
  telefono VARCHAR(20),
  activo BOOLEAN DEFAULT TRUE,
  fecha_ingreso DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (carrera_id) REFERENCES carreras(id) ON DELETE SET NULL,
  INDEX idx_clave (clave),
  INDEX idx_carrera (carrera_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: materias
CREATE TABLE materias (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  clave VARCHAR(20) NOT NULL UNIQUE,
  nombre VARCHAR(200) NOT NULL,
  creditos SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_clave (clave)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: grupos
CREATE TABLE grupos (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  clave VARCHAR(20) NOT NULL COMMENT 'Ej: ISC-1A',
  nombre VARCHAR(100) NOT NULL,
  carrera_id BIGINT UNSIGNED NOT NULL,
  limite_alumnos SMALLINT UNSIGNED DEFAULT 30,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (carrera_id) REFERENCES carreras(id) ON DELETE CASCADE,
  UNIQUE KEY unique_clave (clave),
  INDEX idx_carrera (carrera_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: grupo_materias (relación muchos a muchos entre grupos y materias)
CREATE TABLE grupo_materias (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  grupo_id BIGINT UNSIGNED NOT NULL,
  materia_id BIGINT UNSIGNED NOT NULL,
  profesor_id BIGINT UNSIGNED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (grupo_id) REFERENCES grupos(id) ON DELETE CASCADE,
  FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE,
  FOREIGN KEY (profesor_id) REFERENCES profesores(id) ON DELETE SET NULL,
  UNIQUE KEY unique_grupo_materia (grupo_id, materia_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: inscripciones (relación Alumno-Grupo)
CREATE TABLE inscripciones (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  alumno_id BIGINT UNSIGNED NOT NULL,
  grupo_id BIGINT UNSIGNED NOT NULL,
  fecha_inscripcion DATE DEFAULT (CURRENT_DATE),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (alumno_id) REFERENCES alumnos(id) ON DELETE CASCADE,
  FOREIGN KEY (grupo_id) REFERENCES grupos(id) ON DELETE CASCADE,
  UNIQUE KEY unique_alumno_grupo (alumno_id, grupo_id),
  INDEX idx_alumno (alumno_id),
  INDEX idx_grupo (grupo_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: asistencias
CREATE TABLE asistencias (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  alumno_id BIGINT UNSIGNED NOT NULL,
  grupo_id BIGINT UNSIGNED NOT NULL,
  materia_id BIGINT UNSIGNED NOT NULL,
  fecha DATE NOT NULL,
  estado ENUM('presente', 'ausente', 'retardo', 'justificado') DEFAULT 'ausente',
  observaciones TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (alumno_id) REFERENCES alumnos(id) ON DELETE CASCADE,
  FOREIGN KEY (grupo_id) REFERENCES grupos(id) ON DELETE CASCADE,
  FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE,
  UNIQUE KEY unique_asistencia (alumno_id, grupo_id, materia_id, fecha),
  INDEX idx_fecha (fecha),
  INDEX idx_alumno (alumno_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: calificaciones
CREATE TABLE calificaciones (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  alumno_id BIGINT UNSIGNED NOT NULL,
  grupo_id BIGINT UNSIGNED NOT NULL,
  materia_id BIGINT UNSIGNED NOT NULL,
  evaluacion VARCHAR(50) NOT NULL COMMENT 'parcial1, parcial2, final, etc.',
  calificacion DECIMAL(4,2) CHECK (calificacion >= 0 AND calificacion <= 10),
  capturada_por BIGINT UNSIGNED COMMENT 'ID del profesor que capturó',
  fecha_captura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (alumno_id) REFERENCES alumnos(id) ON DELETE CASCADE,
  FOREIGN KEY (grupo_id) REFERENCES grupos(id) ON DELETE CASCADE,
  FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE,
  FOREIGN KEY (capturada_por) REFERENCES profesores(id) ON DELETE SET NULL,
  UNIQUE KEY unique_calificacion (alumno_id, grupo_id, materia_id, evaluacion),
  INDEX idx_alumno (alumno_id),
  INDEX idx_grupo_materia (grupo_id, materia_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: usuarios (opcional para autenticación)
CREATE TABLE usuarios (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  tipo ENUM('admin', 'profesor', 'alumno') DEFAULT 'alumno',
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;