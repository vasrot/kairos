import { TaskUseCase } from '../../application/usecases/task.usecase';
import { TaskPort } from '../../domain/ports/task.port';
import { TaskRepositoryPort } from '../../domain/ports/task-repository.port';

describe('TaskUseCase', () => {
  const mockPort: jest.Mocked<TaskPort> = {
    createTask: jest.fn(),
    getTask: jest.fn(),
  };
  const mockRepo: jest.Mocked<TaskRepositoryPort> = {
    create: jest.fn(),
    findById: jest.fn(),
    markCompleted: jest.fn(),
    markFailed: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('delegates createTask to port and returns result', async () => {
    const useCase = new TaskUseCase(mockPort, mockRepo);
    mockPort.createTask.mockResolvedValue({ taskId: '1', status: 'pending', price: 9.99 });
    const res = await useCase.createTask('source.jpg');
    expect(mockPort.createTask).toHaveBeenCalledWith('source.jpg');
    expect(res).toEqual({ taskId: '1', status: 'pending', price: 9.99 });
  });

  it('delegates getTask to port and returns domain view model', async () => {
    const useCase = new TaskUseCase(mockPort, mockRepo);
    mockRepo.findById.mockResolvedValue({
      id: '1',
      status: 'completed',
      price: 10,
      originalPath: 'source.jpg',
      images: [{ resolution: '800', path: '/x.jpg' }],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const res = await useCase.getTask('1');
    expect(mockRepo.findById).toHaveBeenCalledWith('1');
    expect(res?.status).toBe('completed');
  });
});
