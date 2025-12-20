import mongoose, { Document, Types } from 'mongoose';
import { describe, expect, it } from 'vitest';

import { createModelWithPlugin } from '../test-utils/model.js';
import { setupMongoTestEnvironment } from '../test-utils/mongooseTestEnvironment.js';
import { PluginFunction } from '../types.js';
import ownerMiddleware, { OwnerMiddlewareOptions, WithOwner } from './owner.js';

setupMongoTestEnvironment();

type TestDoc<Field extends string = 'user'> = Document<Types.ObjectId> &
  WithOwner<Types.ObjectId, Field>;

const createTestModel = <Field extends string = 'user'>(options?: OwnerMiddlewareOptions<Field>) =>
  createModelWithPlugin<TestDoc<Field>, OwnerMiddlewareOptions<Field>>({
    modelName: 'TestDoc',
    plugin: ownerMiddleware as PluginFunction<OwnerMiddlewareOptions<Field>>,
    pluginOptions: options,
  });

describe('ownerMiddleware', () => {
  it('should add a "user" field by default with correct options', async () => {
    const { model: TestModel } = createTestModel();
    const doc = new TestModel({ user: new Types.ObjectId() });

    await expect(doc.save()).resolves.not.toThrow();
    const savedDoc = await TestModel.findOne({ _id: doc._id });
    expect(savedDoc).toBeDefined();
    expect(savedDoc?.user?.toString()).toBe(doc.user.toString());
  });

  it('should not allow saving without user field if required', async () => {
    const { model: TestModel } = createTestModel();
    const doc = new TestModel({});

    await expect(doc.save()).rejects.toThrowError(mongoose.Error.ValidationError);
  });

  it('should allow configuring the field name', async () => {
    const { model: TestModel } = createTestModel<'owner'>({ field: 'owner' });
    const doc = new TestModel({ owner: new Types.ObjectId() });

    await expect(doc.save()).resolves.not.toThrow();
    const savedDoc = await TestModel.findOne({ _id: doc._id });

    expect(savedDoc).toBeDefined();
    expect(savedDoc?.owner?.toString()).toBe(doc.owner.toString());
  });

  it('should allow optional "user" field if "required" is set to false', async () => {
    const { model: TestModel } = createTestModel({ required: false });
    const doc = new TestModel({});

    await expect(doc.save()).resolves.not.toThrow();
    const savedDoc = await TestModel.findOne({ _id: doc._id });
    expect(savedDoc).toBeDefined();
    expect(savedDoc?.user).toBeUndefined();
  });

  it('should apply "index" option to the field', () => {
    const { schema } = createTestModel({ index: true });
    const indexes = schema.indexes();
    const userIndex = indexes.find(([fields]) =>
      Object.prototype.hasOwnProperty.call(fields, 'user'),
    );

    expect(userIndex).toBeDefined();
    expect(userIndex![0].user).toBe(1);
  });

  it('should reference the specified model in "ref"', () => {
    const { schema } = createTestModel({ ref: 'CustomUser' });
    const refField = schema.path('user');

    expect(refField.options.ref).toBe('CustomUser');
  });
});
