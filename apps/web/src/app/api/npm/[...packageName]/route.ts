import type { NextRequest } from 'next/server';
import { getExternalPackage } from '@/lib/services';
import { notFound, ok } from '@/lib/utils';

export async function GET(
	_: NextRequest,
	{ params }: { params: Promise<{ packageName: string[] }> },
) {
	const { packageName } = await params;
	const packageJson = await getExternalPackage(packageName.join('/'));
	if (!packageJson) return notFound('Package not found');

	return ok(packageJson);
}
