const routes = ({
  postPlaylistHandler,
  getPlaylistsHandler,
  deletePlaylistByIdHandler,
  postPlaylistSongByIdHandler,
  getPlaylistSongsByIdHandler,
  deletePlaylistSongsByIdHandler,
  getPlaylistActivitiesByIdHandler,
}) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: postPlaylistHandler,
    options: {
      auth: 'open_music_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: getPlaylistsHandler,
    options: {
      auth: 'open_music_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: deletePlaylistByIdHandler,
    options: {
      auth: 'open_music_jwt',
    },
  },
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: postPlaylistSongByIdHandler,
    options: {
      auth: 'open_music_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: getPlaylistSongsByIdHandler,
    options: {
      auth: 'open_music_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: deletePlaylistSongsByIdHandler,
    options: {
      auth: 'open_music_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/activities',
    handler: getPlaylistActivitiesByIdHandler,
    options: {
      auth: 'open_music_jwt',
    },
  },
];

export default routes;
