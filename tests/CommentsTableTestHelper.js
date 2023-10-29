/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    commentId = 'comment-123',
    owner = 'user-123',
    threadId = 'thread-123',
    content = 'content comment',
    date = '2023-10-29',
    isDelete = false,
  }) {
    const query = {
      text: 'INSERT INTO comments(id, thread, content, owner, date, is_delete) VALUES($1, $2, $3, $4, $5, $6)',
      values: [commentId, threadId, content, owner, date, isDelete],
    };

    await pool.query(query);
  },

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
