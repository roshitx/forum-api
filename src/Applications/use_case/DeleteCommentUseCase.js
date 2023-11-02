class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(credentialId, threadId, commentId) {
    this._verifyCredentials(credentialId);
    await this._threadRepository.verifyThreadExistence(threadId);
    await this._commentRepository.verifyCommentExistence(commentId);
    await this._commentRepository.verifyUserComment(commentId, credentialId);
    return this._commentRepository.deleteComment(credentialId, threadId, commentId);
  }

  _verifyCredentials(credentialId) {
    if (!credentialId) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof credentialId !== 'string') {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteCommentUseCase;
