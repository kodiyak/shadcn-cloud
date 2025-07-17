import { Badge } from '@workspace/ui/components/badge';
import { Card } from '@workspace/ui/components/card';
import { FileCodeIcon } from '@workspace/ui/components/icons';
import Link from 'next/link';
import type { Component } from '@/lib/domain';
import ComponentActions from './component-actions';

interface ComponentCardProps {
	component: Component;
}

export default function ComponentCard({ component }: ComponentCardProps) {
	return (
		<Card className="p-2 rounded-2xl gap-2">
			<div className="w-full aspect-video rounded-2xl bg-background relative border border-border">
				<div className="absolute size-full inset-0 flex flex-col">
					<div className="flex justify-between items-center py-1 px-3.5">
						<Badge
							variant={component.status === 'published' ? 'success' : 'muted'}
						>
							{component.status}
						</Badge>
						<div className="flex items-center gap-1">
							<ComponentActions component={component} />
						</div>
					</div>
					<div className="flex mt-auto justify-end p-2 gap-1">
						{['index.tsx', 'basic-preview.tsx'].map((file) => (
							<Badge key={file} variant={'muted'}>
								<FileCodeIcon type={file.split('.').pop() || ''} />
								<span>{file}</span>
							</Badge>
						))}
					</div>
				</div>
			</div>
			<div className="flex flex-col gap-1">
				<Link
					className="text-lg font-medium hover:underline"
					href={`/cn/${component.id}`}
				>
					{component.name}
				</Link>
				<Link
					className="text-sm text-muted-foreground hover:underline"
					href={`/cn/${component.id}`}
				>
					{component.description || 'No description available'}
				</Link>
			</div>
		</Card>
	);
}
