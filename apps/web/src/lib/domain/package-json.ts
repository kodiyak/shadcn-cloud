import z from 'zod';

export const packageJsonSchema = z.object({
	name: z.string(),
	version: z.string(),
	description: z.string().optional(),
	main: z.string().optional(),
	module: z.string().optional(),
	types: z.string().optional(),
	files: z.array(z.string()).optional(),
	scripts: z.record(z.string()).optional(),
	dependencies: z.record(z.string()).optional(),
	devDependencies: z.record(z.string()).optional(),
	peerDependencies: z.record(z.string()).optional(),
	keywords: z.array(z.string()).optional(),
	exports: z.record(z.record(z.string())).optional(),
});

export type PackageJson = z.infer<typeof packageJsonSchema>;
