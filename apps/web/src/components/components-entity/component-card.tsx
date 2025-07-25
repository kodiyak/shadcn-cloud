'use client';

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '@workspace/ui/components/avatar';
import { Card } from '@workspace/ui/components/card';
import { memo } from 'react';
import type { Component } from '@/lib/domain';
import ComponentActions from './component-actions';
import ComponentPreviewsCarousel from './component-previews-carousel';

interface ComponentCardProps {
	component: Component;
}

function ComponentCard({ component }: ComponentCardProps) {
	return (
		<Card className="p-1 rounded-2xl gap-2 flex flex-col bg-transparent dark:bg-transparent border-0">
			<div className="w-full overflow-hidden aspect-video rounded-2xl bg-background relative border border-border">
				<div className="absolute z-30 size-full inset-0 flex flex-col">
					<div className="absolute top-0 w-full z-20 flex justify-between items-center py-1 px-3.5">
						<div className="flex items-center gap-1 ml-auto">
							<ComponentActions component={component} />
						</div>
					</div>
					<ComponentPreviewsCarousel
						className={
							'size-full absolute inset-0 z-10 bg-gradient-to-b from-background to-muted/50'
						}
						component={component}
					/>
				</div>
			</div>

			<div className="flex items-center gap-2">
				{component.user && (
					<Avatar>
						<AvatarFallback />
						<AvatarImage src={component.user?.image ?? undefined} />
					</Avatar>
				)}
				<div className="flex flex-1 flex-col gap-1">
					<span className="text-sm font-medium cursor-default">
						{component.metadata.title}
					</span>
				</div>
			</div>
		</Card>
	);
}

export default memo(ComponentCard, () => true);
