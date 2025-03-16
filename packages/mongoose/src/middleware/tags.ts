import { Document, Model, Schema } from 'mongoose';

import { PluginFunction } from '../types.js';

export interface TagsMiddlewareOptions<Field extends string = 'tags'> {
  field?: Field;
  index?: 'hashed' | 'text' | false;
  unique?: boolean;
  validate?: (tags: string[]) => boolean;
}

export type WithTags<Field extends string = 'tags'> = {
  [key in Field]: string[];
};

const tagsMiddleware: PluginFunction<TagsMiddlewareOptions> = <
  Field extends string = 'tags',
  DocType extends Document & WithTags<Field> = Document & WithTags<Field>,
>(
  schema: Schema<DocType, Model<DocType>>,
  {
    field = 'tags' as Field,
    index = false,
    unique = true,
    validate,
  }: TagsMiddlewareOptions<Field> = {},
): void => {
  const tagsSchema = new Schema<WithTags<Field>>({
    [field]: {
      type: [String],
      ...(validate && {
        validate: {
          message: 'Tags failed custom validation.',
          validator: (tags: string[]) => validate(tags),
        },
      }),
    },
  });

  schema.add(tagsSchema);

  if (index) {
    schema.index({ [field]: index });
  }

  schema.pre<DocType>('save', function schemaWithTagsPreSave(next) {
    const tags = this.get(field) as DocType[Field];
    if (unique && tags) {
      this.set(field, Array.from(new Set(tags)));
    }

    next();
  });
};

export default tagsMiddleware;
