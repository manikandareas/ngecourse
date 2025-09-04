import z from 'zod';
import { makeTypedEnv, publicEnvSchema } from './env.public';

const serverEnvSchema = publicEnvSchema.extend({
  CLERK_SECRET_KEY: z
    .string()
    .min(40, 'Clerk secret key must be at least 40 characters'),
  CLERK_WEBHOOK_SIGNING_SECRET: z.string().min(20).optional(),
  SESSION_SECRET: z
    .string()
    .min(32, 'Session secret must be at least 32 characters'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  CORS_ORIGINS: z.string().optional(),
  RATE_LIMIT_WINDOW_MS: z
    .string()
    .transform((val) => Number(val))
    .pipe(z.number().positive())
    .optional(),
  RATE_LIMIT_MAX_REQUESTS: z
    .string()
    .transform((val) => Number(val))
    .pipe(z.number().positive())
    .optional(),
});

const getEnv = makeTypedEnv(serverEnvSchema);

export { getEnv };

// HOW TO USE
// const env = getEnv(process.env).NODE_ENV;
