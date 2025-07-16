import z from 'zod';

export const publishSchema = z.object({
	isTemplate: z.boolean(),
	isForkable: z.boolean(),
});
export type PublishProps = z.infer<typeof publishSchema>;

export const forkSchema = z.object({
	componentId: z.string(),
});
export type ForkProps = z.infer<typeof forkSchema>;
