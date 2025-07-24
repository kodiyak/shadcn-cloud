import type { NextRequest } from 'next/server';
import { getProfile } from '@/lib/services';
import { ok } from '@/lib/utils';

interface Props {
	params: Promise<{ username: string }>;
}

export async function GET(_: NextRequest, { params }: Props) {
	const { username } = await params;
	const profile = await getProfile(username);
	return ok(profile);
}
