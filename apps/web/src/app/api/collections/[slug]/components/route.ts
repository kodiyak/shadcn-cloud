import type { Prisma } from '@workspace/db';
import type { NextRequest } from 'next/server';
import { db } from '@/lib/clients/db';
import {
	addCollectionComponentSchema,
	componentSchema,
	removeCollectionComponentSchema,
} from '@/lib/domain';
import { findComponent } from '@/lib/services';
import { notFound, ok, role, unauthorized } from '@/lib/utils';

interface RouteProps {
	params: Promise<{ slug: string }>;
}
export async function GET(req: NextRequest, { params }: RouteProps) {
	const { slug } = await params;
	const searchQuery = req.nextUrl.searchParams.get('s') || null;
	const sort = req.nextUrl.searchParams.get('sort') || 'createdAt';
	const collection = await db.collection.findUnique({
		where: { slug },
		select: { id: true },
	});

	if (!collection) return notFound('Collection not found');

	const where: Prisma.ComponentWhereInput = {
		collections: { some: { slug } },
	};
	const orderBy: Prisma.ComponentOrderByWithRelationInput = {};
	if (searchQuery) {
		where.name = { contains: searchQuery, mode: 'insensitive' };
	}
	switch (sort) {
		case 'recommended':
			orderBy.createdAt = 'desc';
			break;
		case 'newest':
			orderBy.createdAt = 'desc';
			break;
		case 'most_liked':
			orderBy.likes = { _count: 'desc' };
			break;
		default:
			orderBy.createdAt = 'desc';
			break;
	}

	const components = await db.component.findMany({ where, orderBy });
	return ok(componentSchema.array().parse(components), {
		meta: { total: await db.component.count({ where }) },
	});
}

export async function POST(req: NextRequest, { params }: RouteProps) {
	if ((await role()) !== 'admin') {
		return unauthorized(
			'You must be an admin to add components into a collection.',
		);
	}
	const { slug } = await params;
	const collection = await db.collection.findUnique({
		where: { slug },
		select: { id: true },
	});

	if (!collection) return notFound('Collection not found');
	const { url } = addCollectionComponentSchema.parse(await req.json());
	const component = await findComponent(url);
	if (!component) return notFound('Component not found');

	await db.collection.update({
		where: { id: collection.id },
		data: { components: { connect: { id: component.id } } },
	});

	return ok({});
}

export async function DELETE(req: NextRequest, { params }: RouteProps) {
	if ((await role()) !== 'admin') {
		return unauthorized(
			'You must be an admin to remove components from a collection.',
		);
	}
	const { slug } = await params;
	const collection = await db.collection.findUnique({
		where: { slug },
		select: { id: true },
	});

	if (!collection) return notFound('Collection not found');
	const { componentId } = removeCollectionComponentSchema.parse(
		await req.json(),
	);

	await db.collection.update({
		where: { id: collection.id },
		data: { components: { disconnect: { id: componentId } } },
	});

	return ok({});
}
