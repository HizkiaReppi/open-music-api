import InvariantError from '../../exceptions/InvariantError.js';
import CollaborationsPayloadScheme from './schema.js';

const collaborationsValidator = {
  validateCollaborationPayload: (payload) => {
    const { error } = CollaborationsPayloadScheme.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  },
};

export default collaborationsValidator;
