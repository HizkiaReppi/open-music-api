import autoBind from 'auto-bind';
import logger from '../../utils/logging.js';

class PlaylistsHandler {
  constructor(playlistsService, songsService, validator) {
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(req, h) {
    this._validator.validatePlaylistPayload(req.payload);

    const { name } = req.payload;
    const { id: credentialId } = req.auth.credentials;

    const playlistId = await this._playlistsService.addPlaylist(
      name,
      credentialId,
    );

    logger.info(`Playlist dengan id ${playlistId} berhasil ditambahkan`);

    const res = h
      .response({
        status: 'success',
        data: {
          playlistId,
        },
      })
      .code(201);
    return res;
  }

  async getPlaylistsHandler(req, h) {
    const { id: credentialId } = req.auth.credentials;
    const { playlists, cache } = await this._playlistsService.getPlaylists(
      credentialId,
    );

    logger.info('Playlists berhasil diambil');

    const res = h.response({
      status: 'success',
      data: {
        playlists,
      },
    });

    if (cache) res.header('X-Data-Source', 'cache');

    return res;
  }

  async deletePlaylistByIdHandler(req) {
    const { id: playlistId } = req.params;
    const { id: credentialId } = req.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._playlistsService.deletePlaylist(playlistId);

    logger.info(`Playlist dengan id ${playlistId} berhasil dihapus`);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async postPlaylistSongByIdHandler(req, h) {
    this._validator.validateSongPlaylistPayload(req.payload);

    const { songId } = req.payload;
    const { id: playlistId } = req.params;
    const { id: credentialId } = req.auth.credentials;

    await this._songsService.getSongById(songId);
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._playlistsService.addSongToPlaylist(playlistId, songId);
    await this._playlistsService.addActivity(
      playlistId,
      songId,
      credentialId,
      'add',
    );

    logger.info('Musik berhasil ditambahkan ke dalam playlist');

    const res = h
      .response({
        status: 'success',
        message: 'Musik berhasil ditambahkan ke dalam playlist',
      })
      .code(201);
    return res;
  }

  async getPlaylistSongsByIdHandler(req) {
    const { id: playlistId } = req.params;
    const { id: credentialId } = req.auth.credentials;
    const playlist = await this._playlistsService.getPlaylistSongsById(
      playlistId,
      credentialId,
    );

    logger.info(`Playlist ${playlist.name} berhasil diambil`);

    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deletePlaylistSongsByIdHandler(req) {
    this._validator.validateSongPlaylistPayload(req.payload);

    const { id: playlistId } = req.params;
    const { id: credentialId } = req.auth.credentials;
    const { songId } = req.payload;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._playlistsService.deleteSongFromPlaylist(playlistId, songId);
    await this._playlistsService.addActivity(
      playlistId,
      songId,
      credentialId,
      'delete',
    );

    logger.info('Musik berhasil dihapus dari playlist');

    return {
      status: 'success',
      message: 'Musik berhasil dihapus dari playlist',
    };
  }

  async getPlaylistActivitiesByIdHandler(req) {
    const { id } = req.params;
    const { id: credentialId } = req.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(id, credentialId);

    const activities = await this._playlistsService.getPlaylistActivitiesById(
      id,
    );

    logger.info('Aktivitas berhasil diambil');

    return {
      status: 'success',
      data: {
        playlistId: id,
        activities,
      },
    };
  }
}

export default PlaylistsHandler;
