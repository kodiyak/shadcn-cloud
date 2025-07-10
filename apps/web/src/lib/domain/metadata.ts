import { z } from 'zod';

export const metadataSchema = z.object({
	title: z.string(),
	description: z.string().optional(),
	features: z.array(z.string()).optional(),
	references: z
		.array(
			z.object({
				title: z.string(),
				href: z.string().url(),
			}),
		)
		.optional(),
	tools: z
		.array(
			z.object({
				title: z.string(),
				icon: z.string(),
				href: z.string().url(),
			}),
		)
		.optional(),
});
export type Metadata = z.infer<typeof metadataSchema>;
