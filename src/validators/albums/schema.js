import Joi from 'joi';

const currentYear = new Date().getFullYear();

const AlbumsSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().integer().min(1900).max(currentYear).required(),
});

export default AlbumsSchema;
