import Joi from 'joi';

// Just for example
export const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required(),
  }),
  params: Joi.object({
    userId: Joi.string().length(24).required(),
  }),
  query: Joi.object({
    search: Joi.string()
      .optional()
      .description('Search term to filter products by name or description.'),
    sort: Joi.string()
      .valid('asc', 'desc')
      .optional()
      .description(
        'Sort the results by price in ascending or descending order.',
      ),
    page: Joi.number()
      .integer()
      .min(1)
      .optional()
      .description(
        'Page number for pagination. Defaults to 1 if not specified.',
      ),
    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .optional()
      .description(
        'Number of products to return per page. Defaults to 10 if not specified.',
      ),
  }),
};

export const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};
