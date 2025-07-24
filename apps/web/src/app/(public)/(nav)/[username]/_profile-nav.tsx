'use client';

import { HeartIcon } from '@phosphor-icons/react';
import { Button } from '@workspace/ui/components/button';
import Link from 'next/link';
import {
	useSelectedLayoutSegment,
	useSelectedLayoutSegments,
} from 'next/navigation';
import type { Profile } from '@/lib/domain';

interface ProfileNavProps {
	profile: Profile;
}

export default function ProfileNav({ profile }: ProfileNavProps) {
	const segment = useSelectedLayoutSegment();
	return (
		<>
			{[
				{
					label: 'Library',
					href: `/${profile.username}/library`,
					isActive: segment === 'library',
				},
				{
					label: (
						<>
							<HeartIcon weight={'fill'} />
							<span>Likes</span>
						</>
					),
					href: `/${profile.username}/likes`,
					isActive: segment === 'likes',
				},
			].map((link, l) => (
				<Button
					asChild
					className="relative"
					data-state={link.isActive ? 'open' : undefined}
					key={`${link.href}-${l}`}
					size={'xs'}
					variant={'ghost'}
				>
					<Link href={link.href}>{link.label}</Link>
				</Button>
			))}
		</>
	);
}
