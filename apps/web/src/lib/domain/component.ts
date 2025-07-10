import { registryItemSchema } from '@uipub/registry';
import { z } from 'zod';
import { sourceMapSchema } from './dependencies';
import { metadataSchema } from './metadata';

export const componentSchema = z.object({
	id: z.string(),
	metadata: metadataSchema,
	files: z.record(z.string()),
	sourceMap: sourceMapSchema,
	registry: registryItemSchema,
	registryDependencies: z.string().array(),
	dependencies: z.string().array(),
});
export type Component = z.infer<typeof componentSchema>;
