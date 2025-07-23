import z from 'zod';

export const packageJsonSchema = z.object({
	name: z.string(),
	private: z.boolean().optional(),
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
	author: z
		.union([
			z.string(),
			z.object({
				name: z.string(),
				email: z.string().email().optional(),
				url: z.string().url().optional(),
			}),
		])
		.optional(),
	repository: z
		.union([
			z.string(),
			z.object({
				type: z.string(),
				url: z.string(),
				directory: z.string().optional(),
			}),
		])
		.optional(),
	bugs: z
		.union([
			z.string(),
			z.object({
				url: z.string().url('A URL de bugs deve ser válida.').optional(),
				email: z.string().email('O email de bugs deve ser válido.').optional(),
			}),
		])
		.optional(),
	exports: z.record(z.record(z.string().or(z.record(z.string())))).optional(),
});

export type PackageJson = z.infer<typeof packageJsonSchema>;
