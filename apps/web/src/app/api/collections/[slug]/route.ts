import type { NextRequest } from 'next/server';
import { db } from '@/lib/clients/db';
import { notFound, ok } from '@/lib/utils';

interface RouteProps {
	params: Promise<{ slug: string }>;
}
export async function GET(req: NextRequest, { params }: RouteProps) {
	const { slug } = await params;
	const collection = await db.collection.findUnique({
		where: { slug },
		select: { id: true },
	});

	if (!collection) return notFound('Collection not found');

	return ok(collection);
}
