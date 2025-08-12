import { TaskUseCase } from '../../application/usecases/task.usecase';
import { TaskPort } from '../../domain/ports/task.port';

describe('TaskUseCase', () => {
  const mockPort: jest.Mocked<TaskPort> = {
    createTask: jest.fn(),
    getTask: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('delegates createTask to port and returns result', async () => {
    const useCase = new TaskUseCase(mockPort);
    mockPort.createTask.mockResolvedValue({ taskId: '1', status: 'pending', price: 9.99 });
    const res = await useCase.createTask('source.jpg');
    expect(mockPort.createTask).toHaveBeenCalledWith('source.jpg');
    expect(res).toEqual({ taskId: '1', status: 'pending', price: 9.99 });
  });

  it('delegates getTask to port and returns domain view model', async () => {
    const useCase = new TaskUseCase(mockPort);
    mockPort.getTask.mockResolvedValue({ taskId: '1', status: 'completed', price: 10, images: [{ resolution: '800', path: '/x.jpg' }] });
    const res = await useCase.getTask('1');
    expect(mockPort.getTask).toHaveBeenCalledWith('1');
    expect(res?.status).toBe('completed');
  });
});
