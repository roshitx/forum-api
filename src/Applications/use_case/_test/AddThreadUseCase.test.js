const AddThreadUseCase = require('../AddThreadUseCase');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'Thread Title',
      body: 'Thread Body',
    };

    const expectedAddedThread = new AddThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
    });

    const credentialId = 'user-123';

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedAddedThread));

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(
      useCasePayload,
      credentialId,
    );

    // Assert
    expect(addedThread).toStrictEqual(
      new AddThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
      }),
    );

    expect(mockThreadRepository.addThread).toHaveBeenCalledWith(
      new AddThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
      }),
      credentialId,
    );
  });

  it('should throw error if credentialId is not a string', async () => {
    // Arrange
    const useCasePayload = {
      title: 'Thread Title',
      body: 'Thread Body',
    };
    const credentialId = 123;

    const mockThreadRepository = new ThreadRepository();

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(
      addThreadUseCase.execute(useCasePayload, credentialId),
    ).rejects.toThrow('ADD_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error if credentialId is missing', async () => {
    // Arrange
    const useCasePayload = {
      title: 'Thread Title',
      body: 'Thread Body',
    };

    const mockThreadRepository = new ThreadRepository();

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(
      addThreadUseCase.execute(useCasePayload, null),
    ).rejects.toThrow('ADD_THREAD_USE_CASE.NOT_CONTAIN_CREDENTIAL_ID');
  });
});
