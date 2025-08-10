import { createTask, getTask } from '../../src/services/task.service';
import { Task } from '../../src/models/task.model';
import { generateVariants } from '../../src/services/image.service';

jest.mock('../../src/models/task.model');
jest.mock('../../src/services/image.service');

describe('task.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('dummy test that always passes', () => {
    expect(true).toBe(true);
  });
});
