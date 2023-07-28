import autoBind from 'auto-bind';
import logger from '../../utils/logging.js';

class AlbumLikesHandler {
  constructor(service) {
    this._service = service;

    autoBind(this);
  }

  async postAlbumLikesHandler(req, h) {
    const { id } = req.params;
    const { id: userId } = req.auth.credentials;

    await this._service.verifyUserLiked(id, userId);

    await this._service.addLikesToAlbum(id, userId);

    logger.info(`User ${userId} menyukai album ${id}`);

    const res = h
      .response({
        status: 'success',
        message: 'Anda menyukai album ini',
      })
      .code(201);
    return res;
  }

  async getAlbumLikesHandler(req, h) {
    const { id } = req.params;
    const { likes, cache } = await this._service.getAlbumLikes(id);

    logger.info('Berhasil mendapatkan daftar like');

    const res = h.response({
      status: 'success',
      data: {
        likes,
      },
    });

    if (cache) res.header('X-Data-Source', 'cache');

    return res;
  }

  async deleteAlbumLikesHandler(req) {
    const { id } = req.params;
    const { id: userId } = req.auth.credentials;

    await this._service.deleteLike(id, userId);

    logger.info(`User ${userId} membatalkan like pada album ${id}`);

    return {
      status: 'success',
      message: 'Berhasil membatalkan like',
    };
  }
}

export default AlbumLikesHandler;
