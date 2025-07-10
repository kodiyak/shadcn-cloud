import { db } from '@/lib/clients/db';

export async function findComponent(componentId: string) {
	const component = await db.component.findUnique({
		where: { id: componentId },
	});

	return component as any;
}
