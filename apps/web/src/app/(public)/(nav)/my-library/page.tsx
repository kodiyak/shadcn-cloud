'use client';

import { useQuery } from '@tanstack/react-query';
import { LibraryIcon } from 'lucide-react';
import ComponentCard from '@/components/components-entity/component-card';
import PageLayout from '@/components/layouts/page-layout';
import { backendClient } from '@/lib/clients/backend';

export default function Page() {
	const { data: components } = useQuery({
		queryKey: ['library'],
		queryFn: async () => backendClient.getLibraryComponents(),
		refetchOnWindowFocus: false,
	});
	return (
		<PageLayout icon={<LibraryIcon />} title={'My Library'}>
			<div className="grid grid-cols-5 gap-4 p-4">
				{(components?.data ?? []).map((component) => (
					<ComponentCard component={component} key={component.id} />
				))}
			</div>
		</PageLayout>
	);
}
