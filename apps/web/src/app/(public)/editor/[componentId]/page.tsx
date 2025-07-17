'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Crafter from '@/components/crafter';
import { backendClient } from '@/lib/clients/backend';

export default function Page() {
	const { componentId } = useParams();
	const { data: component } = useQuery({
		queryKey: ['component', componentId],
		queryFn: async () => {
			return backendClient.getComponent(componentId as string);
		},
	});

	if (!componentId) {
		return <div className="p-4">Component ID is required.</div>;
	}

	return (
		<div className="flex w-screen bg-gradient-to-br from-muted/20 to-muted h-screen items-stretch">
			<div className="bg-background h-full w-full flex flex-col">
				{component?.data && <Crafter component={component.data} />}
			</div>
		</div>
	);
}
