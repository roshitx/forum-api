class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(credentialId, threadId, commentId) {
    await this._threadRepository.verifyThreadExistence(threadId);
    await this._commentRepository.verifyCommentExistence(commentId);
    await this._commentRepository.verifyUserComment(commentId, credentialId);
    return this._commentRepository.deleteComment(credentialId, threadId, commentId);
  }
}

module.exports = DeleteCommentUseCase;
