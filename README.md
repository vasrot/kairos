# Image Tasks API

API REST para procesar imágenes y consultar tareas.

## Requisitos
- Node 22
- Docker / Docker Compose

## Arranque rápido
```bash
# 1) Create data directories for the images
mkdir -p data/input data/output

# 2) Install node modules
docker compose run --rm --service-ports app npm i

# 3) Open API docs
http://localhost:3000/docs

# 4) Run in dev mode
docker compose run --rm --service-ports app npm run dev

# 5) Hacer tests
docker compose run --rm --service-ports app npm run test -- --detectOpenHandles