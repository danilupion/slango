import { Types } from 'mongoose';

export type Id = string | Types.ObjectId;

export const toObjectId = (value: Id): Types.ObjectId => {
  if (value instanceof Types.ObjectId) {
    return value;
  }

  return new Types.ObjectId(value);
};

export const toStringId = (value: Id): string =>
  value instanceof Types.ObjectId ? value.toString() : value;
