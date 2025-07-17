import { headers } from 'next/headers';
import { auth } from '@/lib/clients/auth';
import { db } from '@/lib/clients/db';
import { componentSchema } from '@/lib/domain';
import { ok, unauthorized } from '@/lib/utils';

export async function GET() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return unauthorized();
	}

	const components = await db.component.findMany({
		where: { userId: session.user.id },
	});

	return ok(components.map((component) => componentSchema.parse(component)));
}
