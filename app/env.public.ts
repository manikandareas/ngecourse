import { replaceKeys } from 'string-ts';
import z from 'zod';

const publicEnvSchema = z.object({
  VITE_CLERK_PUBLISHABLE_KEY: z.string().min(1).optional(),

  VITE_SANITY_PROJECT_ID: z.string().min(1),
  VITE_SANITY_DATASET: z.string().min(1),
  VITE_SANITY_API_VERSION: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'API version must be in YYYY-MM-DD format'),
  VITE_SANITY_SECRET_TOKEN: z.string().min(40),

  VITE_EXTERNAL_SERVICE_URL: z.string().default('http://localhost:4000'),
});

function makeTypedEnv<T>(schema: { parse: (data: unknown) => T }) {
  return (args: Record<string, unknown>) =>
    replaceKeys(schema.parse(args), 'VITE_', '');
}

const getPublicEnv = makeTypedEnv(publicEnvSchema);

export { getPublicEnv, makeTypedEnv, publicEnvSchema };

// HOW TO USE
// const env = getPublicEnv(import.meta.env).CLERK_PUBLISHABLE_KEY;
