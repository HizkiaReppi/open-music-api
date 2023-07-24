import InvariantError from '../../exceptions/InvariantError.js';
import UsersPayloadScheme from './schema.js';

const usersValidator = {
  validateUserPayload: (payload) => {
    const { error } = UsersPayloadScheme.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  },
};

export default usersValidator;
