import autoBind from 'auto-bind';
import logger from '../../utils/logging.js';

class ExportsHandler {
  constructor(service, playlistsService, validator) {
    this._service = service;
    this._validator = validator;
    this._playlistsService = playlistsService;

    autoBind(this);
  }

  async postExportPlaylistsHandler(req, h) {
    this._validator.validateExportPlaylistsPayload(req.payload);
    const { playlistId } = req.params;
    const { targetEmail } = req.payload;
    const { id: userId } = req.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, userId);

    const message = {
      userId,
      playlistId,
      targetEmail,
    };

    await this._service.sendMessage(
      'export:playlists',
      JSON.stringify(message),
    );

    logger.info(`Pesan dikirim ke ${message.targetEmail}`);

    const res = h
      .response({
        status: 'success',
        message: 'Permintaan Anda dalam antrean',
      })
      .code(201);

    return res;
  }
}

export default ExportsHandler;
