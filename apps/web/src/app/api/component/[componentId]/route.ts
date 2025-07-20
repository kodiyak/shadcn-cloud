import { headers } from 'next/headers';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/clients/auth';
import { findComponent } from '@/lib/services';
import { badRequest, ok, unauthorized } from '@/lib/utils';

export async function GET(
	_: NextRequest,
	{ params }: { params: Promise<{ componentId: string }> },
) {
	const { componentId } = await params;
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return unauthorized('You must be logged in to view this component');
	}

	const component = await findComponent(componentId);
	if (!component.isForkable) {
		return badRequest('This component cannot be forked');
	}

	return ok(component);
}
