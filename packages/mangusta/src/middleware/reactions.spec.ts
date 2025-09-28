import { setupMongoTestEnvironment } from '@slango.configs/vitest/helpers/mongooseTestEnvironment';
import mongoose, { Document, model, Schema, Types } from 'mongoose';
import { describe, expect, it } from 'vitest';

import type { PluginFunction } from '../types.js';

import reactionsMiddleware, {
  defaultReactionTypes,
  ReactionCountSummary,
  ReactionsMiddlewareOptions,
  WithReactions,
  WithReactionsMethods,
} from './reactions.js';

setupMongoTestEnvironment();

type TestDoc<
  Field extends string = 'reactions',
  UserField extends string = 'user',
  TypeField extends string = 'type',
  TimestampField extends string = 'createdAt',
> = Document &
  WithReactions<Field, UserField, TypeField, TimestampField> &
  WithReactionsMethods & {
    [key: string]: unknown;
  };

const createTestModel = <
  Field extends string = 'reactions',
  UserField extends string = 'user',
  TypeField extends string = 'type',
  TimestampField extends string = 'createdAt',
>(
  options?: ReactionsMiddlewareOptions<Field, UserField, TypeField, TimestampField>,
) => {
  const modelName = 'ReactionsTestDoc';

  if (mongoose.models[modelName]) {
    delete mongoose.models[modelName];
  }

  const TestSchema = new Schema<TestDoc<Field, UserField, TypeField, TimestampField>>({});

  if (options) {
    TestSchema.plugin(
      reactionsMiddleware as PluginFunction<
        ReactionsMiddlewareOptions<Field, UserField, TypeField, TimestampField>
      >,
      options,
    );
  } else {
    TestSchema.plugin(reactionsMiddleware);
  }

  return model<TestDoc<Field, UserField, TypeField, TimestampField>>(modelName, TestSchema);
};

describe('reactionsMiddleware', () => {
  it('should add reactions field and persist entries with defaults', async () => {
    const TestModel = createTestModel();
    const userId = new Types.ObjectId();

    const doc = new TestModel();
    doc.reactions.push({ user: userId, type: defaultReactionTypes[0] });

    await expect(doc.save()).resolves.not.toThrow();

    const saved = await TestModel.findById(doc._id);
    expect(saved).toBeDefined();
    expect(saved!.reactions).toHaveLength(1);
    expect(saved!.reactions[0]?.user?.toString()).toBe(userId.toString());
    expect(saved!.reactions[0]?.type).toBe(defaultReactionTypes[0]);
    expect(saved!.reactions[0]?.createdAt).toBeInstanceOf(Date);
  });

  it('should deduplicate reactions for the same user when multiple reactions are disabled', async () => {
    const TestModel = createTestModel();
    const userId = new Types.ObjectId();

    const doc = new TestModel({
      reactions: [
        { user: userId, type: '👍' },
        { user: userId, type: '❤️' },
      ],
    });

    await expect(doc.save()).resolves.not.toThrow();

    const saved = await TestModel.findById(doc._id).lean();
    expect(saved).toBeDefined();
    expect(saved!.reactions).toHaveLength(1);
    expect(saved!.reactions[0]?.type).toBe('❤️');
  });

  it('should allow multiple reactions for the same user when enabled', async () => {
    const TestModel = createTestModel({ allowMultiplePerUser: true });
    const userId = new Types.ObjectId();

    const doc = new TestModel();
    doc.addReaction(userId, '👍');
    doc.addReaction(userId, '❤️');

    await expect(doc.save()).resolves.not.toThrow();

    const saved = await TestModel.findById(doc._id);
    expect(saved?.reactions).toHaveLength(2);
    const types = saved?.reactions.map((reaction) => reaction.type).sort();
    expect(types).toEqual(['❤️', '👍']);
  });

  it('should expose helper methods for managing reactions', async () => {
    const TestModel = createTestModel();
    const userId = new Types.ObjectId();

    const doc = new TestModel();
    doc.addReaction(userId, '👍');
    doc.addReaction(userId, '❤️');

    expect(doc.hasReaction(userId, '❤️')).toBe(true);
    expect(doc.hasReaction(userId, '👍')).toBe(false);

    const summary = doc.countReactions() as ReactionCountSummary;
    expect(summary.total).toBe(1);
    expect(summary.perType['❤️']).toBe(1);

    const heartCount = doc.countReactions('❤️');
    expect(heartCount).toBe(1);

    doc.removeReaction(userId, '❤️');
    expect(doc.hasReaction(userId)).toBe(false);

    await expect(doc.save()).resolves.not.toThrow();
    const saved = await TestModel.findById(doc._id);
    expect(saved?.reactions).toHaveLength(0);
  });

  it('should reject unsupported reaction types', async () => {
    const TestModel = createTestModel();
    const userId = new Types.ObjectId();
    const doc = new TestModel();

    expect(() => doc.addReaction(userId, 'unsupported')).toThrowError(
      /Reaction type "unsupported" is not permitted/,
    );

    doc.reactions.push({ user: userId, type: 'unsupported' });
    await expect(doc.save()).rejects.toThrowError(
      /`unsupported` is not a valid enum value for path `type`/,
    );
  });

  it('should allow custom configuration for field and helper schema options', async () => {
    const TestModel = createTestModel<'feedback', 'member', 'category', 'time'>({
      field: 'feedback',
      userField: 'member',
      typeField: 'category',
      timestampField: 'time',
      allowMultiplePerUser: true,
      allowedTypes: ['👏', '😲'],
      indexUser: false,
      indexType: true,
      timestamp: true,
      userRef: 'Account',
    });

    const doc = new TestModel();
    const memberId = new Types.ObjectId();

    doc.addReaction(memberId, '👏');
    doc.addReaction(memberId, '😲');

    expect(doc.hasReaction(memberId, '😲')).toBe(true);
    const stats = doc.countReactions() as ReactionCountSummary;
    expect(stats.total).toBe(2);
    expect(Object.keys(stats.perType).sort()).toEqual(['👏', '😲']);

    await expect(doc.save()).resolves.not.toThrow();

    const indexes = TestModel.schema.indexes();
    const categoryIndex = indexes.find(([fields]) =>
      Object.prototype.hasOwnProperty.call(fields, 'feedback.category'),
    );
    const memberIndex = indexes.find(([fields]) =>
      Object.prototype.hasOwnProperty.call(fields, 'feedback.member'),
    );

    expect(categoryIndex).toBeDefined();
    expect(memberIndex).toBeUndefined();

    const saved = await TestModel.findById(doc._id).lean();
    expect(saved?.feedback).toHaveLength(2);
    expect(saved?.feedback[0]).toHaveProperty('time');
    expect(saved?.feedback[1]).toHaveProperty('time');
  });

  it('should support disabling timestamps', async () => {
    const TestModel = createTestModel({ timestamp: false });
    const userId = new Types.ObjectId();

    const doc = new TestModel();
    doc.addReaction(userId, '👍');

    await expect(doc.save()).resolves.not.toThrow();

    const saved = await TestModel.findById(doc._id).lean();
    expect(saved?.reactions).toHaveLength(1);
    expect(saved?.reactions[0]?.createdAt).toBeUndefined();
  });
});
