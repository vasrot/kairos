import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

dotenv.config({ path: '.env' });

const TEST_DB_URI = process.env.TEST_MONGO_URI || 'mongodb://localhost:27017/image_tasks_test';
const TEST_OUTPUT_DIR = path.resolve('tests/fixtures');

beforeAll(async () => {

  await mongoose.connect(TEST_DB_URI);
});

afterAll(async () => {
  // Drop the test database
  // await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});