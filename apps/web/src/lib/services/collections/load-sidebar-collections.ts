import { db } from '@/lib/clients/db';
import { collectionSchema } from '@/lib/domain';

export async function loadSidebarCollections() {
	const collections = await db.collection.findMany({});
	return collectionSchema.array().parse(collections);
}
