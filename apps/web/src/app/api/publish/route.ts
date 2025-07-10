import { registryItemSchema } from '@uipub/registry';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/clients/db';

const publishSchema = z.object({
	registry: registryItemSchema,
	sourceMap: z.object({
		imports: z.record(z.any()),
		exports: z.record(z.any()),
	}),
	files: z
		.object({
			'file:///index.mdx': z.string(),
			'file:///metadata.json': z.string(),
		})
		.passthrough(),
});

export async function POST(req: NextRequest) {
	const {
		data: body,
		success,
		error,
	} = publishSchema.safeParse(await req.json());
	if (!success) {
		return NextResponse.json(
			{
				message: 'Invalid request body',
				status: 'error',
				errors: error.errors,
			},
			{ status: 400 },
		);
	}

	const { files, registry, sourceMap } = body;
	const metadata = JSON.parse(files['file:///metadata.json']);

	const component = await db.component.create({
		data: {
			name: metadata.title,
			description: metadata.description,
			metadata,
			files: JSON.parse(JSON.stringify(files)),
			registry,
			sourceMap,
			dependencies: registry.dependencies ?? [],
			registryDependencies: registry.registryDependencies ?? [],
		},
	});

	return NextResponse.json({
		component,
		files,
		metadata,
	});
}
