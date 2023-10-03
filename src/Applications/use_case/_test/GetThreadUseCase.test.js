const GetThreadUseCase = require('../GetThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');

describe('FindThreadById', () => {
  it('should orchestrating the get thread action correctly', async () => {
    const expectedThread = new DetailThread({
      id: 'thread-id_testing',
      title: 'Thread Title Testing',
      body: 'Thread Body Testing',
      date: '2023-09-26 09:00:00.012345',
      username: 'roshit',
      comments: [
        new DetailComment({
          id: 'comment-id_testing1',
          content: 'Comment Content Test',
          date: '2023-09-26 09:00:00.012345',
          username: 'dicoding',
          isDelete: false,
        }),
        new DetailComment({
          id: 'comment-_id_testing2',
          content: 'Comment Content 2',
          date: '2022-04-04 04:04:06.012345',
          username: 'markliu',
          isDelete: true,
        }),
      ],
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockThreadRepository.isThreadExists = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const getThreadById = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const getThread = await getThreadById.execute('thread-id_testing');

    expect(getThread).toStrictEqual(expectedThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      'thread-id_testing',
    );
    expect(mockThreadRepository.isThreadExists).toBeCalled();
  });
});
