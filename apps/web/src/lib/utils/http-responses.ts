'use server';

import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { auth } from '../clients/auth';
import { db } from '../clients/db';

interface Meta {
	meta?: any;
}

export async function ok<T>(data: T, options?: ResponseInit & Meta) {
	const { meta = {}, ...rest } = { ...options };
	return NextResponse.json(
		{
			status: 'ok' as const,
			data,
			...meta,
		},
		rest,
	);
}

export async function unauthorized(message: string = 'Unauthorized') {
	return NextResponse.json(
		{
			status: 'error' as const,
			message,
		},
		{ status: 401 },
	);
}

export async function badRequest(message: string, errors?: any[]) {
	return NextResponse.json(
		{
			status: 'error' as const,
			message,
			errors,
		},
		{ status: 400 },
	);
}

export async function notFound(message: string = 'Not Found') {
	return NextResponse.json(
		{
			status: 'error' as const,
			message,
		},
		{ status: 404 },
	);
}

export async function serverError(message: string = 'Internal Server Error') {
	return NextResponse.json(
		{
			status: 'error' as const,
			message,
		},
		{ status: 500 },
	);
}

export async function role() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session || !session.user) return null;

	const { id: userId } = session.user;
	const { role } = await db.user.findUniqueOrThrow({
		where: { id: userId },
		select: { role: true },
	});

	return role;
}
