import { setupMongoTestEnvironment } from '@slango.configs/vitest/helpers/mongooseTestEnvironment';
import mongoose, { Document, model, Schema } from 'mongoose';
import { setTimeout as delay } from 'node:timers/promises';
import { describe, expect, it } from 'vitest';

import timestampsMiddleware, { TimestampsMiddlewareOptions, WithTimestamps } from './timestamps.js';

setupMongoTestEnvironment();

type TestDoc = Document & WithTimestamps & { name: string };

const createTestModel = (options?: TimestampsMiddlewareOptions) => {
  const modelName = 'TestDoc';

  if (mongoose.models[modelName]) {
    delete mongoose.models[modelName];
  }

  const TestSchema = new Schema<TestDoc>({
    name: String,
  });

  if (options) {
    TestSchema.plugin(timestampsMiddleware, options);
  } else {
    TestSchema.plugin(timestampsMiddleware);
  }

  return model<TestDoc>(modelName, TestSchema);
};

describe('timestampsMiddleware', () => {
  it('should store creation and update timestamps correctly on save', async () => {
    const TestModel = createTestModel();
    const doc = new TestModel({ name: 'initial' });

    await expect(doc.save()).resolves.not.toThrow();

    const savedDoc = await TestModel.findById(doc._id);
    expect(savedDoc).not.toBeNull();
    if (!savedDoc) return;
    expect(savedDoc.created).toBeInstanceOf(Date);
    expect(savedDoc.updated).not.toBeDefined();

    await delay(10);
    savedDoc.name = 'changed';
    await expect(savedDoc.save()).resolves.not.toThrow();

    const updatedDoc = await TestModel.findById(doc._id);
    expect(updatedDoc).not.toBeNull();
    if (!updatedDoc) return;
    expect(updatedDoc.created).toEqual(savedDoc.created);
    expect(updatedDoc.updated).toBeInstanceOf(Date);
    if (!updatedDoc.created || !updatedDoc.updated) return;
    expect(updatedDoc.updated.getTime()).toBeGreaterThan(updatedDoc.created.getTime());
  });

  it('should update timestamp when using updateOne operations', async () => {
    const TestModel = createTestModel();
    const doc = new TestModel({ name: 'initial' });
    await doc.save();

    await delay(10);
    await TestModel.updateOne({ _id: doc._id }, { name: 'updated' });

    const updatedDoc = await TestModel.findById(doc._id);
    expect(updatedDoc).not.toBeNull();
    if (!updatedDoc) return;
    expect(updatedDoc.updated).not.toBeDefined();
    if (!updatedDoc.created || !updatedDoc.updated) return;
    expect(updatedDoc.updated.getTime()).toBeGreaterThan(updatedDoc.created.getTime());
  });

  it('should add an index on the update field when indexUpdate is true', () => {
    const TestModel = createTestModel({ indexUpdate: true });
    const indexes = TestModel.schema.indexes();

    const index = indexes.find(([fields]) => fields.updated === 1);
    expect(index).toBeDefined();
  });
});
