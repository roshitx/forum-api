const AddCommentUseCase = require('../AddCommentUseCase');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('addCommentUseCase', () => {
  it('should throw error if credentialId is missing', async () => {
    // Arrange
    const useCasePayload = {
      content: 'comment content',
    };
    const threadId = 'thread-123';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(
      addCommentUseCase.execute(useCasePayload, threadId, null),
    ).rejects.toThrow('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if credentialId is not a string', async () => {
    // Arrange
    const useCasePayload = {
      content: 'comment content',
    };
    const threadId = 'thread-123';
    const credentialId = 123;

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(
      addCommentUseCase.execute(useCasePayload, threadId, credentialId),
    ).rejects.toThrow('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should add a comment to a thread correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'comment content',
    };
    const threadId = 'thread-123';
    const credentialId = 'user-123';

    const expectedAddComment = new AddComment(useCasePayload, threadId);

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadExistence = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedAddComment));

    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(
      useCasePayload,
      threadId,
      credentialId,
    );

    // Assert
    expect(addedComment).toStrictEqual(new AddComment({
      content: useCasePayload.content,
    }, threadId));
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new AddComment(useCasePayload, threadId),
      credentialId,
    );
    expect(mockThreadRepository.verifyThreadExistence).toBeCalledWith(threadId);
  });
});
