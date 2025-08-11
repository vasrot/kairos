import { TaskUseCase } from '../../application/usecases/task.usecase';
import { TaskAdapter } from '../../infrastructure/adapters/task.adapter';
import { ITask } from '../../domain/models/task.model';

jest.mock('../../infrastructure/adapters/task.adapter');

const mockTaskAdapter = new TaskAdapter() as jest.Mocked<TaskAdapter>;
const taskUseCase = new TaskUseCase(mockTaskAdapter);

describe('TaskUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a task successfully', async () => {
    const mockTask: ITask = {
      taskId: '1',
      id: '1',
      status: 'pending',
      price: 100,
      originalPath: '/path/to/image.jpg',
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockTaskAdapter.createTask.mockResolvedValue(mockTask);

    const result = await taskUseCase.createTask('/path/to/image.jpg');

    expect(result).toEqual(mockTask);
    expect(mockTaskAdapter.createTask).toHaveBeenCalledWith('/path/to/image.jpg');
  });

  it('should retrieve a task successfully', async () => {
    const mockTask: ITask = {
      taskId: '1',
      id: '1',
      status: 'completed',
      price: 100,
      originalPath: '/path/to/image.jpg',
      images: [{ resolution: '800x600', path: '/path/to/image_800x600.jpg' }],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockTaskAdapter.getTask.mockResolvedValue(mockTask);

    const result = await taskUseCase.getTask('1');

    expect(result).toEqual(mockTask);
    expect(mockTaskAdapter.getTask).toHaveBeenCalledWith('1');
  });
});
