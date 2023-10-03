const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist new comment and return added thread correctly', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-id_testing',
        password: 'supersecretpassword',
        fullname: 'Muhammad Roshit',
        username: 'roshit',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-id_testing',
        title: 'Thread Title Testing',
        body: 'Thread Body Testing',
        owner: 'user-id_testing',
      });

      const fakeIdGenerator = () => 'id_testing';
      const newComment = new NewComment(
        'user-id_testing',
        'thread-id_testing',
        { content: 'Comment Content Testing' },
      );
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );
      await commentRepositoryPostgres.addComment(newComment);

      const comment = await CommentsTableTestHelper.findCommentById(
        'comment-id_testing',
      );
      expect(comment).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-id_testing',
        password: 'supersecretpassword',
        fullname: 'Muhammad Roshit',
        username: 'roshit',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-id_testing',
        title: 'Thread Title Testing',
        body: 'Thread Body Testing',
        owner: 'user-id_testing',
      });

      const fakeIdGenerator = () => 'id_testing';
      const newComment = new NewComment(
        'user-id_testing',
        'thread-id_testing',
        { content: 'Comment Content Testing' },
      );
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );
      const addComment = await commentRepositoryPostgres.addComment(newComment);

      expect(addComment).toStrictEqual(
        new AddComment({
          id: 'comment-id_testing',
          content: 'Comment Content Testing',
          owner: 'user-id_testing',
        }),
      );
    });
  });

  describe('verifyUserComment function', () => {
    it('should throw NotFoundError when comment with given id not found', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-id_testing',
        password: 'supersecretpassword',
        fullname: 'Dicoding Indonesia',
        username: 'dicoding',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-id_testing',
        title: 'Thread Title Testing',
        body: 'Thread Body Testing',
        owner: 'user-id_testing',
      });

      const fakeIdGenerator = () => 'id_testing';
      const newComment = new NewComment(
        'user-id_testing',
        'thread-id_testing',
        {
          content: 'Comment Content Testing',
        },
      );
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      await commentRepositoryPostgres.addComment(newComment);
      await expect(
        commentRepositoryPostgres.verifyUserComment(
          'user-id_testing',
          'comment-id-testing',
        ),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when comment deleted by non owner', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-id_testing1',
        password: 'supersecretpassword',
        fullname: 'Muhammad Roshit',
        username: 'roshit',
      });

      await UsersTableTestHelper.addUser({
        id: 'user-id_testing2',
        password: 'supersecretpassword',
        fullname: 'Ahdan Abde',
        username: 'ahdan',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-id_testing',
        title: 'Thread Title Testing',
        body: 'Thread Body Testing',
        owner: 'user-id_testing1',
      });

      const fakeIdGenerator = () => 'id_testing';
      const newComment = new NewComment(
        'user-id_testing1',
        'thread-id_testing',
        { content: 'Comment Content Testing' },
      );
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      await commentRepositoryPostgres.addComment(newComment);
      await expect(
        commentRepositoryPostgres.verifyUserComment(
          'user-id_testing2',
          'comment-id_testing',
        ),
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when comment deleted by the owner', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-id_testing',
        password: 'supersecretpassword',
        fullname: 'Muhammad Roshit',
        username: 'roshit',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-id_testing',
        title: 'Thread Title Testing',
        body: 'Thread Body Testing',
        owner: 'user-id_testing',
      });

      const fakeIdGenerator = () => 'id_testing';
      const newComment = new NewComment(
        'user-id_testing',
        'thread-id_testing',
        { content: 'Comment Content Testing' },
      );
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      await commentRepositoryPostgres.addComment(newComment);
      await expect(
        commentRepositoryPostgres.verifyUserComment(
          'user-id_testing',
          'comment-id_testing',
        ),
      ).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteComment function', () => {
    it('should set isDelete to true', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-id_testing',
        password: 'supersecretpassword',
        fullname: 'Muhammad Roshit',
        username: 'roshit',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-id_testing',
        title: 'Thread Title Testing',
        body: 'Thread Body Testing',
        owner: 'user-id_testing',
      });

      const fakeIdGenerator = () => 'id_testing';
      const newComment = new NewComment(
        'user-id_testing',
        'thread-id_testing',
        { content: 'Comment Content Testing' },
      );
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      await commentRepositoryPostgres.addComment(newComment);
      await commentRepositoryPostgres.deleteComment(
        'user-id_testing',
        'thread-id_testing',
        'comment-id_testing',
      );
      const comments = await CommentsTableTestHelper.findCommentById(
        'comment-id_testing',
      );

      expect(comments[0].is_delete).toBeTruthy();
    });
  });
});
