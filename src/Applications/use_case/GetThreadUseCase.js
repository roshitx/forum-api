/* eslint-disable no-param-reassign */
class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyThreadExistence(threadId);
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getComment(threadId);
    const sanitizedComments = this._sanitizeDeletedComments(comments);
    const result = { ...thread, comments: sanitizedComments };
    return result;
  }

  _sanitizeDeletedComments(comments) {
    return comments.map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.is_delete ? '**komentar telah dihapus**' : comment.content,
    }));
  }
}

module.exports = GetThreadUseCase;
