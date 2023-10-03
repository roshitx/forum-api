const AddComment = require('../AddComment');

describe('an AddComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'comment-id_testing',
      content: 'Comment Content Testing',
    };

    expect(() => new AddComment(payload)).toThrowError(
      'ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 1234,
      content: 'Comment Content Testing',
      owner: [],
    };

    expect(() => new AddComment(payload)).toThrowError(
      'ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create addedComment object correctly', () => {
    const payload = {
      id: 'comment-id_testing',
      content: 'Comment Content Testing',
      owner: 'dicoding',
    };

    const addComment = new AddComment(payload);

    expect(addComment.id).toStrictEqual(payload.id);
    expect(addComment.content).toStrictEqual(payload.content);
    expect(addComment.owner).toStrictEqual(payload.owner);
  });
});
