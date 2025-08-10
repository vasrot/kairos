# Image Tasks API

API REST para procesar imágenes y consultar tareas.

## Arquitectura

La aplicación está diseñada siguiendo una arquitectura modular y escalable, utilizando las siguientes tecnologías y patrones:

1. **Node.js y Express**:
   - Framework principal para construir la API REST.
   - Express se utiliza para manejar rutas, middlewares y controladores.

2. **MongoDB con Mongoose**:
   - Base de datos NoSQL para almacenar tareas e imágenes procesadas.
   - Mongoose se utiliza para definir esquemas y manejar la interacción con la base de datos.

3. **Procesamiento de imágenes con Sharp**:
   - Biblioteca para manipulación de imágenes, como redimensionamiento y conversión de formatos.

4. **Docker**:
   - Contenedores para garantizar un entorno consistente entre desarrollo y producción.
   - Docker Compose para orquestar servicios como MongoDB y la aplicación Node.js.

5. **Swagger**:
   - Documentación interactiva de la API disponible en `/docs`.

### Componentes principales

- **`src/app.ts`**: Configuración principal de la aplicación, incluyendo middlewares y rutas.
- **`src/controllers`**: Contiene los controladores para manejar las solicitudes HTTP.
- **`src/services`**: Lógica de negocio, como creación de tareas y procesamiento de imágenes.
- **`src/models`**: Definición de esquemas de MongoDB utilizando Mongoose.
- **`src/middleware`**: Middlewares para validación y manejo de errores.

## Decisiones tomadas

1. **Middleware centralizado para manejo de errores**:
   - Se implementó un middleware para capturar y gestionar errores globales.
   - Esto asegura que la aplicación sea robusta y proporcione respuestas consistentes.

2. **Procesamiento en segundo plano**:
   - Las imágenes se procesan de manera asíncrona para evitar bloquear las solicitudes HTTP.
   - Esto mejora la experiencia del usuario y la escalabilidad.

3. **Uso de Docker**:
   - Docker garantiza que el entorno de desarrollo y producción sea consistente.
   - MongoDB y la aplicación Node.js están orquestados con Docker Compose.

4. **Pruebas unitarias e integración**:
   - Se implementaron pruebas para garantizar la calidad del código y prevenir regresiones.
   - Jest se utiliza como framework de pruebas.

## Pasos para ejecutar la aplicación

### Requisitos
- Node.js 22+
- Docker / Docker Compose

### Arranque rápido

1. **Crear carpetas de datos**:
   ```bash
   mkdir -p data/input data/output
   ```

2. **Instalar node modules**:
   ```bash
   docker compose run --rm --service-ports app npm i
   ```

3. **Abrir la documentación**:
   Accede a la documentación Swagger en:
   ```
   http://localhost:3000/docs
   ```

4. **Ejecutar API en DEV**:
    ```bash
    docker compose run --rm --service-ports app npm run dev
    ```

### Pruebas

Ejecuta las pruebas con:
```bash
docker compose run --rm --service-ports app npm run test
```

### Notas adicionales
- La aplicación utiliza un archivo `.env` para configurar variables de entorno como `MONGO_URI` y `PORT`.
- Los logs de errores se almacenan en `logs/error.log` para facilitar el monitoreo y depuración.