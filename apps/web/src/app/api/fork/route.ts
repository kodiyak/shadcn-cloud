import { headers } from 'next/headers';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/clients/auth';
import { forkSchema } from '@/lib/domain';
import { findComponent, forkComponent } from '@/lib/services';
import { badRequest, ok, unauthorized } from '@/lib/utils';

export async function POST(req: NextRequest) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return unauthorized('You must be logged in to fork a component');
	}

	const { success, data, error } = forkSchema.safeParse(await req.json());
	if (!success) {
		return badRequest('Invalid request body', error.errors);
	}

	const { componentId } = data;
	const component = await findComponent(componentId);
	if (!component.isForkable) {
		return badRequest('This component cannot be forked');
	}

	const result = await forkComponent({
		component,
		authId: session.user.id,
	});

	return ok(result);
}
