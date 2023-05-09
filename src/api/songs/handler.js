import autoBind from 'auto-bind';

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postSongHandler(req, h) {
    this._validator.validateSongPayload(req.payload);
    const result = await this._service.addSong(req.payload);

    const res = h
      .response({
        status: 'success',
        data: {
          songId: result,
        },
      })
      .code(201);
    return res;
  }

  async getSongHandler(req) {
    const { title, performer } = req.query;
    const result = await this._service.getSongs(title, performer);
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

    return {
      status: 'success',
      message: `Lagu dengan id "${id}" berhasil diperbarui`,
    };
  }

  async deleteSongByIdHandler(req) {
    const { id } = req.params;
    await this._service.deleteSongById(id);
    return {
      status: 'success',
      message: `Lagu dengan id ${id} berhasil dihapus`,
    };
  }
}

export default SongsHandler;
