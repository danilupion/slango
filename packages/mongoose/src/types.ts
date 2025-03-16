import { Schema } from 'mongoose';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PluginFunction<Options = any> = (schema: Schema, options?: Options) => void;
