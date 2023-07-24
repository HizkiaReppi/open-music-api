import autoBind from 'auto-bind';

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

  async getPlaylistsHandler(req) {
    const { id: credentialId } = req.auth.credentials;
    const playlists = await this._playlistsService.getPlaylists(credentialId);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistByIdHandler(req) {
    const { id: playlistId } = req.params;
    const { id: credentialId } = req.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._playlistsService.deletePlaylist(playlistId);

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
