import { setupMongoTestEnvironment } from '@slango.configs/vitest/helpers/mongooseTestEnvironment';
import mongoose, { Document, model, Schema } from 'mongoose';
import { describe, expect, it } from 'vitest';

import { PluginFunction } from '../types.js';
import compactIdMiddleware, { CompactIdMiddlewareOptions, WithCompactId } from './compactId.js';

setupMongoTestEnvironment();

type TestDoc<Field extends string = 'shortId'> = Document & WithCompactId<Field>;

const createTestModel = <Field extends string = 'shortId'>(
  options?: CompactIdMiddlewareOptions<Field>,
) => {
  const modelName = 'TestDoc';

  if (mongoose.models[modelName]) {
    delete mongoose.models[modelName];
  }

  const TestSchema = new Schema<TestDoc<Field>>({});
  if (options) {
    TestSchema.plugin(
      compactIdMiddleware as PluginFunction<CompactIdMiddlewareOptions<Field>>,
      options,
    );
  } else {
    TestSchema.plugin(compactIdMiddleware);
  }

  return model<TestDoc<Field>>(modelName, TestSchema);
};

describe('compactIdMiddleware', () => {
  it('should add a "shortId" field by default with correct options', async () => {
    const TestModel = createTestModel();
    const doc = new TestModel();

    await expect(doc.save()).resolves.not.toThrow();
    const savedDoc = await TestModel.findOne({ _id: doc._id });
    expect(savedDoc).toBeDefined();
    expect(savedDoc?.shortId).toBeDefined();
    expect(savedDoc?.shortId.length).toBe(9);
  });

  it('should generate a compactId of specified length', async () => {
    const TestModel = createTestModel({ length: 12 });
    const doc = new TestModel();

    await expect(doc.save()).resolves.not.toThrow();
    const savedDoc = await TestModel.findOne({ _id: doc._id });
    expect(savedDoc?.shortId).toHaveLength(12);
  });

  it('should allow configuring the field name', async () => {
    const TestModel = createTestModel<'customId'>({ field: 'customId' });
    const doc = new TestModel();

    await expect(doc.save()).resolves.not.toThrow();
    const savedDoc = await TestModel.findOne({ _id: doc._id });
    expect(savedDoc).toBeDefined();
    expect(savedDoc?.customId).toBeDefined();
  });

  it('should not generate "index" if not requested', () => {
    const TestModel = createTestModel({ index: false });
    const indexes = TestModel.schema.indexes();
    const customIdIndex = indexes.find(([fields]) =>
      Object.prototype.hasOwnProperty.call(fields, 'shortId'),
    );

    expect(customIdIndex).toBeUndefined();
  });

  it('should apply "index" and not "unique" options to the field', () => {
    const TestModel = createTestModel({ index: true, unique: false });
    const indexes = TestModel.schema.indexes();
    const customIdIndex = indexes.find(([fields]) =>
      Object.prototype.hasOwnProperty.call(fields, 'shortId'),
    );

    expect(customIdIndex).toBeDefined();
    expect(customIdIndex![0].shortId).toBe(1);
    expect(customIdIndex![1].unique).toBe(false);
  });

  it('should apply "unique" and "unique" options to the field', () => {
    const TestModel = createTestModel({ index: true, unique: true });
    const indexes = TestModel.schema.indexes();
    const customIdIndex = indexes.find(([fields]) =>
      Object.prototype.hasOwnProperty.call(fields, 'shortId'),
    );

    expect(customIdIndex).toBeDefined();
    expect(customIdIndex![0].shortId).toBe(1);
    expect(customIdIndex![1].unique).toBe(true);
  });
});
