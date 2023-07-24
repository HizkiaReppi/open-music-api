const routes = ({
  postAuthenticationHandler,
  putAuthenticationHandler,
  deleteAuthenticationHandler,
}) => [
  {
    method: 'POST',
    path: '/authentications',
    handler: postAuthenticationHandler,
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: putAuthenticationHandler,
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: deleteAuthenticationHandler,
  },
];

export default routes;
