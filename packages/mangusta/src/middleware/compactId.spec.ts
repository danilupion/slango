import { Document } from 'mongoose';
import { describe, expect, it } from 'vitest';

import { createModelWithPlugin } from '../test-utils/model.js';
import { setupMongoTestEnvironment } from '../test-utils/mongooseTestEnvironment.js';
import { PluginFunction } from '../types.js';
import compactIdMiddleware, { CompactIdMiddlewareOptions, WithCompactId } from './compactId.js';

setupMongoTestEnvironment();

type TestDoc<Field extends string = 'shortId'> = Document & WithCompactId<Field>;

const createTestModel = <Field extends string = 'shortId'>(
  options?: CompactIdMiddlewareOptions<Field>,
) =>
  createModelWithPlugin<TestDoc<Field>, CompactIdMiddlewareOptions<Field>>({
    modelName: 'TestDoc',
    plugin: compactIdMiddleware as PluginFunction<CompactIdMiddlewareOptions<Field>>,
    pluginOptions: options,
  });

describe('compactIdMiddleware', () => {
  it('should add a "shortId" field by default with correct options', async () => {
    const { model: TestModel } = createTestModel();
    const doc = new TestModel();

    await expect(doc.save()).resolves.not.toThrow();
    const savedDoc = await TestModel.findOne({ _id: doc._id });
    expect(savedDoc).toBeDefined();
    expect(savedDoc?.shortId).toBeDefined();
    expect(savedDoc?.shortId.length).toBe(9);
  });

  it('should generate a compactId of specified length', async () => {
    const { model: TestModel } = createTestModel({ length: 12 });
    const doc = new TestModel();

    await expect(doc.save()).resolves.not.toThrow();
    const savedDoc = await TestModel.findOne({ _id: doc._id });
    expect(savedDoc?.shortId).toHaveLength(12);
  });

  it('should allow configuring the field name', async () => {
    const { model: TestModel } = createTestModel<'customId'>({ field: 'customId' });
    const doc = new TestModel();

    await expect(doc.save()).resolves.not.toThrow();
    const savedDoc = await TestModel.findOne({ _id: doc._id });
    expect(savedDoc).toBeDefined();
    expect(savedDoc?.customId).toBeDefined();
  });

  it('should not generate "index" if not requested', () => {
    const { schema } = createTestModel({ index: false });
    const indexes = schema.indexes();
    const customIdIndex = indexes.find(([fields]) =>
      Object.prototype.hasOwnProperty.call(fields, 'shortId'),
    );

    expect(customIdIndex).toBeUndefined();
  });

  it('should apply "index" and not "unique" options to the field', () => {
    const { schema } = createTestModel({ index: true, unique: false });
    const indexes = schema.indexes();
    const customIdIndex = indexes.find(([fields]) =>
      Object.prototype.hasOwnProperty.call(fields, 'shortId'),
    );

    expect(customIdIndex).toBeDefined();
    expect(customIdIndex![0].shortId).toBe(1);
    const uniqueOption = customIdIndex?.[1]?.unique;
    expect(uniqueOption).toBe(false);
  });

  it('should apply "unique" and "unique" options to the field', () => {
    const { schema } = createTestModel({ index: true, unique: true });
    const indexes = schema.indexes();
    const customIdIndex = indexes.find(([fields]) =>
      Object.prototype.hasOwnProperty.call(fields, 'shortId'),
    );

    expect(customIdIndex).toBeDefined();
    expect(customIdIndex![0].shortId).toBe(1);
    const uniqueOption = customIdIndex?.[1]?.unique;
    expect(uniqueOption).toBe(true);
  });
});
