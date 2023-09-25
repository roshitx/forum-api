const AddThread = require('../AddThread');

describe('an AddThread entitites', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'Thread Title Testing',
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new AddThread(payload)).toThrowError(
      'ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 1234,
      title: 'Thread Title Testing',
      owner: [1, 2],
    };

    // Action & Assert
    expect(() => new AddThread(payload)).toThrowError(
      'ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create addThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-id_test',
      title: 'Thread Title Testing',
      owner: 'user-123',
    };

    // Action
    const addThread = new AddThread(payload);

    // Assert
    expect(addThread.id).toStrictEqual(payload.id);
    expect(addThread.title).toStrictEqual(payload.title);
    expect(addThread.owner).toStrictEqual(payload.owner);
  });
});
