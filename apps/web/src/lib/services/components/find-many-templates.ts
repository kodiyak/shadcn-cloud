import { db } from '@/lib/clients/db';
import { componentSchema } from '@/lib/domain';

export async function findManyTemplates() {
	const templates = await db.component.findMany({
		where: { isTemplate: true, isForkable: true, status: 'published' },
	});

	return templates.map((t) => componentSchema.parse(t));
}
