import { z } from 'zod';
import { metadataSchema } from './metadata';

export const componentSchema = z.object({
	id: z.string(),
	metadata: metadataSchema,
	files: z.record(z.string()),
});
export type Component = z.infer<typeof componentSchema>;
