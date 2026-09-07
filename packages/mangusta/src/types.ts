import { Schema } from 'mongoose';

export type PluginFunction<Options = any> = (schema: Schema, options?: Options) => void;
