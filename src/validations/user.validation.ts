import Joi from 'joi';

export const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};

export const updateUser = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string()
        .min(6)
        .pattern(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/)
        .message('Password must contain at least one letter and one number'),
      name: Joi.string(),
    })
    .min(1),
};

export const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};
