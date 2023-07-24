import InvariantError from '../../exceptions/InvariantError.js';
import {
  PostAuthenticationsPayloadScheme,
  PutAuthenticationsPayloadScheme,
  DeleteAuthenticationsPayloadScheme,
} from './schema.js';

const authenticationsValidator = {
  validatePostAuthenticationPayload: (payload) => {
    const { error } = PostAuthenticationsPayloadScheme.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  },

  validatePutAuthenticationPayload: (payload) => {
    const { error } = PutAuthenticationsPayloadScheme.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  },

  validateDeleteAuthenticationPayload: (payload) => {
    const { error } = DeleteAuthenticationsPayloadScheme.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  },
};

export default authenticationsValidator;
