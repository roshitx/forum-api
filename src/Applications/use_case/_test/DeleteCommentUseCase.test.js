const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('DeleteCommentUseCase', () => {
  it('should successfully delete a comment', async () => {
    // Arrange
    const credentialId = 'user-123';
    const threadId = 'thread-456';
    const commentId = 'comment-789';

    // Mock dependencies
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // Mock the required functions
    mockThreadRepository.verifyThreadExistence = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExistence = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyUserComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    // Create an instance of DeleteCommentUseCase
    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Act and Assert
    await expect(
      deleteCommentUseCase.execute(credentialId, threadId, commentId),
    ).resolves.not.toThrowError();
    expect(mockThreadRepository.verifyThreadExistence).toHaveBeenCalledWith(
      threadId,
    );
    expect(mockCommentRepository.verifyCommentExistence).toHaveBeenCalledWith(
      commentId,
    );
    expect(mockCommentRepository.verifyUserComment).toHaveBeenCalledWith(
      commentId,
      credentialId,
    );
    expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(
      credentialId,
      threadId,
      commentId,
    );
  });

  it('should throw an error if credentialId is not a string', async () => {
    // Arrange
    const credentialId = 123;
    const threadId = 'thread-456';
    const commentId = 'comment-789';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Act & Assert
    await expect(
      deleteCommentUseCase.execute(credentialId, threadId, commentId),
    ).rejects.toThrow('DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw an error if credentialId is missing', async () => {
    // Arrange
    const credentialId = null;
    const threadId = 'thread-456';
    const commentId = 'comment-789';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Act & Assert
    await expect(
      deleteCommentUseCase.execute(credentialId, threadId, commentId),
    ).rejects.toThrow('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });
});
