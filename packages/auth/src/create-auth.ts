import { betterAuth, type BetterAuthOptions } from 'better-auth';
import { bearer, jwt } from 'better-auth/plugins';
import { generateId } from '@workspace/core';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@workspace/db';

interface AuthConfig {
  db: PrismaClient;
  secret: string;
  baseURL: string;
  socialProviders: BetterAuthOptions['socialProviders'];
}

type CreateAuthOutput = ReturnType<typeof betterAuth>;

export function createAuth(config: AuthConfig): CreateAuthOutput {
  const options: BetterAuthOptions = {
    plugins: [jwt(), bearer()],
    secret: config.secret,
    baseURL: config.baseURL,
    socialProviders: config.socialProviders,
    user: { modelName: 'User' },
    account: { modelName: 'Account' },
    verification: { modelName: 'Verification' },
    session: { modelName: 'Session' },
    advanced: {
      database: {
        generateId: ({ model }) => {
          return generateId(model.slice(0, 2));
        },
      },
    },
    database: prismaAdapter(config.db, {
      provider: 'postgresql',
    }),
  };

  return betterAuth(options);
}
