import z from 'zod';

export const profileSchema = z.object({
	username: z.string(),
	userId: z.string(),
	bio: z.string().nullish(),
	avatarUrl: z.string().nullish(),
	githubUrl: z.string().nullish(),
	websiteUrl: z.string().nullish(),
	twitterUrl: z.string().nullish(),
});
export type Profile = z.infer<typeof profileSchema>;
