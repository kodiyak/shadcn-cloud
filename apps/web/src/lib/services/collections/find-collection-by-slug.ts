import { db } from '@/lib/clients/db';
import { collectionSchema } from '@/lib/domain';

export async function findCollectionBySlug(slug: string) {
	const collection = await db.collection.findUnique({
		where: { slug },
	});

	if (!collection) return null;
	return collectionSchema.parse(collection);
}
