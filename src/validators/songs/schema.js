import Joi from 'joi';

const currentYear = new Date().getFullYear();

const SongsSchema = Joi.object({
  title: Joi.string().max(255).required(),
  year: Joi.number().integer().min(1900).max(currentYear).required(),
  genre: Joi.string().max(125).required(),
  performer: Joi.string().max(255).required(),
  duration: Joi.number().min(1),
  albumId: Joi.string(),
});

export default SongsSchema;
