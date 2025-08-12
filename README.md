# Image Tasks API

REST API for processing images and managing tasks.

## Architecture

The application is designed following a hexagonal architecture (infrastructure, application, and domain), ensuring quality with tests:

1. **Node.js and Express**:
   - Main framework for building the REST API.
   - Express is used to handle routes, middlewares, and controllers.

2. **MongoDB with Mongoose**:
   - NoSQL database to store tasks and processed images.
   - Mongoose is used to define schemas and manage database interaction.

3. **Image processing with Sharp**:
   - Library for image manipulation, such as resizing and format conversion.

4. **Docker**:
   - Containers to ensure a consistent environment between development and production.
   - Docker Compose to orchestrate services like MongoDB and the Node.js application.

5. **Swagger**:
   - Interactive API documentation available at `/docs`.

### Main Components

- `application/usecases`: Application layer use cases. Example: `TaskUseCase` orchestrates the ports to create tasks and map results.
- `domain/models`: Pure domain models (TypeScript types/interfaces), e.g. `TaskEntity`, `TaskImage`, `TaskStatus`.
- `domain/ports`: Ports that define domain contracts: `TaskPort`, `TaskRepositoryPort`.
- `infrastructure/adapters`: Adapters that implement ports:
   - `TaskAdapter` implements `TaskPort` and triggers background image processing.
   - `TaskRepositoryAdapter` implements `TaskRepositoryPort` on top of Mongo/Mongoose.
- `infrastructure/web/controllers`: HTTP controllers (e.g. `TasksController`).
- `infrastructure/routes`: Express route definitions (e.g. `tasks.routes.ts`).
- `infrastructure/persistence/mongoose`: Mongoose models/schemas for MongoDB (`task.model.ts`, `image.model.ts`).
- `infrastructure/services`: Technical services such as `image.service.ts` (Sharp, I/O, variants).
- `infrastructure/middleware`: Validation and error handling middlewares.
- `infrastructure/logger`: Simple reusable logger (`logger.ts`).
- `infrastructure/app.ts`: Express app assembly (middlewares, routes, static files).
- `infrastructure/index.ts`: Server entry point and dependency injection.
- `infrastructure/db.ts`: Mongo connection with Mongoose.
- `utils/md5.ts`: Shared utilities.
- `tests/`: Unit and integration tests (unit: focused on use cases mocking only the DB; integration: full HTTP flow).

## Decisions Made

1. **Centralized error handling middleware**:
   - A middleware was implemented to capture and manage global errors.
   - This ensures the application is robust and provides consistent responses.

2. **Background processing**:
   - Images are processed asynchronously to avoid blocking HTTP requests.
   - This improves user experience and scalability.

3. **Image is not saved if detected as duplicate**:
   - If the image's md5 matches an existing one in the database, it is not saved for efficiency.

4. **Generated images are public**
   - Generated images can be viewed from the browser at localhost:3000/output/${name}/${resolution}/${md5}.${extension}

4. **Use of Docker**:
   - Docker ensures that the development and production environments are consistent.
   - MongoDB and the Node.js application are orchestrated with Docker Compose.

5. **Unit and integration tests**:
   - Tests were implemented to ensure code quality and prevent regressions.
   - Jest is used as the testing framework.

## Steps to Run the Application

### Requirements
- Node.js 22+
- Docker / Docker Compose

### Steps to Run the Application

1. **Create data folders**:
    The input directory is for images you want to upload.
    The output is for the results.
   ```bash
   mkdir -p data/input data/output
   ```

2. **Install node modules**:
   ```bash
   docker compose run --rm --service-ports app npm i
   ```

3. **Run Mongo**:
    ```bash
    docker compose -f 'docker-compose.yml' up -d --build 'mongo'
    ```

4. **Run API in DEV**:
    ```bash
    docker compose run --rm --service-ports app npm run dev
    ```

4. **Open the documentation**:
   Access the Swagger documentation at:
   ```
   http://localhost:3000/docs
   ```

5. **Make a POST with a local image**:
   Since you are in a container, the path should follow this example:
   ```
   /app/data/input/test-image.jpg
   ```
   The image test-image.jpg already exists for convenience.

### Tests
- First, make sure the development node container is stopped; otherwise, there will be port conflicts.
Run the tests with:
```bash
docker compose run --rm --service-ports app npm run test
```

### Additional Notes
- The application uses a `.env` file to configure environment variables such as `MONGO_URI` and `PORT`.
- Error logs are stored in `logs/error.log` to facilitate monitoring and debugging.