import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../helpers';
import { MESSAGES } from '../constants';

interface Schema {
  body?: ObjectSchema;
  params?: ObjectSchema;
  query?: ObjectSchema;
}

const validate = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validationOptions = {
      // When set to false, validation will continue after the first error is encountered,
      // allowing all errors to be collected and returned in the response.
      abortEarly: false,
      // When set to false, it does not allow properties that are not defined in the schema.
      // If set to true, unknown keys will be ignored, which can be useful in some cases.
      allowUnknown: false,
      // When set to true, it removes properties that are not specified in the schema from the validated result.
      // This is useful for cleaning up the request object before further processing.
      stripUnknown: true,
    };

    // prettier-ignore
    const validateProperty = (property: any, schema?: ObjectSchema) => {
      return schema ? schema.validate(property, validationOptions) : { error: null, value: property };
    };

    const bodyResult = validateProperty(req.body, schema.body);
    const paramsResult = validateProperty(req.params, schema.params);
    const queryResult = validateProperty(req.query, schema.query);

    // Collect all validation errors
    const errors = [
      ...(bodyResult.error?.details || []),
      ...(paramsResult.error?.details || []),
      ...(queryResult.error?.details || []),
    ];

    // If there are any errors, return them
    if (errors.length > 0) {
      const errorMessage = errors.map((err) => err.message).join(', ');
      return next(
        new ApiError(
          StatusCodes.BAD_REQUEST,
          `${MESSAGES.VALIDATION_ERROR}: ${errorMessage}`,
        ),
      );
    }

    // Assign validated values back to req
    req.body = bodyResult.value;
    req.params = paramsResult.value;
    req.query = queryResult.value;

    next();
  };
};

export default validate;
