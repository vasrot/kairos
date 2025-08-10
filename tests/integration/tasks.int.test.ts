import { createTask } from "../../src/services/task.service";
import '../setup';

describe('Integration Test Example', () => {
  it('should always pass', () => {
    expect(true).toBe(true);
  });

  it('should create a task', async () => {
    const task = await createTask('/app/tests/fixtures/test.jpg');
    expect(task).toBeDefined();
    expect(task.status).toBe('pending');
  });
});