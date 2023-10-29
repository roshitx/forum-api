const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'roshit',
      password: 'supersecretpassword',
      fullname: 'Muhammad Roshit',
    });
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    // Arrange
    it('should persist new thread and return added thread correctly', async () => {
      // Arrange
      const addThread = new AddThread({
        title: 'judul thread',
        body: 'content thread',
      });

      const credentialId = 'user-123';

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await threadRepositoryPostgres.addThread(addThread, credentialId);

      // Assert
      const threads = await ThreadsTableTestHelper.verifyThreadExistence('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      const addThread = new AddThread({
        title: 'Thread Title',
        body: 'Thread Body',
      });

      const credentialId = 'user-123';

      const fakeIdGenerator = () => '123'; /* stub */
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const threads = await threadRepositoryPostgres.addThread(addThread, credentialId);

      // Assert
      expect(threads).toStrictEqual(
        new AddedThread({
          id: 'thread-123',
          title: 'Thread Title',
          owner: 'user-123',
        }),
      );
    });
  });

  describe('verifyThreadExistence function', () => {
    it('should throw Not Found Error when thread is not exists', async () => {
      // Arrange
      const threadId = 'thread-123';
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyThreadExistence(threadId),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw error when thread is exists', async () => {
      // Arrange
      const addThread = new AddThread({
        title: 'judul thread',
        body: 'content thread',
      });

      const credentialId = 'user-123';

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action & Assert
      const thread = await threadRepositoryPostgres.addThread(addThread, credentialId);
      await expect(threadRepositoryPostgres.verifyThreadExistence('thread-123')).resolves.not.toThrowError();
    });
  });

  describe('getThreadById function', () => {
    it('should get thread details correctly', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'judul thread',
        body: 'content thread',
        owner: 'user-123',
        date: new Date(),
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getThreadById(
        'thread-123',
      );

      // Assert
      expect(thread.id).toEqual('thread-123');
      expect(thread.title).toEqual('judul thread');
      expect(thread.body).toEqual('content thread');
      expect(thread.date).toBeTruthy();
      expect(thread.username).toEqual('roshit');
    });
  });
});
