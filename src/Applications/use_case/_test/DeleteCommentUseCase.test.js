const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    const userId = 'user-id_testing';
    const threadId = 'thread-id_testing';
    const commentId = 'comment-id_testing';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.isThreadExists = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyUserComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.test = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await expect(
      deleteCommentUseCase.execute(userId, threadId, commentId),
    ).resolves.not.toThrowError();
    expect(mockThreadRepository.isThreadExists).toBeCalledWith(threadId);
    expect(mockCommentRepository.deleteComment).toBeCalledWith(
      userId,
      threadId,
      commentId,
    );
    expect(mockCommentRepository.verifyUserComment).toBeCalledWith(
      userId,
      commentId,
    );
  });
});
