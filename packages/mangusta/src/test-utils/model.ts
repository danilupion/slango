import mongoose, { Document, Model, Schema } from 'mongoose';

import { PluginFunction } from '../types.js';

export interface CreateModelWithPluginParams<Doc extends Document, Options> {
  buildSchema?: () => Schema<Doc>;
  modelName: string;
  plugin: PluginFunction<Options>;
  pluginOptions?: Options;
}

export const createModelWithPlugin = <Doc extends Document, Options>({
  buildSchema,
  modelName,
  plugin,
  pluginOptions,
}: CreateModelWithPluginParams<Doc, Options>): { model: Model<Doc>; schema: Schema<Doc> } => {
  if (mongoose.models[modelName]) {
    delete mongoose.models[modelName];
  }

  const schema = buildSchema ? buildSchema() : new Schema<Doc>({});

  schema.plugin(plugin, pluginOptions);

  const modelInstance = mongoose.model<Doc>(modelName, schema);

  return { model: modelInstance, schema };
};
