import autoBind from 'auto-bind';
import logger from '../../utils/logging.js';

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postSongHandler(req, h) {
    this._validator.validateSongPayload(req.payload);
    const songId = await this._service.addSong(req.payload);

    logger.info(`Lagu dengan id ${songId} berhasil diambil`);

    const res = h
      .response({
        status: 'success',
        data: { songId },
      })
      .code(201);
    return res;
  }

  async getSongHandler(req) {
    const { title, performer } = req.query;
    const result = await this._service.getSongs(title, performer);

    logger.info('Lagu berhasil diambil');

    return {
      status: 'success',
      data: {
        songs: result,
      },
    };
  }

  async getSongByIdHandler(req) {
    const { id } = req.params;
    const result = await this._service.getSongById(id);

    logger.info(`Lagu dengan id ${result.title} berhasil diambil`);

    return {
      status: 'success',
      data: {
        song: result,
      },
    };
  }

  async putSongByIdHandler(req) {
    this._validator.validateSongPayload(req.payload);
    const { id } = req.params;
    await this._service.editSongById(id, req.payload);

    logger.info(`Lagu dengan id "${id}" berhasil diperbarui`);

    return {
      status: 'success',
      message: `Lagu dengan id "${id}" berhasil diperbarui`,
    };
  }

  async deleteSongByIdHandler(req) {
    const { id } = req.params;
    await this._service.deleteSongById(id);

    logger.info(`Lagu dengan id ${id} berhasil dihapus`);

    return {
      status: 'success',
      message: `Lagu dengan id ${id} berhasil dihapus`,
    };
  }
}

export default SongsHandler;
