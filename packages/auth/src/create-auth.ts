import { generateId } from '@workspace/core';
import type { PrismaClient } from '@workspace/db';
import { type BetterAuthOptions, betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { bearer, jwt, username } from 'better-auth/plugins';

interface AuthConfig {
	db: PrismaClient;
	secret: string;
	baseURL: string;
	socialProviders: BetterAuthOptions['socialProviders'];
	hooks?: BetterAuthOptions['hooks'];
}

type CreateAuthOutput = ReturnType<typeof betterAuth>;

export { createAuthMiddleware } from 'better-auth/plugins';
export function createAuth(config: AuthConfig): CreateAuthOutput {
	const options: BetterAuthOptions = {
		plugins: [jwt(), bearer(), username()],
		secret: config.secret,
		baseURL: config.baseURL,
		socialProviders: config.socialProviders,
		user: { modelName: 'User' },
		account: { modelName: 'Account' },
		verification: { modelName: 'Verification' },
		session: { modelName: 'Session' },
		hooks: config.hooks,
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

	const auth = betterAuth(options);
	return auth;
}
