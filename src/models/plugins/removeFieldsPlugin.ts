import { Schema, HydratedDocument } from 'mongoose';

/**
 * Mongoose plugin to remove specified fields from the JSON output.
 * @param schema - The Mongoose schema to apply the plugin on.
 * @param fieldsToRemove - An array of field names to remove from the serialized JSON output.
 */
const removeFieldsPlugin = (schema: Schema, fieldsToRemove: string[]): void => {
  schema.set('toJSON', {
    transform: (doc: HydratedDocument<any>, ret: any) => {
      fieldsToRemove.forEach((field) => {
        delete ret[field];
      });
      return ret;
    },
  });
};

export default removeFieldsPlugin;
