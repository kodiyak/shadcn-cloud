import { headers } from 'next/headers';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/clients/auth';
import { db } from '@/lib/clients/db';
import { likeSchema } from '@/lib/domain';
import { ok } from '@/lib/utils';

export async function GET(req: NextRequest) {
	const localLikes = (req.nextUrl.searchParams.get('localLikes') || '')
		.split(',')
		.filter(Boolean)
		.map((id) => id.trim());
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const likes = await db.like.findMany({
		where: session
			? { userId: session.user.id }
			: { componentId: { in: localLikes } },
		include: { component: true },
	});

	return ok(
		likes.map((like) =>
			likeSchema.parse({
				componentId: like.componentId,
				timestamp: like.createdAt.getTime(),
				component: like.component,
			}),
		),
	);
}
