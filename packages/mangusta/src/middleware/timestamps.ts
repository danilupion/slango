import { Document, Model, Schema } from 'mongoose';

import { PluginFunction } from '../types.js';

export interface TimestampsMiddlewareOptions {
  creation?: boolean;
  creationField?: string;
  indexCreation?: boolean;
  indexUpdate?: boolean;
  update?: boolean;
  updateField?: string;
  updateTimestampOnCreation?: boolean;
}

export type WithCreated<Field extends string = 'created'> = { [key in Field]: Date };

export type WithTimestamps<
  Created extends string = 'created',
  Updated extends string = 'updated',
> = WithCreated<Created> & WithUpdated<Updated>;

export type WithUpdated<Field extends string = 'updated'> = { [key in Field]?: Date };

const timestampsMiddleware: PluginFunction<TimestampsMiddlewareOptions> = <
  Created extends string = 'created',
  Updated extends string = 'updated',
  DocType extends Document & WithTimestamps<Created, Updated> = Document &
    WithTimestamps<Created, Updated>,
>(
  schema: Schema<DocType, Model<DocType>>,
  {
    creation = true,
    creationField = 'created' as Created,
    indexCreation = false,
    indexUpdate = false,
    update = true,
    updateField = 'updated' as Updated,
    updateTimestampOnCreation = false,
  }: TimestampsMiddlewareOptions = {},
): void => {
  if (creation) {
    schema.add(
      new Schema<WithCreated<Created>>({
        [creationField]: Date,
      }),
    );
  }

  if (update) {
    schema.add(
      new Schema<WithUpdated<Updated>>({
        [updateField]: Date,
      }),
    );
  }

  schema.pre('save', function schemaWithTimestampsPreSave(next) {
    try {
      const now = new Date();

      if (creation && this.isNew && !this.get(creationField)) {
        this.set(creationField, now);
      }

      if (update) {
        if (this.isNew) {
          if (updateTimestampOnCreation) {
            this.set(updateField, now);
          }
          // else: do nothing so it's undefined
        } else {
          this.set(updateField, now);
        }
      }

      next();
    } catch (err) {
      if (err instanceof Error) {
        next(err);
      }
    }
  });

  if (update) {
    schema.pre(['updateOne', 'findOneAndUpdate'], function schemaWithTimestampsPreUpdate() {
      // ensure $set exists and we don't stomp on other operators
      this.set({ $set: { [updateField]: new Date() } });
    });
  }

  if (creation && indexCreation !== false) {
    schema.path(creationField).index(indexCreation);
  }

  if (update && indexUpdate !== false) {
    schema.path(updateField).index(indexUpdate);
  }
};

export default timestampsMiddleware;
