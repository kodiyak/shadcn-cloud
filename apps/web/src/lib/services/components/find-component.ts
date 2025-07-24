import { db } from '@/lib/clients/db';
import { type Component, componentSchema } from '@/lib/domain';
import { isUrl } from '@/lib/utils';

export async function findComponent(
	componentId: string,
): Promise<Component | null> {
	if (isUrl(componentId)) {
		return findComponentByFullUrl(componentId);
	}

	if (componentId.split('/').length === 2) {
		const [author, name] = componentId.split('/');
		return findComponentByAuthorAndName(author, name);
	}

	return findComponentById(componentId);
}

async function findComponentByAuthorAndName(author: string, name: string) {
	const component = await db.component.findFirst({
		where: {
			name,
			user: { username: author },
		},
	});

	if (!component) return null;
	return componentSchema.parse(component);
}

async function findComponentByFullUrl(fullUrl: string) {
	const url = new URL(fullUrl);
	const [author, name] = url.pathname.split('/').slice(1); // Assuming the URL is structured like /author/name
	const component = await db.component.findFirst({
		where: {
			name,
			user: { username: author },
		},
	});

	if (!component) return null;
	return componentSchema.parse(component);
}

async function findComponentById(componentId: string) {
	const component = await db.component.findUnique({
		where: { id: componentId },
	});

	if (!component) return null;
	return componentSchema.parse(component);
}
