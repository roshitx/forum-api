const AddComment = require('../AddComment');

describe('a AddComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'comment-123',
      content: 'content comment test',
    };

    expect(() => new AddComment(payload)).toThrowError(
      'ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      content: 'content comment test',
    };

    const params = {
      threadId: 1234,
    };

    expect(() => new AddComment(payload, params)).toThrowError(
      'ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create addedComment object correctly', () => {
    const payload = {
      content: 'content comment test',
    };

    const threadId = 'thread-123';

    const addComment = new AddComment(payload, threadId);

    expect(addComment.threadId).toStrictEqual(threadId);
    expect(addComment.content).toStrictEqual(payload.content);
  });
});
