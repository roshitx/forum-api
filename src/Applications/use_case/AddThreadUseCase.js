const AddThread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, credentialId) {
    const addThread = new AddThread(useCasePayload);
    this._checkCredential(credentialId);
    return this._threadRepository.addThread(addThread, credentialId);
  }

  _checkCredential(credentialId) {
    if (!credentialId) {
      throw new Error('ADD_THREAD_USE_CASE.NOT_CONTAIN_CREDENTIAL_ID');
    }

    if (typeof credentialId !== 'string') {
      throw new Error('ADD_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddThreadUseCase;
