import { registryItemSchema } from '@uipub/registry';
import { z } from 'zod';
import { sourceMapSchema } from './dependencies';
import { metadataSchema } from './metadata';

export const componentSchema = z.object({
	id: z.string(),
	name: z.string(),
	userId: z.string().nullish(),
	metadata: metadataSchema,
	files: z.record(z.string()),
	sourceMap: sourceMapSchema,
	registry: registryItemSchema,
	registryDependencies: z.string().array(),
	dependencies: z.string().array(),
	isForkable: z.boolean(),
	isTemplate: z.boolean(),
	status: z.enum(['draft', 'published', 'archived']),
});
export type Component = z.infer<typeof componentSchema>;
