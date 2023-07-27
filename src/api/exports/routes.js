const routes = ({ postExportPlaylistsHandler }) => [
  {
    method: 'POST',
    path: '/export/playlists/{playlistId}',
    handler: postExportPlaylistsHandler,
    options: {
      auth: 'open_music_jwt',
    },
  },
];

export default routes;
