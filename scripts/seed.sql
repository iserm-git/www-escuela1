-- Insertar carreras
INSERT INTO carreras (clave, nombre) VALUES
('ISC', 'Ingeniería en Sistemas Computacionales'),
('ITIC', 'Ingeniería en Tecnologías de la Información y Comunicaciones'),
('IIND', 'Ingeniería Industrial'),
('CP', 'Contador Público'),
('IIA', 'Ingeniería en Industrias Alimentarias'),
('IGE', 'Ingeniería en Gestión Empresarial'),
('IE', 'Ingeniería Electromecánica'),
('IIAS', 'Ingeniería en Innovación Agrícola Sustentable'),
('ARQ', 'Arquitectura');

-- Insertar profesores de ejemplo
INSERT INTO profesores (clave, nombre, apellido_paterno, apellido_materno, carrera_id, email, telefono, fecha_ingreso) VALUES
('PROF001', 'María', 'González', 'López', 1, 'maria.gonzalez@example.com', '444-123-4567', '2020-08-15'),
('PROF002', 'Juan', 'Martínez', 'Pérez', 2, 'juan.martinez@example.com', '444-234-5678', '2019-01-10'),
('PROF003', 'Ana', 'Rodríguez', 'Sánchez', 3, 'ana.rodriguez@example.com', NULL, '2021-08-15');

-- Insertar materias de ejemplo
INSERT INTO materias (clave, nombre, creditos) VALUES
('MAT001', 'Cálculo Diferencial', 5),
('MAT002', 'Programación Orientada a Objetos', 5),
('MAT003', 'Bases de Datos', 4),
('MAT004', 'Contabilidad Financiera', 4);

-- Insertar grupos
INSERT INTO grupos (clave, nombre, carrera_id, limite_alumnos) VALUES
('ISC-1A', '1er Semestre Grupo A', 1, 35),
('ISC-3A', '3er Semestre Grupo A', 1, 30),
('ITIC-1A', '1er Semestre Grupo A', 2, 30);

-- Insertar alumnos
INSERT INTO alumnos (matricula, nombre, apellido_paterno, apellido_materno, curp, carrera_id) VALUES
('A20240001', 'Carlos', 'López', 'García', 'LOGC010101HSLPRA01', 1),
('A20240002', 'Laura', 'Hernández', 'Martínez', 'HEML020202MSLRNR02', 1),
('A20240003', 'Roberto', 'Pérez', 'Sánchez', 'PESR030303HSLRZB03', 2);
                       # Documentación principal