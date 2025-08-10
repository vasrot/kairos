import { createTask } from '../../src/services/task.service';

describe('createTask', () => {
  it('assigns a price between 5 and 50', async () => {
    const task = await createTask('tests/fixtures/sample.jpg');
    expect(task.price).toBeGreaterThanOrEqual(5);
    expect(task.price).toBeLessThanOrEqual(50);
  });
});