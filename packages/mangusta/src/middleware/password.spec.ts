import mongoose, { Document, model, Schema } from 'mongoose';
import { describe, expect, it } from 'vitest';

import type { PluginFunction } from '../types.js';

import { setupMongoTestEnvironment } from '../test-utils/mongooseTestEnvironment.js';
import passwordMiddleware, { PasswordMiddlewareOptions, WithPassword } from './password.js';

setupMongoTestEnvironment();

type TestDoc<
  Field extends string = 'password',
  ComparisonFunction extends string = 'comparePassword',
> = Document & WithPassword<Field, ComparisonFunction>;

const createTestModel = <
  Field extends string = 'password',
  ComparisonFunction extends string = 'comparePassword',
>(
  options?: PasswordMiddlewareOptions<Field, ComparisonFunction>,
) => {
  const modelName = 'TestDoc';

  if (mongoose.models[modelName]) {
    delete mongoose.models[modelName];
  }

  const TestSchema = new Schema<TestDoc<Field, ComparisonFunction>>({});
  if (options) {
    TestSchema.plugin(
      passwordMiddleware as PluginFunction<PasswordMiddlewareOptions<Field, ComparisonFunction>>,
      options,
    );
  } else {
    TestSchema.plugin(passwordMiddleware);
  }

  return model<TestDoc<Field, ComparisonFunction>>(modelName, TestSchema);
};

describe('passwordMiddleware', () => {
  it('should hash password and provide comparison method', async () => {
    const TestModel = createTestModel();
    const plain = 'Valid@123';
    const doc = new TestModel({ password: plain });

    await expect(doc.save()).resolves.not.toThrow();
    const saved = await TestModel.findById(doc._id);

    expect(saved).toBeDefined();
    expect(saved!.password).not.toBe(plain);
    await expect(saved!.comparePassword(plain)).resolves.toBe(true);
    await expect(saved!.comparePassword('Wrong@123')).resolves.toBe(false);
  });

  it('should reject invalid passwords', async () => {
    const TestModel = createTestModel();
    const doc = new TestModel({ password: 'invalid' });

    await expect(doc.save()).rejects.toThrowError(mongoose.Error.ValidationError);
  });

  it('should allow configuring field and comparison function names', async () => {
    const TestModel = createTestModel<'pass', 'checkPassword'>({
      field: 'pass',
      comparisonFunction: 'checkPassword',
    });
    const doc = new TestModel({ pass: 'Valid@123' });

    await expect(doc.save()).resolves.not.toThrow();
    const saved = await TestModel.findById(doc._id);

    expect(saved).toBeDefined();
    await expect(saved!.checkPassword('Valid@123')).resolves.toBe(true);
  });

  it('should allow optional password field when required is false', async () => {
    const TestModel = createTestModel({ required: false });
    const doc = new TestModel({});

    await expect(doc.save()).resolves.not.toThrow();
  });
});
