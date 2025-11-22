import { Document, Model, Schema, Types } from 'mongoose';

import { Id, toObjectId, toStringId } from '../helpers.js';
import { PluginFunction } from '../types.js';

export const defaultReactionTypes = ['👍', '❤️', '🤔', '😂', '😮'] as const;

export type ReactionType = (typeof defaultReactionTypes)[number];

export interface ReactionCountSummary {
  perType: Record<string, number>;
  total: number;
}

export type ReactionUserField<UserField extends string = 'user'> = {
  [key in UserField]: Types.ObjectId;
};

export type ReactionTypeField<TypeField extends string = 'type'> = {
  [key in TypeField]: string;
};

export type ReactionTimestampField<TimestampField extends string = 'createdAt'> = {
  [key in TimestampField]?: Date;
};

export type ReactionEntry<
  UserField extends string = 'user',
  TypeField extends string = 'type',
  TimestampField extends string = 'createdAt',
> = ReactionTimestampField<TimestampField> &
  ReactionTypeField<TypeField> &
  ReactionUserField<UserField>;

export type WithReactions<
  Field extends string = 'reactions',
  UserField extends string = 'user',
  TypeField extends string = 'type',
  TimestampField extends string = 'createdAt',
> = {
  [key in Field]: ReactionEntry<UserField, TypeField, TimestampField>[];
};

export interface WithReactionsMethods {
  addReaction(user: Id, type: string, timestampValue?: Date): this;
  countReactions(type?: string): number | ReactionCountSummary;
  hasReaction(user: Id, type?: string): boolean;
  removeReaction(user: Id, type?: string): this;
}

export interface ReactionsMiddlewareOptions<
  Field extends string = 'reactions',
  UserField extends string = 'user',
  TypeField extends string = 'type',
  TimestampField extends string = 'createdAt',
> {
  allowedTypes?: readonly string[];
  allowMultiplePerUser?: boolean;
  field?: Field;
  indexType?: -1 | 1 | boolean;
  indexUser?: -1 | 1 | boolean;
  timestamp?: boolean;
  timestampField?: TimestampField;
  typeField?: TypeField;
  userField?: UserField;
  userRef?: string;
}

const reactionsMiddleware: PluginFunction<ReactionsMiddlewareOptions> = <
  Field extends string = 'reactions',
  UserField extends string = 'user',
  TypeField extends string = 'type',
  TimestampField extends string = 'createdAt',
  DocType extends Document &
    WithReactions<Field, UserField, TypeField, TimestampField> &
    WithReactionsMethods = Document &
    WithReactions<Field, UserField, TypeField, TimestampField> &
    WithReactionsMethods,
>(
  schema: Schema<DocType, Model<DocType>>,
  {
    allowedTypes = defaultReactionTypes,
    allowMultiplePerUser = false,
    field = 'reactions' as Field,
    indexType = false,
    indexUser = true,
    timestamp = true,
    timestampField = 'createdAt' as TimestampField,
    typeField = 'type' as TypeField,
    userField = 'user' as UserField,
    userRef = 'User',
  }: ReactionsMiddlewareOptions<Field, UserField, TypeField, TimestampField> = {},
): void => {
  const allowedTypesSet = new Set(allowedTypes);
  const shouldEnforceAllowedTypes = allowedTypesSet.size > 0;

  const reactionSchemaDefinition: Record<string, unknown> = {
    [userField]: {
      ref: userRef,
      required: true,
      type: Types.ObjectId,
    },
    [typeField]: {
      required: true,
      type: String,
      ...(shouldEnforceAllowedTypes && { enum: Array.from(allowedTypesSet) }),
    },
  };

  const reactionsSubSchema = new Schema<ReactionEntry<UserField, TypeField, TimestampField>>(
    reactionSchemaDefinition,
    {
      _id: false,
      timestamps: timestamp ? { createdAt: timestampField, updatedAt: false } : false,
    },
  );

  schema.add(
    new Schema<WithReactions<Field, UserField, TypeField, TimestampField>>({
      [field]: {
        default: [],
        type: [reactionsSubSchema],
      },
    }),
  );

  if (indexUser) {
    schema.index({ [`${field}.${userField}`]: indexUser === true ? 1 : indexUser });
  }

  if (indexType) {
    schema.index({ [`${field}.${typeField}`]: indexType === true ? 1 : indexType });
  }

  const ensureAllowedType = (reactionType: string): void => {
    if (shouldEnforceAllowedTypes && !allowedTypesSet.has(reactionType)) {
      throw new Error(`Reaction type "${reactionType}" is not permitted.`);
    }
  };

  const normalizeEntry = (
    entry: ReactionEntry<UserField, TypeField, TimestampField>,
  ): null | ReactionEntry<UserField, TypeField, TimestampField> => {
    const userValue = entry[userField];
    const typeValue = entry[typeField];

    if (!userValue || !typeValue) {
      return null;
    }

    ensureAllowedType(typeValue);

    const normalized: ReactionEntry<UserField, TypeField, TimestampField> = {
      ...entry,
      [userField]: toObjectId(userValue),
      [typeField]: typeValue,
    } as ReactionEntry<UserField, TypeField, TimestampField>;

    const rawTimestamp = entry[timestampField] as unknown;

    if (timestamp) {
      if (rawTimestamp instanceof Date) {
        normalized[timestampField] = rawTimestamp as ReactionEntry<
          UserField,
          TypeField,
          TimestampField
        >[TimestampField];
      } else if (rawTimestamp === undefined) {
        normalized[timestampField] = new Date() as ReactionEntry<
          UserField,
          TypeField,
          TimestampField
        >[TimestampField];
      } else if (typeof rawTimestamp === 'string' || typeof rawTimestamp === 'number') {
        normalized[timestampField] = new Date(rawTimestamp) as ReactionEntry<
          UserField,
          TypeField,
          TimestampField
        >[TimestampField];
      }
    } else if (rawTimestamp !== undefined) {
      delete (normalized as Record<string, unknown>)[timestampField];
    }

    return normalized;
  };

  schema.pre<DocType>('save', function reactionsPreSave(this: DocType) {
    const existing =
      (this.get(field) as ReactionEntry<UserField, TypeField, TimestampField>[] | undefined) ?? [];

    if (!existing.length) {
      return;
    }

    const normalizedEntries: ReactionEntry<UserField, TypeField, TimestampField>[] = [];
    const seenUsers = new Map<string, number>();
    let modified = false;

    for (const entry of existing) {
      const normalized = normalizeEntry(entry);
      if (!normalized) {
        modified = true;
        continue;
      }

      if (!allowMultiplePerUser) {
        const userKey = normalized[userField].toString();
        const idx = seenUsers.get(userKey);

        if (idx !== undefined) {
          normalizedEntries[idx] = normalized;
          modified = true;
        } else {
          seenUsers.set(userKey, normalizedEntries.length);
          normalizedEntries.push(normalized);
        }
      } else {
        normalizedEntries.push(normalized);
      }
    }

    if (normalizedEntries.length !== existing.length || modified) {
      this.set(field, normalizedEntries);
    }
  });

  schema.methods.addReaction = function addReaction(
    this: DocType,
    user: Id,
    reactionType: string,
    timestampValue?: Date,
  ): DocType {
    ensureAllowedType(reactionType);

    const userId = toObjectId(user);
    const userKey = userId.toString();
    const reactions = (
      (this.get(field) as ReactionEntry<UserField, TypeField, TimestampField>[]) ?? []
    )
      .map((entry) => normalizeEntry(entry))
      .filter(
        (entry): entry is ReactionEntry<UserField, TypeField, TimestampField> => entry !== null,
      );

    let updated = false;

    if (!allowMultiplePerUser) {
      const existingIndex = reactions.findIndex(
        (entry) => entry[userField]?.toString() === userKey,
      );

      const newEntry: ReactionEntry<UserField, TypeField, TimestampField> = {
        [userField]: userId,
        [typeField]: reactionType,
      } as ReactionEntry<UserField, TypeField, TimestampField>;

      if (timestamp) {
        newEntry[timestampField] = (timestampValue ?? new Date()) as ReactionEntry<
          UserField,
          TypeField,
          TimestampField
        >[TimestampField];
      }

      if (existingIndex !== -1) {
        reactions[existingIndex] = newEntry;
      } else {
        reactions.push(newEntry);
      }

      updated = true;
    } else {
      const newEntry: ReactionEntry<UserField, TypeField, TimestampField> = {
        [userField]: userId,
        [typeField]: reactionType,
      } as ReactionEntry<UserField, TypeField, TimestampField>;

      if (timestamp) {
        newEntry[timestampField] = (timestampValue ?? new Date()) as ReactionEntry<
          UserField,
          TypeField,
          TimestampField
        >[TimestampField];
      }

      reactions.push(newEntry);
      updated = true;
    }

    if (updated) {
      this.set(field, reactions);
    }

    return this;
  };

  schema.methods.removeReaction = function removeReaction(
    this: DocType,
    user: Id,
    reactionType?: string,
  ): DocType {
    const userKey = toStringId(user);
    const reactions =
      (this.get(field) as ReactionEntry<UserField, TypeField, TimestampField>[] | undefined) ?? [];

    const filtered = reactions.filter((entry) => {
      const matchesUser = entry[userField]?.toString() === userKey;
      if (!matchesUser) {
        return true;
      }

      if (!reactionType) {
        return false;
      }

      return entry[typeField] !== reactionType;
    });

    if (filtered.length !== reactions.length) {
      this.set(field, filtered);
    }

    return this;
  };

  schema.methods.hasReaction = function hasReaction(
    this: DocType,
    user: Id,
    reactionType?: string,
  ): boolean {
    const userKey = toStringId(user);
    const reactions =
      (this.get(field) as ReactionEntry<UserField, TypeField, TimestampField>[] | undefined) ?? [];

    return reactions.some((entry) => {
      if (entry[userField]?.toString() !== userKey) {
        return false;
      }

      if (reactionType) {
        return entry[typeField] === reactionType;
      }

      return true;
    });
  };

  schema.methods.countReactions = function countReactions(
    this: DocType,
    reactionType?: string,
  ): number | ReactionCountSummary {
    const reactions =
      (this.get(field) as ReactionEntry<UserField, TypeField, TimestampField>[] | undefined) ?? [];

    if (reactionType) {
      ensureAllowedType(reactionType);
      return reactions.filter((entry) => entry[typeField] === reactionType).length;
    }

    return reactions.reduce<ReactionCountSummary>(
      (accumulator, entry) => {
        const type = entry[typeField];
        accumulator.perType[type] = (accumulator.perType[type] ?? 0) + 1;
        accumulator.total += 1;
        return accumulator;
      },
      { total: 0, perType: {} },
    );
  };
};

export default reactionsMiddleware;
