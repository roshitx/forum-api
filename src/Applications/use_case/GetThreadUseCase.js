/* eslint-disable no-param-reassign */
class GetThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(threadId) {
    await this._threadRepository.isThreadExists(threadId);
    const threadDetail = await this._threadRepository.getThreadById(threadId);
    threadDetail.comments.forEach((part, index, commentArrays) => {
      if (part.isDelete) {
        commentArrays[index].content = '**komentar telah dihapus**';
      }

      delete commentArrays[index].isDelete;
    });

    return threadDetail;
  }
}

module.exports = GetThreadUseCase;
