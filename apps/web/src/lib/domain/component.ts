import { registryItemSchema } from '@uipub/registry';
import { z } from 'zod';
import { sourceMapSchema } from './dependencies';
import { metadataSchema } from './metadata';
import { packageJsonSchema } from './package-json';

export const componentSchema = z.object({
	id: z.string(),
	name: z.string(),
	title: z.string(),
	description: z.string().nullish(),
	userId: z.string().nullish(),
	metadata: metadataSchema,
	files: z.record(z.string()),
	sourceMap: sourceMapSchema.nullish(),
	registry: registryItemSchema.nullish(),
	registryDependencies: z.string().array(),
	dependencies: packageJsonSchema.array().nullish(),
	isForkable: z.boolean(),
	isTemplate: z.boolean(),
	status: z.enum(['draft', 'published', 'archived']),
	user: z
		.object({
			username: z.string(),
			image: z.string().nullish(),
		})
		.nullish(),
});
export type Component = z.infer<typeof componentSchema>;
