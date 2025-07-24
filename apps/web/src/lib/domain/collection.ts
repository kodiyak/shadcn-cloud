import z from 'zod';

export const collectionSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable(),
	slug: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
});
export type Collection = z.infer<typeof collectionSchema>;
