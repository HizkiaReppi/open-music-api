import Joi from 'joi';

const UsersPayloadScheme = Joi.object({
  username: Joi.string().max(50).required(),
  password: Joi.string().required(),
  fullname: Joi.string().max(255).required(),
});

export default UsersPayloadScheme;
