import { Document, Schema, Types } from 'mongoose';

import { PluginFunction } from '../types.js';

export interface OwnerMiddlewareOptions<Field extends string = 'user'> {
  field?: Field;
  index?: boolean;
  ref?: string;
  required?: boolean;
}

export type WithOwner<T = Types.ObjectId, Field extends string = 'user'> = {
  [key in Field]: T;
};

const ownerMiddleware: PluginFunction<OwnerMiddlewareOptions> = <
  Field extends string = 'user',
  DocType extends Document & WithOwner<Field> = Document & WithOwner<Field>,
>(
  schema: Schema<DocType>,
  {
    field = 'user' as Field,
    index = true,
    ref = 'User',
    required = true,
  }: OwnerMiddlewareOptions<Field> = {},
): void => {
  const fieldDescription = new Schema<WithOwner<Field>>({
    [field]: {
      index,
      ref,
      required,
      type: Types.ObjectId,
    },
  });
  schema.add(fieldDescription);
};

export default ownerMiddleware;
