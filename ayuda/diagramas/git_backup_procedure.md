# 📋 Procedimiento de Respaldo y Recuperación con Git

## 🎯 Objetivo
Este documento detalla el procedimiento para crear ramas de respaldo del proyecto **iserm-git** y cómo recuperar versiones anteriores en caso de fallos.

---

## 📦 PARTE 1: Crear un Respaldo (Branch de Respaldo)

### ✅ Prerrequisitos
- Tener Git instalado en tu sistema
- Acceso al repositorio iserm-git
- Terminal o línea de comandos abierta

### 🔹 Paso 1: Verificar el Estado Actual
```bash
# Verificar en qué rama estás trabajando
git branch

# Verificar el estado de los archivos
git status

# Ver el último commit
git log --oneline -1
```

**📝 Nota:** Asegúrate de estar en la rama principal (main o master) antes de continuar.

---

### 🔹 Paso 2: Guardar Cambios Pendientes

Si tienes cambios sin commitear:

```bash
# Agregar todos los archivos modificados
git add .

# Crear un commit con tus cambios
git commit -m "Cambios antes de crear respaldo - [FECHA]"
```

**Ejemplo:**
```bash
git commit -m "Cambios antes de crear respaldo - 2025-10-18"
```

---

### 🔹 Paso 3: Crear la Rama de Respaldo

#### Opción A: Respaldo Simple (recomendado)
```bash
# Crear rama de respaldo con fecha actual
git branch backup/respaldo-YYYY-MM-DD

# Ejemplo práctico:
git branch backup/respaldo-2025-10-18
```

#### Opción B: Respaldo con Descripción
```bash
# Crear rama con descripción específica
git branch backup/pre-nuevas-funcionalidades-2025-10-18
```

#### Opción C: Respaldo Automático con Fecha/Hora
```bash
# Para Linux/Mac
git branch backup/respaldo-$(date +%Y%m%d-%H%M%S)

# Para Windows PowerShell
git branch backup/respaldo-$(Get-Date -Format "yyyyMMdd-HHmmss")
```

---

### 🔹 Paso 4: Verificar que el Respaldo se Creó Correctamente

```bash
# Listar todas las ramas locales
git branch

# Listar ramas de respaldo específicamente
git branch | grep backup

# Ver el commit al que apunta el respaldo
git log backup/respaldo-2025-10-18 --oneline -1
```

**Salida esperada:**
```
* main
  backup/respaldo-2025-10-18
  desarrollo
```

---

### 🔹 Paso 5: Subir el Respaldo al Repositorio Remoto (Opcional pero Recomendado)

```bash
# Subir la rama de respaldo al servidor remoto
git push origin backup/respaldo-2025-10-18

# Verificar que se subió correctamente
git branch -r | grep backup
```

**📝 Nota:** Esto es importante si trabajas en equipo o quieres tener el respaldo en la nube.

---

### 🔹 Paso 6: Crear un TAG para Identificación Rápida (Opcional)

```bash
# Crear un tag anotado en el punto actual
git tag -a v1.0-respaldo-2025-10-18 -m "Respaldo antes de implementar nuevas funcionalidades"

# Subir el tag al remoto
git push origin v1.0-respaldo-2025-10-18

# Ver todos los tags
git tag -l
```

---

## 🔄 PARTE 2: Recuperar desde un Respaldo

### Escenario 1: Descartar Cambios y Volver al Respaldo (Hard Reset)

⚠️ **ADVERTENCIA:** Esto eliminará TODOS los cambios no guardados.

```bash
# 1. Ver qué ramas de respaldo tienes disponibles
git branch | grep backup

# 2. Cambiar a la rama de respaldo
git checkout backup/respaldo-2025-10-18

# 3. Crear una nueva rama desde este punto
git checkout -b recuperacion-desde-respaldo

# 4. Opcional: Sobrescribir la rama principal
git checkout main
git reset --hard backup/respaldo-2025-10-18
```

**Confirmación:**
```bash
git log --oneline -5
```

---

### Escenario 2: Comparar Cambios Antes de Restaurar (Soft Recovery)

```bash
# Ver diferencias entre la rama actual y el respaldo
git diff main backup/respaldo-2025-10-18

# Ver lista de archivos modificados
git diff --name-only main backup/respaldo-2025-10-18

# Ver estadísticas de cambios
git diff --stat main backup/respaldo-2025-10-18
```

---

### Escenario 3: Recuperar Archivos Específicos del Respaldo

```bash
# Recuperar un archivo específico desde el respaldo
git checkout backup/respaldo-2025-10-18 -- ruta/al/archivo.tsx

# Ejemplo: Recuperar el archivo de Navbar
git checkout backup/respaldo-2025-10-18 -- src/components/Navbar.tsx

# Recuperar una carpeta completa
git checkout backup/respaldo-2025-10-18 -- app/alumnos/
```

---

### Escenario 4: Crear Nueva Rama Desde el Respaldo y Continuar

```bash
# 1. Crear y cambiar a una nueva rama desde el respaldo
git checkout -b nueva-funcionalidad backup/respaldo-2025-10-18

# 2. Verificar que estás en la nueva rama
git branch

# 3. Continuar trabajando normalmente
git add .
git commit -m "Implementando nueva funcionalidad desde punto de respaldo"
```

---

## 🛡️ PARTE 3: Estrategias de Respaldo Recomendadas

### 📅 Nomenclatura de Ramas de Respaldo

```
backup/respaldo-YYYY-MM-DD                    # Respaldo diario
backup/pre-[feature]-YYYY-MM-DD               # Antes de nueva feature
backup/stable-v[version]-YYYY-MM-DD           # Versión estable
backup/pre-deployment-[ambiente]-YYYY-MM-DD   # Antes de despliegue
```

**Ejemplos:**
```bash
git branch backup/respaldo-2025-10-18
git branch backup/pre-auth-system-2025-10-18
git branch backup/stable-v1.0-2025-10-18
git branch backup/pre-deployment-produccion-2025-10-18
```

---

### 🔄 Automatización con Script Bash (Linux/Mac)

Crear archivo `crear-respaldo.sh`:

```bash
#!/bin/bash

# Script para crear respaldo automático del proyecto

# Obtener fecha actual
FECHA=$(date +%Y-%m-%d)
HORA=$(date +%H-%M-%S)
RAMA_ACTUAL=$(git branch --show-current)

# Nombre de la rama de respaldo
RAMA_RESPALDO="backup/respaldo-${RAMA_ACTUAL}-${FECHA}-${HORA}"

echo "🔄 Creando respaldo de la rama: ${RAMA_ACTUAL}"
echo "📦 Nombre del respaldo: ${RAMA_RESPALDO}"

# Verificar si hay cambios sin commitear
if [[ -n $(git status -s) ]]; then
    echo "⚠️  Hay cambios sin commitear. Creando commit automático..."
    git add .
    git commit -m "Auto-commit antes de respaldo - ${FECHA} ${HORA}"
fi

# Crear rama de respaldo
git branch ${RAMA_RESPALDO}

# Verificar que se creó correctamente
if [ $? -eq 0 ]; then
    echo "✅ Respaldo creado exitosamente: ${RAMA_RESPALDO}"
    
    # Preguntar si desea subirlo al remoto
    read -p "¿Deseas subir este respaldo al repositorio remoto? (s/n): " respuesta
    
    if [[ $respuesta == "s" || $respuesta == "S" ]]; then
        git push origin ${RAMA_RESPALDO}
        echo "☁️  Respaldo subido al repositorio remoto"
    fi
else
    echo "❌ Error al crear el respaldo"
    exit 1
fi

# Listar respaldos existentes
echo ""
echo "📋 Respaldos disponibles:"
git branch | grep backup
```

**Uso:**
```bash
chmod +x crear-respaldo.sh
./crear-respaldo.sh
```

---

### 🔄 Script PowerShell para Windows

Crear archivo `Crear-Respaldo.ps1`:

```powershell
# Script para crear respaldo automático del proyecto en Windows

$fecha = Get-Date -Format "yyyy-MM-dd"
$hora = Get-Date -Format "HH-mm-ss"
$ramaActual = git branch --show-current
$ramaRespaldo = "backup/respaldo-$ramaActual-$fecha-$hora"

Write-Host "🔄 Creando respaldo de la rama: $ramaActual" -ForegroundColor Cyan
Write-Host "📦 Nombre del respaldo: $ramaRespaldo" -ForegroundColor Cyan

# Verificar cambios sin commitear
$cambios = git status -s
if ($cambios) {
    Write-Host "⚠️  Hay cambios sin commitear. Creando commit automático..." -ForegroundColor Yellow
    git add .
    git commit -m "Auto-commit antes de respaldo - $fecha $hora"
}

# Crear rama de respaldo
git branch $ramaRespaldo

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Respaldo creado exitosamente: $ramaRespaldo" -ForegroundColor Green
    
    # Preguntar si subir al remoto
    $respuesta = Read-Host "¿Deseas subir este respaldo al repositorio remoto? (s/n)"
    
    if ($respuesta -eq "s" -or $respuesta -eq "S") {
        git push origin $ramaRespaldo
        Write-Host "☁️  Respaldo subido al repositorio remoto" -ForegroundColor Green
    }
} else {
    Write-Host "❌ Error al crear el respaldo" -ForegroundColor Red
    exit 1
}

# Listar respaldos
Write-Host ""
Write-Host "📋 Respaldos disponibles:" -ForegroundColor Cyan
git branch | Select-String "backup"
```

**Uso:**
```powershell
.\Crear-Respaldo.ps1
```

---

## 🚨 PARTE 4: Procedimiento de Emergencia

### Situación: "¡Rompí todo y necesito volver atrás YA!"

```bash
# PASO 1: NO ENTRAR EN PÁNICO 🧘

# PASO 2: Ver qué respaldos tienes disponibles
git branch | grep backup

# PASO 3: Ver el historial de commits
git reflog

# PASO 4: Volver al último respaldo conocido
git reset --hard backup/respaldo-2025-10-18

# PASO 5: Si eso no funciona, usar reflog
git reset --hard HEAD@{5}  # Reemplazar {5} con el número correcto

# PASO 6: Verificar que todo esté bien
git status
git log --oneline -5
```

---

## 📊 PARTE 5: Limpieza de Respaldos Antiguos

### Eliminar Respaldos Locales Antiguos

```bash
# Listar respaldos antiguos (más de 30 días)
git for-each-ref --sort=-committerdate refs/heads/backup/ --format='%(refname:short) %(committerdate:short)'

# Eliminar un respaldo específico
git branch -d backup/respaldo-2025-09-18

# Eliminar forzadamente (si tiene cambios no mergeados)
git branch -D backup/respaldo-2025-09-18

# Eliminar del repositorio remoto
git push origin --delete backup/respaldo-2025-09-18
```

### Script para Limpiar Respaldos Automáticamente

```bash
#!/bin/bash
# Eliminar respaldos locales más antiguos de 30 días

echo "🧹 Limpiando respaldos antiguos..."

git for-each-ref --sort=-committerdate refs/heads/backup/ --format='%(refname:short) %(committerdate:short)' | \
while read rama fecha; do
    dias_antiguedad=$(( ($(date +%s) - $(date -d "$fecha" +%s)) / 86400 ))
    
    if [ $dias_antiguedad -gt 30 ]; then
        echo "Eliminando: $rama (antigüedad: $dias_antiguedad días)"
        git branch -D $rama
    fi
done

echo "✅ Limpieza completada"
```

---

## ✅ Checklist de Respaldo

Antes de hacer cambios importantes:

- [ ] Verificar que estás en la rama correcta (`git branch`)
- [ ] Guardar todos los cambios pendientes (`git status`)
- [ ] Crear commit con cambios actuales (`git commit`)
- [ ] Crear rama de respaldo (`git branch backup/...`)
- [ ] Subir respaldo al remoto (`git push origin backup/...`)
- [ ] Verificar que el respaldo se creó (`git branch | grep backup`)
- [ ] Documentar el propósito del respaldo
- [ ] Continuar con los cambios planificados

---

## 📚 Comandos de Referencia Rápida

```bash
# Crear respaldo
git branch backup/respaldo-$(date +%Y-%m-%d)

# Listar respaldos
git branch | grep backup

# Volver a respaldo
git checkout backup/respaldo-2025-10-18

# Restaurar archivo específico
git checkout backup/respaldo-2025-10-18 -- archivo.tsx

# Ver diferencias
git diff main backup/respaldo-2025-10-18

# Eliminar respaldo local
git branch -D backup/respaldo-2025-10-18

# Eliminar respaldo remoto
git push origin --delete backup/respaldo-2025-10-18

# Ver historial completo (incluso commits perdidos)
git reflog
```

---

## 🎯 Mejores Prácticas

1. **Crear respaldos antes de:**
   - Implementar nuevas funcionalidades importantes
   - Refactorizar código crítico
   - Actualizar dependencias mayores
   - Hacer merge de ramas grandes
   - Desplegar a producción

2. **Nomenclatura consistente:**
   - Usar prefijo `backup/`
   - Incluir fecha en formato ISO (YYYY-MM-DD)
   - Agregar descripción breve del estado

3. **Documentación:**
   - Mantener un registro de respaldos importantes
   - Anotar el propósito de cada respaldo
   - Documentar cambios significativos

4. **Limpieza periódica:**
   - Eliminar respaldos locales antiguos (>30 días)
   - Mantener respaldos importantes con tags
   - Conservar respaldos de versiones en producción

---

## 📞 Soporte y Ayuda

Si tienes problemas:

1. Revisa la sección "Procedimiento de Emergencia"
2. Usa `git reflog` para ver el historial completo
3. Consulta `git help branch` para más información
4. Contacta al equipo de desarrollo

---

**Última actualización:** 2025-10-18  
**Versión del documento:** 1.0  
**Proyecto:** iserm-git
