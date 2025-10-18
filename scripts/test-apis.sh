#!/bin/bash

echo "========================================="
echo "TESTING NODE.JS API (Puerto 3000)"
echo "========================================="

echo -e "\n1. Health Check Node..."
curl -s http://localhost:3000/health | jq

echo -e "\n2. Listar alumnos Node..."
curl -s http://localhost:3000/api/alumnos?page=1&limit=5 | jq

echo -e "\n3. Crear alumno Node..."
curl -s -X POST http://localhost:3000/api/alumnos \
  -H "Content-Type: application/json" \
  -d '{
    "matricula": "TEST001",
    "nombre": "Test Node",
    "apellidoPaterno": "Usuario",
    "carreraId": 1
  }' | jq

echo -e "\n========================================="
echo "TESTING FASTAPI (Puerto 8000)"
echo "========================================="

echo -e "\n1. Health Check FastAPI..."
curl -s http://localhost:8000/health | jq

echo -e "\n2. Listar alumnos FastAPI..."
curl -s http://localhost:8000/api/v1/alumnos?page=1&limit=5 | jq

echo -e "\n3. Crear alumno FastAPI..."
curl -s -X POST http://localhost:8000/api/v1/alumnos \
  -H "Content-Type: application/json" \
  -d '{
    "matricula": "TEST002",
    "nombre": "Test FastAPI",
    "apellido_paterno": "Usuario",
    "carrera_id": 1
  }' | jq

echo -e "\n========================================="
echo "TESTS COMPLETADOS"
echo "========================================="