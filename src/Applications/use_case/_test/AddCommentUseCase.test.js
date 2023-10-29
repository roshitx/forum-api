const AddCommentUseCase = require('../AddCommentUseCase');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('addCommentUseCase', () => {
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
