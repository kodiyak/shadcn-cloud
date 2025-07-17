import { headers } from 'next/headers';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/clients/auth';
import { forkSchema } from '@/lib/domain';
import { findComponent, forkComponent } from '@/lib/services';
import { badRequest, ok, unauthorized } from '@/lib/utils';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ componentId: string }> },
) {
	const { componentId } = await params;
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return unauthorized('You must be logged in to fork a component');
	}

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
