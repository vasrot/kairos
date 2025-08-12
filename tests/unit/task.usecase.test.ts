import { TaskUseCase } from '../../application/usecases/task.usecase';
import { TaskRepositoryPort } from '../../domain/ports/task-repository.port';
import { TaskAdapter } from '../../infrastructure/adapters/task.adapter';

// Mock image.service to avoid filesystem and DB writes during unit tests
jest.mock('../../infrastructure/services/image.service', () => ({
    generateVariants: jest.fn().mockResolvedValue([
        { resolution: '1024', path: '/fake/1024/a.jpg' },
        { resolution: '800', path: '/fake/800/b.jpg' },
    ]),
}));

describe('TaskUseCase (unit from use case, only mocking DB)', () => {
    const repo: jest.Mocked<TaskRepositoryPort> = {
        create: jest.fn(),
        findById: jest.fn(),
        markCompleted: jest.fn(),
        markFailed: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    function buildUseCase() {
        const adapter = new TaskAdapter(repo); // real adapter
        return new TaskUseCase(adapter, repo);
    }

    it('createTask returns taskId, pending and price from repository', async () => {
        const useCase = buildUseCase();
        repo.create.mockResolvedValue({ id: '1', status: 'pending', price: 12.34 });

        const res = await useCase.createTask('tests/fixtures/input/test.jpg');

        expect(repo.create).toHaveBeenCalled();
        expect(res).toEqual({ taskId: '1', status: 'pending', price: 12.34 });
    });

    it('getTask returns null when repository has no entity', async () => {
        const useCase = buildUseCase();
        repo.findById.mockResolvedValue(null);

        const res = await useCase.getTask('does-not-exist');

        expect(repo.findById).toHaveBeenCalledWith('does-not-exist');
        expect(res).toBeNull();
    });

    it('getTask maps entity to view model without exposing originalPath', async () => {
        const useCase = buildUseCase();
        const now = new Date();
        repo.findById.mockResolvedValue({
            id: 'abc',
            status: 'completed',
            price: 99.99,
            originalPath: '/some/source.jpg',
            images: [
                { resolution: '1024', path: '/data/out/1024/a.jpg' },
                { resolution: '800', path: '/data/out/800/b.jpg' },
            ],
            createdAt: now,
            updatedAt: now,
        });

        const res = await useCase.getTask('abc');

        expect(repo.findById).toHaveBeenCalledWith('abc');
        expect(res).toEqual({
            taskId: 'abc',
            status: 'completed',
            price: 99.99,
            images: [
                { resolution: '1024', path: '/data/out/1024/a.jpg' },
                { resolution: '800', path: '/data/out/800/b.jpg' },
            ],
        });
        // @ts-expect-error ensure originalPath is not present
        expect(res?.originalPath).toBeUndefined();
    });
});
