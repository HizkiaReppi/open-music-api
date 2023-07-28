import autoBind from 'auto-bind';
import logger from '../../utils/logging.js';

class UploadsHandler {
  constructor(storageService, albumsService, validator) {
    this._storageService = storageService;
    this._albumsService = albumsService;
    this._validator = validator;

    autoBind(this);
  }

  async postUploadAlbumCoverHandler(req, h) {
    const { cover } = req.payload;
    const { id } = req.params;
    this._validator.validateAlbumCoverHeaders(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);

    const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/albums/images/${filename}`;

    await this._albumsService.addAlbumCoverById(id, coverUrl);

    logger.info(
      `Cover berhasil diunggah: ${coverUrl} untuk album dengan id: ${id}`,
    );

    const res = h
      .response({
        status: 'success',
        message: 'Sampul berhasil diunggah',
      })
      .code(201);

    return res;
  }
}

export default UploadsHandler;
