import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

const schema = defineSchema({
  chat_conversations: defineTable({
    clerkId: v.string(),
    threadId: v.string(),
    sectionKey: v.optional(v.string()),
    lessonId: v.optional(v.string()),
    contextTitle: v.optional(v.string()),
    sectionContent: v.optional(v.string()),
    title: v.optional(v.string()),
    updatedAt: v.number(),
    isArchived: v.boolean(),
  })
    .index('by_clerkId', ['clerkId'])
    .index('by_thread_id', ['threadId'])
    .index('by_section_key', ['sectionKey'])
    .index('by_lesson_id', ['lessonId']),
});

export default schema;
