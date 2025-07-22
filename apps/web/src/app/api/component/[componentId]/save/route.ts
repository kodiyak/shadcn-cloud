import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/clients/db';

const saveSchema = z.object({
	files: z
		.object({
			'/index.mdx': z.string(),
			'/metadata.json': z.string(),
		})
		.passthrough(),
});

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ componentId: string }> },
) {
	const { componentId } = await params;
	const { data: body, success, error } = saveSchema.safeParse(await req.json());
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

	const { files } = body;
	const metadata = JSON.parse(files['/metadata.json']);

	const component = await db.component.update({
		where: { id: componentId },
		data: {
			name: metadata.title,
			description: metadata.description,
			metadata,
			files: JSON.parse(JSON.stringify(files)),
		},
	});

	return NextResponse.json({
		component,
		files,
		metadata,
	});
}
