import { NextResponse } from 'next/server';
import { db } from '@/lib/clients/db';

export async function GET(request: Request) {
	const templates = await db.component.findMany({
		where: { isTemplate: true },
	});
	return NextResponse.json({
		data: templates,
	});
}
