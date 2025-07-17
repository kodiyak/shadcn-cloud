import z from 'zod';
import { componentSchema } from './component';

export const likeSchema = z.object({
	componentId: z.string(),
	timestamp: z.number(),
	component: componentSchema.optional(),
});

export type Like = z.infer<typeof likeSchema>;
