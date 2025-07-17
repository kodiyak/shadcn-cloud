'use client';

import { HeartIcon } from '@phosphor-icons/react';
import { useQuery } from '@tanstack/react-query';
import ComponentCard from '@/components/components-entity/component-card';
import PageLayout from '@/components/layouts/page-layout';
import { backendClient } from '@/lib/clients/backend';

export default function Page() {
	const { data: likes } = useQuery({
		queryKey: ['likes'],
		queryFn: async () => backendClient.likes.getAll(),
	});
	return (
		<PageLayout icon={<HeartIcon weight="fill" />} title={'Favorites'}>
			<div className="grid grid-cols-5 gap-4 p-4">
				{(likes?.data ?? []).map((like) => (
					<ComponentCard component={like.component!} key={like.component!.id} />
				))}
			</div>
		</PageLayout>
	);
}
