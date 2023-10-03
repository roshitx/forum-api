const AddCommentUseCase = require('../AddCommentUseCase');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('addCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    const userId = 'user-id_testing';
    const threadId = 'thread-id_testing';
    const useCasePayload = {
      content: 'Comment Content Testing',
    };

    const expectedAddComment = new AddComment({
      id: 'comment-id_testing',
      content: useCasePayload.content,
      owner: userId,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.isThreadExists = jest.fn(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn(() => Promise.resolve(
      new AddComment({
        id: 'comment-id_testing',
        content: useCasePayload.content,
        owner: userId,
      }),
    ));

    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const addComment = await addCommentUseCase.execute(
      userId,
      threadId,
      useCasePayload,
    );

    expect(addComment).toStrictEqual(expectedAddComment);
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new NewComment(userId, threadId, useCasePayload),
    );
    expect(mockThreadRepository.isThreadExists).toBeCalledWith(threadId);
  });
});
