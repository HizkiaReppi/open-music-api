const routes = ({
  postAlbumLikesHandler,
  getAlbumLikesHandler,
  deleteAlbumLikesHandler,
}) => [
  {
    method: 'POST',
    path: '/albums/{id}/likes',
    handler: postAlbumLikesHandler,
    options: {
      auth: 'open_music_jwt',
    },
  },
  {
    method: 'GET',
    path: '/albums/{id}/likes',
    handler: getAlbumLikesHandler,
  },
  {
    method: 'DELETE',
    path: '/albums/{id}/likes',
    handler: deleteAlbumLikesHandler,
    options: {
      auth: 'open_music_jwt',
    },
  },
];

export default routes;
