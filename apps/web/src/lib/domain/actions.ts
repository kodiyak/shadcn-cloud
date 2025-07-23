import { registryItemSchema } from '@uipub/registry';
import z from 'zod';
import { packageJsonSchema } from './package-json';

export const publishSchema = z.object({
	componentId: z.string(),
	isTemplate: z.boolean(),
	isForkable: z.boolean(),
	registry: registryItemSchema,
	dependencies: packageJsonSchema.array(),
});
export type PublishProps = z.infer<typeof publishSchema>;

export const forkSchema = z.object({
	componentId: z.string(),
});
export type ForkProps = z.infer<typeof forkSchema>;

export const saveLikesBatchSchema = z.object({
	likedItems: z
		.object({
			componentId: z.string(),
			timestamp: z.number(),
		})
		.array(),
});
export type SaveLikesBatchSchema = z.infer<typeof saveLikesBatchSchema>;

export const deleteLikesBatchSchema = z.object({
	likedItems: z.string().array(),
});
export type DeleteLikesBatchSchema = z.infer<typeof deleteLikesBatchSchema>;
