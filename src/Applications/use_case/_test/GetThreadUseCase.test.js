const GetThreadUseCase = require('../GetThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('GetThread', () => {
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const mockThread = {
      id: 'thread-123',
      title: 'judul thread',
      body: 'isi content thread',
      date: '2023-10-29 00:00:00',
      username: 'roshit',
    };

    const mockComment = [
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2023-10-29 00:00:00',
        content: 'isi comment',
        is_delete: false,
      },
      {
        id: 'comment-321',
        username: 'muhammad',
        date: '2023-10-29 00:00:00',
        content: 'isi comment 2',
        is_delete: true,
      },
    ];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockThreadRepository.verifyThreadExistence = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockComment));

    /** creating use case instance */
    const getThreadById = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const getThread = await getThreadById.execute('thread-123');

    // Assert
    expect(getThread).toStrictEqual({
      id: 'thread-123',
      title: 'judul thread',
      body: 'isi content thread',
      date: '2023-10-29 00:00:00',
      username: 'roshit',
      comments: [
        {
          id: 'comment-123',
          username: 'dicoding',
          date: '2023-10-29 00:00:00',
          content: 'isi comment',
        },
        {
          id: 'comment-321',
          username: 'muhammad',
          date: '2023-10-29 00:00:00',
          content: '**komentar telah dihapus**',
        },
      ],
    });

    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
    expect(mockCommentRepository.getComment).toBeCalledWith('thread-123');
    expect(mockThreadRepository.verifyThreadExistence).toBeCalled();
  });
});
