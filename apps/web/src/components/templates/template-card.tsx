'use client';

import { Badge } from '@workspace/ui/components/badge';
import { Card } from '@workspace/ui/components/card';
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@workspace/ui/components/carousel';
import { cn } from '@workspace/ui/lib/utils';
import { useEffect, useState } from 'react';
import type { Component } from '@/lib/domain';
import ComponentActions from '../components-entity/component-actions';
import ModpackRuntime from '../modpack/modpack-runtime';

interface TemplateCardProps {
	template: Component;
}

export default function TemplateCard({ template }: TemplateCardProps) {
	const [api, setApi] = useState<CarouselApi>();
	const files = Object.keys(template.files).reduce(
		(acc, file) => {
			acc[file.replace('file://', '')] = template.files[file];
			return acc;
		},
		{} as Record<string, string>,
	);

	const previews = Object.keys(files)
		.filter((f) => f.startsWith('/previews/'))
		.map((path) => ({
			path,
			content: files[path],
		}));
	const [index, setIndex] = useState(0);

	useEffect(() => {
		if (!api) return;

		setIndex(() => api.selectedScrollSnap());
		api.on('select', () => {
			setIndex(() => api.selectedScrollSnap());
		});
	}, [api]);

	return (
		<Card className="p-2 rounded-2xl gap-2 flex flex-col">
			<div className="w-full overflow-hidden aspect-video rounded-2xl bg-background relative border border-border">
				<div className="absolute z-30 size-full inset-0 flex flex-col">
					<div className="absolute top-0 w-full z-20 flex justify-between items-center py-1 px-3.5">
						<Badge
							variant={template.status === 'published' ? 'success' : 'muted'}
						>
							{template.status}
						</Badge>
						<div className="flex items-center gap-1">
							<ComponentActions component={template} />
						</div>
					</div>
					<Carousel
						className="size-full absolute inset-0 z-10 bg-gradient-to-b from-background to-muted/50"
						setApi={setApi}
					>
						<CarouselContent>
							{previews.map((preview) => (
								<CarouselItem
									className="w-full aspect-video flex items-center justify-center relative"
									key={`preview:${preview.path}`}
								>
									<ModpackRuntime
										componentId={template.id}
										files={files}
										path={preview.path}
									/>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious className="left-4" />
						<CarouselNext className="right-4" />
					</Carousel>
				</div>
			</div>
			<div className="bottom-0 w-full px-4 flex items-center justify-center gap-1">
				{previews.map((preview, i) => (
					<div
						className={cn(
							`w-3 h-1 rounded-lg bg-muted`,
							i === index && 'bg-primary',
						)}
						key={`id:${preview.path}`}
					/>
				))}
			</div>
			<div className="flex flex-col gap-1">
				<span className="text-lg font-medium cursor-default">
					{template.metadata.title}
				</span>
				<span className="text-sm text-muted-foreground line-clamp-2 cursor-default">
					{template.metadata.description}
				</span>
			</div>
		</Card>
	);
}
