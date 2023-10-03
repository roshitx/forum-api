const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist new thread and return added thread correctly', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-id_testing',
        password: 'secretandstrongpassword',
        fullname: 'Muhammad Roshit',
        username: 'roshit',
      });

      const newThread = new NewThread('user-id_testing', {
        title: 'Thread Title Testing',
        body: 'Thread Body Testing',
      });

      const fakeIdGenerator = () => 'id_testing';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );
      await threadRepositoryPostgres.addThread(newThread);

      const threads = await ThreadsTableTestHelper.findThreadById('thread-id_testing');
      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-id_testing',
        password: 'supersecretpassword',
        fullname: 'Muhammad Roshit',
        username: 'Roshit',
      });

      const newThread = new NewThread('user-id_testing', {
        title: 'Thread Title Testing',
        body: 'Thread Body Testing',
      });

      const fakeIdGenerator = () => 'id_testing';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      const addThread = await threadRepositoryPostgres.addThread(newThread);
      expect(addThread).toStrictEqual(
        new AddThread({
          id: 'thread-id_testing',
          title: 'Thread Title Testing',
          owner: 'user-id_testing',
        }),
      );
    });
  });

  describe('isThreadExists function', () => {
    it('should throw error given thread id is not exists', async () => {
      const threadId = 'thread-id_testing';
      const fakeIdGenerator = () => 'id_testing';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      await expect(
        threadRepositoryPostgres.isThreadExists(threadId),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw given thread id is exists', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-id_testing',
        password: 'supersecretpassword',
        fullname: 'Muhammad Roshit',
        username: 'roshit',
      });

      const newThread = new NewThread('user-id_testing', {
        title: 'Thread Title Testing',
        body: 'Thread Body Testing',
      });
      const fakeIdGenerator = () => 'id_testing';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      await threadRepositoryPostgres.addThread(newThread);
      await expect(threadRepositoryPostgres.isThreadExists('thread-id_testing')).resolves.not.toThrowError();
    });
  });

  describe('getThreadById function', () => {
    it('should return thread details correctly', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-id_testing',
        password: 'Muhammad Roshit',
        username: 'roshit',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-id_testing',
        title: 'Thread Title Testing',
        body: 'Thread Body Testing',
        owner: 'user-id_testing',
      });

      await CommentsTableTestHelper.addComment({
        userId: 'user-id_testing',
        threadId: 'thread-id_testing',
        commentId: 'comment-id_testing',
        content: 'Comment Content Testing',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const threadDetail = await threadRepositoryPostgres.getThreadById(
        'thread-id_testing',
      );

      expect(threadDetail.id).toEqual('thread-id_testing');
      expect(threadDetail.title).toEqual('Thread Title Testing');
      expect(threadDetail.body).toEqual('Thread Body Testing');
      expect(threadDetail.date).toBeTruthy();
      expect(threadDetail.username).toEqual('roshit');
      expect(threadDetail.comments).toHaveLength(1);
    });
  });
});
