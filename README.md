# Image Tasks API

API REST para procesar imágenes y consultar tareas.

## Requisitos
- Node 22
- Docker / Docker Compose

## Arranque rápido
```bash
# 1) Crear carpetas de datos
mkdir -p data/input data/output

# 2) Levantar servicios
docker compose up --build

# 3) Abrir docs
http://localhost:3000/docs

docker compose run --rm --service-ports app npm run dev