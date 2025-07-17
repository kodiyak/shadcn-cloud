import { headers } from 'next/headers';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/clients/auth';
import { db } from '@/lib/clients/db';
import { deleteLikesBatchSchema, saveLikesBatchSchema } from '@/lib/domain';
import { badRequest, ok, unauthorized } from '@/lib/utils';

export async function POST(req: NextRequest) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return unauthorized();
	}

	const { success, data, error } = saveLikesBatchSchema.safeParse(
		await req.json(),
	);

	if (!success) {
		return badRequest('Invalid Request Body', error.errors);
	}

	const { likedItems } = data;

	const existingLikes = await db.like.findMany({
		where: {
			userId: session.user.id,
			componentId: { in: likedItems.map((item) => item.componentId) },
		},
	});
	const newLikes = likedItems.filter(
		(item) =>
			!existingLikes.some((like) => like.componentId === item.componentId),
	);

	await db.like.createMany({
		data: newLikes.map(({ componentId, timestamp }) => ({
			componentId,
			userId: session.user.id,
			createdAt: new Date(timestamp),
		})),
	});

	return ok({ likes: newLikes });
}

export async function DELETE(req: NextRequest) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return unauthorized();
	}

	const { success, data, error } = deleteLikesBatchSchema.safeParse(
		await req.json(),
	);

	if (!success) {
		return badRequest('Invalid Request Body', error.errors);
	}

	const { likedItems } = data;
	await db.like.deleteMany({
		where: {
			userId: session.user.id,
			componentId: { in: likedItems.map((componentId) => componentId) },
		},
	});

	return ok({});
}
