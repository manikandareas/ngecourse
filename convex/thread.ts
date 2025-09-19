import { v } from 'convex/values';
import z from 'zod';
import { action } from './_generated/server';
import { geniiAgent } from './agents/genii';

export const updateThreadTitle = action({
  args: { threadId: v.string() },
  handler: async (ctx, { threadId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('User not authenticated');
    }

    const { thread } = await geniiAgent.continueThread(ctx, { threadId });
    const {
      object: { title, summary },
    } = await thread.generateObject(
      {
        mode: 'json',
        schemaDescription:
          "Generate a title and summary for the thread. The title should be a single sentence that captures the main topic of the thread. The summary should be a short description of the thread that could be used to describe it to someone who hasn't read it.",
        schema: z.object({
          title: z.string().describe('The new title for the thread'),
          summary: z.string().describe('The new summary for the thread'),
        }),
        prompt: 'Generate a title and summary for this thread.',
      },
      { storageOptions: { saveMessages: 'none' } }
    );
    await thread.updateMetadata({ title, summary });
  },
});
