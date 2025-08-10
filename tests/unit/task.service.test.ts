jest.mock('../../domain/models/task.model');
jest.mock('../../infrastructure/services/image.service');

describe('task.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('dummy test that always passes', () => {
    expect(true).toBe(true);
  });
});
