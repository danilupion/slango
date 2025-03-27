import { Document, Model, Schema } from 'mongoose';
import { nanoid } from 'nanoid';

import { PluginFunction } from '../types.js';

export interface CompactIdMiddlewareOptions<Field extends string = 'shortId'> {
  field?: Field;
  index?: boolean;
  length?: number;
}

export type WithCompactId<Field extends string = 'shortId'> = {
  [key in Field]: string;
};

const compactIdMiddleware: PluginFunction<CompactIdMiddlewareOptions> = <
  Field extends string = 'shortId',
  DocType extends Document & WithCompactId<Field> = Document & WithCompactId<Field>,
>(
  schema: Schema<DocType, Model<DocType>>,
  { field = 'shortId' as Field, index = true, length = 9 }: CompactIdMiddlewareOptions<Field> = {},
): void => {
  const fieldDescription = new Schema<WithCompactId<Field>>({
    [field]: {
      default: () => nanoid(length),
      index,
      required: true,
      type: String,
    },
  });

  schema.add(fieldDescription);
};

export default compactIdMiddleware;
