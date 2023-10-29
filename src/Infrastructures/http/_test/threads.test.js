const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const createServer = require('../createServer');
const container = require('../../container');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      const threadsPayload = {
        title: 'Thread Title Testing',
        body: 'Thread Body Testing',
      };

      const accessToken = await ServerTestHelper.getAccessToken('user-123');
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadsPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and return detail thread', async () => {
      const server = await createServer(container);
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
      });

      await CommentsTableTestHelper.addComment({
        userId: 'user-123',
        threadId: 'thread-123',
      });

      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.comments).toBeDefined();
    });

    it('should response 404 when thread not found', async () => {
      const server = await createServer(container);
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-9876',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread tidak ditemukan.');
    });
  });
});
