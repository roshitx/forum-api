const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload, threadId, credentialId) {
    this._verifyCredentials(credentialId);
    await this._threadRepository.verifyThreadExistence(threadId);
    const addComment = new AddComment(useCasePayload, threadId);
    return this._commentRepository.addComment(addComment, credentialId);
  }

  _verifyCredentials(credentialId) {
    if (!credentialId) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof credentialId !== 'string') {
      throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddCommentUseCase;
