import { db } from '@/lib/clients/db';
import { profileSchema } from '@/lib/domain';

export async function getProfile(username: string) {
	const profile = await db.profile.findUnique({
		where: { username },
	});

	if (!profile) return null;

	return profileSchema.parse(profile);
}
