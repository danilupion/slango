import { setupMongoTestEnvironment } from '@slango.configs/vitest/helpers/mongooseTestEnvironment';
import mongoose, { Document, model, Schema } from 'mongoose';
import { describe, expect, it } from 'vitest';

import emailMiddleware from './email.js';

setupMongoTestEnvironment();

interface TestUser extends Document {
  email: string;
}

const TestUserSchema = new Schema<TestUser>({});
TestUserSchema.plugin(emailMiddleware);

const TestUserModel = model<TestUser>('TestUser', TestUserSchema);

const validEmail = 'valid.email@example.com';
const invalidEmail = 'invalid-email';
const customErrorMessage = 'Custom error message for invalid email';

describe('emailMiddleware', () => {
  it('should allow saving a user with a valid email', async () => {
    const user = new TestUserModel({ email: validEmail });

    await expect(user.save()).resolves.not.toThrow();
  });

  it('should fail when saving a user with an invalid email', async () => {
    const user = new TestUserModel({ email: invalidEmail });

    await expect(user.save()).rejects.toThrowError(mongoose.Error.ValidationError);
  });

  it('should enforce uniqueness for email', async () => {
    const user1 = new TestUserModel({ email: validEmail });
    const user2 = new TestUserModel({ email: validEmail });

    await user1.save();
    await expect(user2.save()).rejects.toThrowError(Error);
  });

  it('should allow saving a user without an email if "required" is set to false', async () => {
    const OptionalEmailUserSchema = new Schema<TestUser>({});
    OptionalEmailUserSchema.plugin(emailMiddleware, { required: false });
    const OptionalEmailUserModel = model<TestUser>('OptionalEmailUser', OptionalEmailUserSchema);

    const user = new OptionalEmailUserModel({});

    await expect(user.save()).resolves.not.toThrow();
  });

  it('should display custom error message for invalid email', async () => {
    const CustomMessageSchema = new Schema<TestUser>({});
    CustomMessageSchema.plugin(emailMiddleware, { doesNotMatchMessage: customErrorMessage });
    const CustomMessageUserModel = model<TestUser>('CustomMessageUser', CustomMessageSchema);

    const user = new CustomMessageUserModel({ email: invalidEmail });

    await expect(user.save()).rejects.toThrowError(customErrorMessage);
  });

  it('should allow saving a user with a non-unique email if "unique" is set to false', async () => {
    const NonUniqueEmailSchema = new Schema<TestUser>({});
    NonUniqueEmailSchema.plugin(emailMiddleware, { unique: false });
    const NonUniqueEmailUserModel = model<TestUser>('NonUniqueEmailUser', NonUniqueEmailSchema);

    const user1 = new NonUniqueEmailUserModel({ email: validEmail });
    const user2 = new NonUniqueEmailUserModel({ email: validEmail });

    await expect(user1.save()).resolves.not.toThrow();
    await expect(user2.save()).resolves.not.toThrow(); // Should pass without unique constraint
  });

  it('should trim email addresses before saving', async () => {
    const user = new TestUserModel({ email: ` ${validEmail} ` });

    await user.save();
    const savedUser = await TestUserModel.findOne({ email: validEmail });

    expect(savedUser).toBeDefined();
    expect(savedUser?.email).toBe(validEmail);
  });
});
