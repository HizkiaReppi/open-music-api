const routes = ({ postUserHandler }) => [
  {
    method: 'POST',
    path: '/users',
    handler: postUserHandler,
  },
];

export default routes;
