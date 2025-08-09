import { setupMongoTestEnvironment } from '@slango.configs/vitest/helpers/mongooseTestEnvironment';
import mongoose, { Document, model, Schema } from 'mongoose';
import { describe, expect, it } from 'vitest';

import timestampsMiddleware, {
  TimestampsMiddlewareOptions,
  WithTimestamps,
} from './timestamps.js';

setupMongoTestEnvironment();

type TestDoc<
  Created extends string = 'created',
  Updated extends string = 'updated',
> = Document & WithTimestamps<Created, Updated>;

const createTestModel = <
  Created extends string = 'created',
  Updated extends string = 'updated',
>(options?: TimestampsMiddlewareOptions) => {
  const modelName = 'TestDoc';

  if (mongoose.models[modelName]) {
    delete mongoose.models[modelName];
  }

  const TestSchema = new Schema<TestDoc<Created, Updated>>({});
  if (options) {
    TestSchema.plugin(timestampsMiddleware, options);
  } else {
    TestSchema.plugin(timestampsMiddleware);
  }

  return model<TestDoc<Created, Updated>>(modelName, TestSchema);
};

describe('timestampsMiddleware', () => {
  it('should set creation timestamp and update timestamp on updates', async () => {
    const TestModel = createTestModel();
    const doc = new TestModel({});

    await expect(doc.save()).resolves.not.toThrow();
    const saved = await TestModel.findById(doc._id).lean();

    expect(saved?.created).toBeInstanceOf(Date);
    expect(saved?.updated).toBeNull();

    await TestModel.updateOne({ _id: doc._id }, { $set: { foo: 'bar' } });
    const updated = await TestModel.findById(doc._id).lean();

    expect(updated?.updated).toBeInstanceOf(Date);
    expect(updated!.updated!.getTime()).toBeGreaterThan((updated!.created as Date).getTime());
  });

  it('should allow custom field names', async () => {
    const TestModel = createTestModel<'createdAt', 'updatedAt'>({
      creationField: 'createdAt',
      updateField: 'updatedAt',
    });
    const doc = new TestModel({});

    await expect(doc.save()).resolves.not.toThrow();
    const saved = await TestModel.findById(doc._id).lean();

    expect(saved?.createdAt).toBeInstanceOf(Date);
    expect(saved?.updatedAt).toBeNull();

    await TestModel.updateOne({ _id: doc._id }, { $set: { name: 'test' } });
    const updated = await TestModel.findById(doc._id).lean();

    expect(updated?.updatedAt).toBeInstanceOf(Date);
  });

  it('should set update timestamp on creation when updateTimestampOnCreation is true', async () => {
    const TestModel = createTestModel({ updateTimestampOnCreation: true });
    const doc = new TestModel({});

    await expect(doc.save()).resolves.not.toThrow();
    const saved = await TestModel.findById(doc._id).lean();

    expect(saved?.created).toBeInstanceOf(Date);
    expect(saved?.updated).toBeInstanceOf(Date);
  });
});

