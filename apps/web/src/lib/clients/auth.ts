import { createAuth, createAuthMiddleware } from '@workspace/auth';
import { db } from './db';

export const auth = createAuth({
	db,
	secret: process.env.BETTER_AUTH_SECRET as string,
	baseURL: process.env.BETTER_AUTH_URL as string,
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID as string,
			clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
			mapProfileToUser: (profile) => {
				return {
					username: profile.login || profile.name,
					displayUsername: profile.login || profile.name,
				};
			},
		},
	},
	hooks: {
		after: createAuthMiddleware(async ({ context }) => {
			if (context.newSession) {
				const { profile } = await db.user.findUniqueOrThrow({
					where: { id: context.newSession.user.id },
					select: {
						profile: { select: { id: true } },
					},
				});

				if (profile?.id) {
					return;
				}
				const {
					username,
					image: avatarUrl,
					id: userId,
				} = context.newSession.user;

				if (!context.newSession.user.username) {
					throw new Error('User does not have a username set.');
				}

				await db.profile.create({
					data: {
						userId,
						username,
						avatarUrl,
						githubUrl: `https://github.com/${username}`,
					},
				});
			}
		}),
	},
});
