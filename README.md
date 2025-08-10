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

- **`application/controllers`**: Controllers that handle HTTP requests and delegate business logic to use cases.
- **`application/usecases`**: Use cases that encapsulate business logic and act as intermediaries between controllers and ports.
- **`domain/models`**: MongoDB schema definitions using Mongoose to structure task and image data.
- **`domain/ports`**: Interfaces that define available operations to interact with business logic, decoupling technical details.
- **`infrastructure/adapters`**: Implementations of ports that handle technical details, such as database interaction and image processing.
- **`infrastructure/app.ts`**: Main application configuration, including middlewares, routes, and use case initialization.
- **`infrastructure/middleware`**: Middlewares that check request validity and handle global errors.
- **`infrastructure/services`**: Auxiliary services that perform specific tasks, such as image processing or variant generation.

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