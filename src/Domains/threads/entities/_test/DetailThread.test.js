const DetailThread = require('../DetailThread');
const DetailComment = require('../../../comments/entities/DetailComment');

describe('an DetailThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'thread-id_testing',
      title: 'Thread Title Testing',
      body: 'Thread Body Testing',
      date: '2023-09-26 09:00:00.12345',
    };

    expect(() => new DetailThread(payload)).toThrowError(
      'DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 12345,
      title: 'Thread Title Testing',
      body: 'Thread Body Testing',
      date: '2023-09-26 09:00:00.12345',
      username: true,
      comments: {},
    };

    expect(() => new DetailThread(payload)).toThrowError(
      'DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create threadDetail object correctly', () => {
    const payload = {
      id: 'thread-id_testing',
      title: 'Thread Title Testing',
      body: 'Thread Body Testing',
      date: '2023-09-26 09:00:00.12345',
      username: 'roshit',
      comments: [
        new DetailComment({
          id: 'comment-id_testing1',
          username: 'muhammad',
          date: '2023-09-26 09:00:00.12345',
          content: 'Comment Content Testing 1',
          isDelete: false,
        }),
        new DetailComment({
          id: 'comment-id_testing2',
          username: 'dicoding',
          date: '2023-09-26 09:00:00.12345',
          content: 'Comment Content Testing 2',
          isDelete: true,
        }),
      ],
    };

    const threadDetail = new DetailThread(payload);

    expect(threadDetail.id).toStrictEqual(payload.id);
    expect(threadDetail.title).toStrictEqual(payload.title);
    expect(threadDetail.body).toStrictEqual(payload.body);
    expect(threadDetail.date).toStrictEqual(payload.date);
    expect(threadDetail.username).toStrictEqual(payload.username);
    expect(threadDetail.comments.length).toEqual(payload.comments.length);
    expect(threadDetail.comments.length).toEqual(2);
    expect(threadDetail.comments[0]).toStrictEqual(payload.comments[0]);
    expect(threadDetail.comments[1]).toStrictEqual(payload.comments[1]);
  });
});
