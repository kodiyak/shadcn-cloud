import z from 'zod';

export const publishSchema = z.object({
	isTemplate: z.boolean(),
	isForkable: z.boolean(),
});
export type PublishProps = z.infer<typeof publishSchema>;
