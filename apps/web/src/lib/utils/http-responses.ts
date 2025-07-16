import { NextResponse } from 'next/server';

export function ok<T>(data: T) {
	return NextResponse.json({
		status: 'ok' as const,
		data,
	});
}

export function unauthorized(message: string = 'Unauthorized') {
	return NextResponse.json(
		{
			status: 'error' as const,
			message,
		},
		{ status: 401 },
	);
}

export function badRequest(message: string, errors?: any[]) {
	return NextResponse.json(
		{
			status: 'error' as const,
			message,
			errors,
		},
		{ status: 400 },
	);
}

export function notFound(message: string = 'Not Found') {
	return NextResponse.json(
		{
			status: 'error' as const,
			message,
		},
		{ status: 404 },
	);
}

export function serverError(message: string = 'Internal Server Error') {
	return NextResponse.json(
		{
			status: 'error' as const,
			message,
		},
		{ status: 500 },
	);
}
