import type { NextRequest } from 'next/server';
import { db } from '@/lib/clients/db';
import { componentSchema } from '@/lib/domain';
import { getProfile } from '@/lib/services';
import { badRequest, ok } from '@/lib/utils';

interface Props {
	params: Promise<{ username: string }>;
}

export async function GET(_: NextRequest, { params }: Props) {
	const { username } = await params;
	const profile = await getProfile(username);
	if (!profile) return badRequest('Profile not found');

	const components = await db.component.findMany({
		where: { user: { username } },
		include: { user: { select: { username: true, image: true } } },
	});
	return ok(componentSchema.array().parse(components));
}
