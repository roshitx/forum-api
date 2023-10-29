const AddThread = require('../AddThread');

describe('a NewThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      body: 'Thread Body',
    };

    expect(() => new AddThread(payload)).toThrowError(
      'ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      title: 1234,
      body: 'Thread Body',
      owner: [],
    };

    expect(() => new AddThread(payload)).toThrowError(
      'ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create addThread object correctly', () => {
    const payload = {
      title: 'Thread Title',
      body: 'Thread Body',
    };

    const { title, body } = new AddThread(payload);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});
