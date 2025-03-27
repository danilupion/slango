import { setupMongoTestEnvironment } from '@slango.configs/vitest/helpers/mongooseTestEnvironment';
import mongoose, { Document, model, Schema, Types } from 'mongoose';
import { describe, expect, it } from 'vitest';

import { PluginFunction } from '../types.js';
import ownerMiddleware, { OwnerMiddlewareOptions, WithOwner } from './owner.js';

setupMongoTestEnvironment();

type TestDoc<Field extends string = 'user'> = Document<Types.ObjectId> &
  WithOwner<Types.ObjectId, Field>;

const createTestModel = <Field extends string = 'user'>(
  options?: OwnerMiddlewareOptions<Field>,
) => {
  const modelName = 'TestDoc';

  if (mongoose.models[modelName]) {
    delete mongoose.models[modelName];
  }

  const TestSchema = new Schema<TestDoc<Field>>({});
  if (options) {
    TestSchema.plugin(ownerMiddleware as PluginFunction<OwnerMiddlewareOptions<Field>>, options);
  } else {
    TestSchema.plugin(ownerMiddleware);
  }

  return model<TestDoc<Field>>(modelName, TestSchema);
};

describe('ownerMiddleware', () => {
  it('should add a "user" field by default with correct options', async () => {
    const TestModel = createTestModel();
    const doc = new TestModel({ user: new Types.ObjectId() });

    await expect(doc.save()).resolves.not.toThrow();
    const savedDoc = await TestModel.findOne({ _id: doc._id });
    expect(savedDoc).toBeDefined();
    expect(savedDoc?.user?.toString()).toBe(doc.user.toString());
  });

  it('should not allow saving without user field if required', async () => {
    const TestModel = createTestModel();
    const doc = new TestModel({});

    await expect(doc.save()).rejects.toThrowError(mongoose.Error.ValidationError);
  });

  it('should allow configuring the field name', async () => {
    const TestModel = createTestModel<'owner'>({ field: 'owner' });
    const doc = new TestModel({ owner: new Types.ObjectId() });

    await expect(doc.save()).resolves.not.toThrow();
    const savedDoc = await TestModel.findOne({ _id: doc._id });

    expect(savedDoc).toBeDefined();
    expect(savedDoc?.owner?.toString()).toBe(doc.owner.toString());
  });

  it('should allow optional "user" field if "required" is set to false', async () => {
    const TestModel = createTestModel({ required: false });
    const doc = new TestModel({});

    await expect(doc.save()).resolves.not.toThrow();
    const savedDoc = await TestModel.findOne({ _id: doc._id });
    expect(savedDoc).toBeDefined();
    expect(savedDoc?.user).toBeUndefined();
  });

  it('should apply "index" option to the field', () => {
    const TestModel = createTestModel({ index: true });
    const indexes = TestModel.schema.indexes();
    const userIndex = indexes.find(([fields]) =>
      Object.prototype.hasOwnProperty.call(fields, 'user'),
    );

    expect(userIndex).toBeDefined();
    expect(userIndex![0].user).toBe(1);
  });

  it('should reference the specified model in "ref"', () => {
    const TestModel = createTestModel({ ref: 'CustomUser' });
    const refField = TestModel.schema.path('user');

    expect(refField.options.ref).toBe('CustomUser');
  });
});
