import { setupMongoTestEnvironment } from '@slango.configs/vitest/helpers/mongooseTestEnvironment';
import mongoose, { Document, model, Schema } from 'mongoose';
import { describe, expect, it } from 'vitest';

import tagsMiddleware, { TagsMiddlewareOptions, WithTags } from './tags.js';

setupMongoTestEnvironment();

type TestDoc<Field extends string = 'tags'> = Document & WithTags<Field>;

const createTestModel = <Field extends string = 'tags'>(options?: TagsMiddlewareOptions<Field>) => {
  const modelName = 'TestDoc';

  if (mongoose.models[modelName]) {
    delete mongoose.models[modelName];
  }

  const TestSchema = new Schema<TestDoc<Field>>({});
  if (options) {
    TestSchema.plugin(tagsMiddleware, options as TagsMiddlewareOptions);
  } else {
    TestSchema.plugin(tagsMiddleware);
  }

  return model<TestDoc<Field>>(modelName, TestSchema);
};

describe('tagsMiddleware', () => {
  it('should add a "tags" field with correct content if tags are provided', async () => {
    const TestModel = createTestModel();
    const doc = new TestModel({ tags: ['tag1', 'tag2'] });

    await expect(doc.save()).resolves.not.toThrow();
    const savedDoc = await TestModel.findOne({ _id: doc._id });

    expect(savedDoc).toBeDefined();
    expect(savedDoc?.tags).toEqual(['tag1', 'tag2']);
  });

  it('should add a "tags" field with empty array if no tag is provided', async () => {
    const TestModel = createTestModel();
    const doc = new TestModel({});

    await expect(doc.save()).resolves.not.toThrow();
    const savedDoc = await TestModel.findOne({ _id: doc._id });

    expect(savedDoc).toBeDefined();
    expect(savedDoc?.tags).toEqual([]);
  });

  it('should ensure uniqueness of tags if "unique" is set to true', async () => {
    const TestModel = createTestModel({ unique: true });
    const doc = new TestModel({ tags: ['tag1', 'tag2', 'tag1'] });

    await expect(doc.save()).resolves.not.toThrow();
    const savedDoc = await TestModel.findOne({ _id: doc._id });

    expect(savedDoc).toBeDefined();
    expect(savedDoc?.tags).toEqual(['tag1', 'tag2']); // Duplicates removed
  });

  it('should not enforce uniqueness if "unique" is set to false', async () => {
    const TestModel = createTestModel({ unique: false });
    const doc = new TestModel({ tags: ['tag1', 'tag2', 'tag1'] });

    await expect(doc.save()).resolves.not.toThrow();
    const savedDoc = await TestModel.findOne({ _id: doc._id });

    expect(savedDoc).toBeDefined();
    expect(savedDoc?.tags).toEqual(['tag1', 'tag2', 'tag1']);
  });

  it('should validate tags with custom validation function', async () => {
    const TestModel = createTestModel({
      validate: (tags) => tags.every((tag) => tag.startsWith('valid')),
    });

    const validDoc = new TestModel({ tags: ['validTag1', 'validTag2'] });
    await expect(validDoc.save()).resolves.not.toThrow();

    const invalidDoc = new TestModel({ tags: ['validTag', 'invalidTag'] });
    await expect(invalidDoc.save()).rejects.toThrowError(mongoose.Error.ValidationError);
  });

  it('should allow configuring the field name', async () => {
    const TestModel = createTestModel<'customTags'>({ field: 'customTags' });
    const doc = new TestModel({ customTags: ['tag1', 'tag2'] });

    await expect(doc.save()).resolves.not.toThrow();
    const savedDoc = await TestModel.findOne({ _id: doc._id });

    expect(savedDoc).toBeDefined();
    expect(savedDoc?.customTags).toEqual(['tag1', 'tag2']);
  });

  it('should add a text index when index is set to "text"', () => {
    const TestModel = createTestModel({ index: 'text' });
    const indexes = TestModel.schema.indexes();

    const textIndex = indexes.find(([fields]) => fields.tags === 'text');
    expect(textIndex).toBeDefined();
  });

  it('should add a hashed index when index is set to "hashed"', () => {
    const TestModel = createTestModel({ index: 'hashed' });
    const indexes = TestModel.schema.indexes();

    const textIndex = indexes.find(([fields]) => fields.tags === 'hashed');
    expect(textIndex).toBeDefined();
  });
});
