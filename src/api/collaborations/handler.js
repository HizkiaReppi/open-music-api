import autoBind from 'auto-bind';
import logger from '../../utils/logging.js';

class CollaborationsHandler {
  constructor(
    collaborationsService,
    playlistsService,
    usersService,
    validator,
  ) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._usersService = usersService;
    this._validator = validator;

    autoBind(this);
  }

  async postCollaborationHandler(req, h) {
    this._validator.validateCollaborationPayload(req.payload);

    const { id: credentialId } = req.auth.credentials;
    const { playlistId, userId } = req.payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

    await this._usersService.getUserById(userId);

    const collaborationId = await this._collaborationsService.addCollaboration(
      playlistId,
      userId,
    );

    logger.info(`Kolaborasi dengan id ${collaborationId} berhasil ditambahkan`);

    const res = h
      .response({
        status: 'success',
        data: {
          collaborationId,
        },
      })
      .code(201);
    return res;
  }

  async deleteCollaborationHandler(req) {
    this._validator.validateCollaborationPayload(req.payload);

    const { id: credentialId } = req.auth.credentials;
    const { playlistId, userId } = req.payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._collaborationsService.deleteCollaboration(playlistId, userId);

    logger.info('Kolaborasi berhasil dihapus');

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

export default CollaborationsHandler;
