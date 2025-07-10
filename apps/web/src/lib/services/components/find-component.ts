import { db } from '@/lib/clients/db';
import { type Component, componentSchema } from '@/lib/domain';

export async function findComponent(componentId: string): Promise<Component> {
	const component = await db.component.findUnique({
		where: { id: componentId },
	});

	return componentSchema.parse(component);
}
