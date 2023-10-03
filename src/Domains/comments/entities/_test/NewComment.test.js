const NewComment = require('../NewComment');

describe('a NewComment entities', () => {
  it('should throw error when userId is invalid', () => {
    const userId = '';
    const threadId = 'thread-id_testing';
    const payload = {
      content: 'Comment Content Testing',
    };

    expect(() => new NewComment(userId, threadId, payload)).toThrowError(
      'NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when userId did not meet data type specification', () => {
    const userId = 1234;
    const payload = {
      content: 'Comment Content Testing',
    };

    expect(() => new NewComment(userId, payload)).toThrowError(
      'NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should throw error when threadId is invalid', () => {
    const userId = 'user-123';
    const threadId = '';
    const payload = {
      content: 'Comment Content Testing',
    };

    expect(() => new NewComment(userId, threadId, payload)).toThrowError(
      'NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when threadId did not meet data type specification', () => {
    const userId = 'user-id_testing';
    const threadId = 5432;
    const payload = {
      content: 'Comment Content Testing',
    };

    expect(() => new NewComment(userId, threadId, payload)).toThrowError(
      'NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should throw error when payload did not contain needed property', () => {
    const userId = 'user-id_testing';
    const threadId = 'thread-id_testing';
    const payload = {};

    expect(() => new NewComment(userId, threadId, payload)).toThrowError(
      'NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const userId = 'user-id_test';
    const threadId = 'thread-id_test';
    const payload = {
      content: 1234,
    };

    expect(() => new NewComment(userId, threadId, payload)).toThrowError(
      'NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create newComment object correctly', () => {
    const expectedUserId = 'user-id_testing';
    const expectedThreadId = 'thread-id_testing';
    const payload = {
      content: 'Comment Content Testing',
    };

    const { userId, threadId, content } = new NewComment(
      expectedUserId,
      expectedThreadId,
      payload,
    );

    expect(userId).toEqual(expectedUserId);
    expect(threadId).toEqual(expectedThreadId);
    expect(content).toEqual(payload.content);
  });
});
