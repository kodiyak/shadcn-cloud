import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/clients/db';
import { componentSchema, publishSchema } from '@/lib/domain';
import { ok } from '@/lib/utils';

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

	const { registry, isForkable, isTemplate, componentId, dependencies } = body;
	const component = await db.component.update({
		where: { id: componentId },
		data: {
			registry,
			isTemplate,
			isForkable,
			dependencies,
			status: 'published',
		},
	});

	return ok(componentSchema.parse(component));
}
