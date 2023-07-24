const routes = ({ postCollaborationHandler, deleteCollaborationHandler }) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: postCollaborationHandler,
    options: {
      auth: 'open_music_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: deleteCollaborationHandler,
    options: {
      auth: 'open_music_jwt',
    },
  },
];

export default routes;
