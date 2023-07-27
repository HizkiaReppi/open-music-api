import autoBind from 'auto-bind';
import logger from '../../utils/logging.js';

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(req, h) {
    this._validator.validateAlbumPayload(req.payload);
    const result = await this._service.addAlbum(req.payload);

    logger.info(`Album dengan id "${result}" berhasil ditambahkan`);

    const res = h
      .response({
        status: 'success',
        data: {
          albumId: result,
        },
      })
      .code(201);
    return res;
  }

  async getAlbumsByIdHandler(req) {
    const { id } = req.params;
    const result = await this._service.getAlbumById(id);

    logger.info(`Album dengan id "${id}" berhasil diambil`);

    return {
      status: 'success',
      data: {
        album: result,
      },
    };
  }

  async putAlbumByIdHandler(req) {
    this._validator.validateAlbumPayload(req.payload);
    const { name, year } = req.payload;
    const { id } = req.params;
    await this._service.editAlbumById(id, { name, year });

    logger.info(`Album dengan id "${id}" berhasil diperbarui`);

    return {
      status: 'success',
      message: `Album dengan id "${id}" berhasil diperbarui`,
    };
  }

  async deleteAlbumByIdHandler(req) {
    const { id } = req.params;
    await this._service.deleteAlbumById(id);

    logger.info(`Album dengan id "${id}" berhasil dihapus`);

    return {
      status: 'success',
      message: `Album dengan id "${id}" berhasil dihapus`,
    };
  }
}

export default AlbumsHandler;
