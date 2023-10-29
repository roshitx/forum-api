const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'roshit',
      password: 'supersecretpassword',
      fullname: 'Muhammad Roshit',
    });

    await ThreadsTableTestHelper.addThread({
      id: 'thread-123',
      title: 'judul thread',
      body: 'content thread',
      owner: 'user-123',
      date: '2023-09-22T02:03:22.120Z',
    });
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist new comment and return added comment correctly', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const credentialId = 'user-123';
      const addCommentPayload = {
        content: 'comment content',
        threadId: 'thread-123',
      };

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(
        addCommentPayload,
        credentialId,
      );

      const comment = await CommentsTableTestHelper.findCommentById(
        'comment-123',
      );

      // Assert
      expect(comment).toHaveLength(1);
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: 'comment-123',
          content: 'comment content',
          owner: 'user-123',
        }),
      );
    });
  });

  describe('verifyUserComment function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        content: 'comment content',
        owner: 'user-123',
        date: '2023-09-22T03:23:12.456Z',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(
        commentRepositoryPostgres.verifyCommentExistence('comment-098'),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should throw Authorization Error when non-owner tries to access owned comment', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        content: 'comment content',
        owner: 'user-123',
        date: '2023-01-27T03:12:20.235Z',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(
        commentRepositoryPostgres.verifyUserComment('comment-123', 'user-098'),
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw Authorization Error when deleted by owner', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        content: 'comment content',
        owner: 'user-123',
        date: '2023-01-22T03:12:05.243Z',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(
        commentRepositoryPostgres.verifyUserComment('comment-123', 'user-123'),
      ).resolves.toBeUndefined();
    });
  });

  describe('verifyCommentExistence function', () => {
    it('should throw NotFoundError when comment does not exist', async () => {
      // Arrange
      const nonExistentCommentId = 'non-existent-comment';
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(
        commentRepository.verifyCommentExistence(nonExistentCommentId),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment exists', async () => {
      // Arrange
      const existingCommentId = 'comment-123';
      await CommentsTableTestHelper.addComment({
        commentId: existingCommentId,
      });
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(
        commentRepository.verifyCommentExistence(existingCommentId),
      ).resolves.toBeUndefined();
    });
  });

  describe('deleteComment function', () => {
    it('should set isDelete to true', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        content: 'comment content',
        owner: 'user-123',
        date: '2023-09-22T03:12:10.213Z',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteComment(
        'user-123',
        'thread-123',
        'comment-123',
      );

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById(
        'comment-123',
      );
      expect(comment[0].is_delete).toBeTruthy();
    });
  });

  describe('getComment function', () => {
    it('should return empty array when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comment = await commentRepositoryPostgres.getComment('thread-123');

      // Assert
      expect(comment).toStrictEqual([]);
    });

    it('should return comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-456',
        username: 'dicoding',
        password: 'supersecretpassword',
        fullname: 'Dicoding Indonesia',
      });
      await CommentsTableTestHelper.addComment({
        owner: 'user-456',
        threadId: 'thread-123',
        content: 'new comment',
        isDelete: false,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comment = await commentRepositoryPostgres.getComment('thread-123');

      // Assert
      expect(comment).toHaveLength(1);
      expect(comment[0].id).toBe('comment-123');
      expect(comment[0].content).toBe('new comment');
      expect(comment[0].username).toBe('dicoding');
      expect(comment[0].is_delete).toBe(false);
    });
  });
});
