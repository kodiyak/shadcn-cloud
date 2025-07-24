'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import ComponentCard from '@/components/components-entity/component-card';
import { backendClient } from '@/lib/clients/backend';

export default function Page() {
	const { username } = useParams();
	const { data: components } = useQuery({
		queryKey: ['profile', username, 'likes'],
		queryFn: async () => backendClient.profile.getLikes(username as string),
		refetchOnWindowFocus: false,
	});

	return (
		<div className="flex flex-col">
			<div className="grid grid-cols-3 gap-4">
				{(components?.data ?? []).map((component) => (
					<ComponentCard component={component} key={component.id} />
				))}
			</div>
		</div>
	);
}
