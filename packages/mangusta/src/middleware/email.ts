import { Document, Model, Schema } from 'mongoose';

import { PluginFunction } from '../types.js';

export const emailRegexp = /^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

export type WithEmail<
  Field extends string = 'email',
  Required extends boolean = true,
> = Required extends true ? { [key in Field]: string } : { [key in Field]?: string };

interface EmailMiddlewareOptions<Field extends string = 'email'> {
  doesNotMatchMessage?: string;
  field?: Field;
  index?: boolean;
  regExp?: RegExp;
  required?: boolean;
  unique?: boolean;
}

const emailMiddleware: PluginFunction<EmailMiddlewareOptions> = <
  Field extends string = 'email',
  DocType extends Document & WithEmail<Field> = Document & WithEmail<Field>,
>(
  schema: Schema<DocType, Model<DocType>>,
  {
    doesNotMatchMessage,
    field = 'email' as Field,
    index = true,
    regExp = emailRegexp,
    required = true,
    unique = true,
  }: EmailMiddlewareOptions<Field> = {},
): void => {
  const emailSchema = new Schema<WithEmail<Field>>({
    [field]: {
      index,
      match: doesNotMatchMessage ? [regExp, doesNotMatchMessage] : regExp,
      required,
      trim: true,
      type: String,
      unique,
    },
  });

  schema.add(emailSchema);
};

export default emailMiddleware;
