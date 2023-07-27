import autoBind from 'auto-bind';
import logger from '../../utils/logging.js';

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postUserHandler(req, h) {
    this._validator.validateUserPayload(req.payload);

    const { username, password, fullname } = req.payload;

    const userId = await this._service.addUser({
      username,
      password,
      fullname,
    });

    logger.info(`${username} berhasil mendaftar`);

    const res = h
      .response({
        status: 'success',
        message: 'User berhasil ditambahkan',
        data: {
          userId,
        },
      })
      .code(201);
    return res;
  }
}

export default UsersHandler;
