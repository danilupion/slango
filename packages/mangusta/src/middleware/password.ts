import { compare, hash } from 'bcrypt';
import { Document, Model, Schema } from 'mongoose';

import { PluginFunction } from '../types.js';

export type WithPassword<
  Field extends string = 'password',
  ComparisonFunction extends string = 'comparePassword',
> = {
  [key in ComparisonFunction]: (password: string) => Promise<boolean>;
} & {
  [key in Field]: string;
};

export const passwordRegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&*)(\][+=.,_-]).{8,}$/;

export interface PasswordMiddlewareOptions<
  Field extends string = 'password',
  ComparisonFunction extends string = 'comparePassword',
> {
  comparisonFunction?: ComparisonFunction;
  doesNotMatchMessage?: string;
  field?: Field;
  regExp?: RegExp;
  required?: boolean;
  saltingRounds?: number;
}

const passwordMiddleware: PluginFunction<PasswordMiddlewareOptions> = <
  Field extends string = 'password',
  ComparisonFunction extends string = 'comparePassword',
  DocType extends Document & WithPassword<Field, ComparisonFunction> = Document &
    WithPassword<Field, ComparisonFunction>,
>(
  schema: Schema<DocType, Model<DocType>>,
  {
    comparisonFunction = 'comparePassword' as ComparisonFunction,
    doesNotMatchMessage,
    field = 'password' as Field,
    regExp = passwordRegExp,
    required = true,
    saltingRounds = 10,
  }: PasswordMiddlewareOptions<Field, ComparisonFunction> = {},
): void => {
  const fieldDescription = new Schema<WithPassword<Field, ComparisonFunction>>({
    [field]: {
      match: doesNotMatchMessage ? [regExp, doesNotMatchMessage] : regExp,
      required,
      type: String,
    },
  });

  schema.add(fieldDescription);

  schema.pre<DocType>('save', async function schemaWithPasswordPreSave(next) {
    // only hash the password if it has been modified (or is new)
    if (!this.isModified(field)) {
      return next();
    }

    try {
      // generate a hash and override the clear text password with the hashed one
      this.set(field, await hash(this.get(field) as DocType[Field], saltingRounds));
      next();
    } catch (err) {
      if (err instanceof Error) {
        next(err);
      }
    }
  });

  schema.methods[comparisonFunction] = async function comparePassword(
    this: DocType & Document,
    candidate: string,
  ): Promise<boolean> {
    try {
      return await compare(candidate, this.get(field) as DocType[Field]);
    } catch {
      return false;
    }
  };
};

export default passwordMiddleware;
