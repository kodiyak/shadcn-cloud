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
import ModpackRuntime from '../modpack/modpack-runtime';

interface ComponentPreviewsCarouselProps {
	component: Component;
	className?: string;
}

export default function ComponentPreviewsCarousel({
	component,
	className,
}: ComponentPreviewsCarouselProps) {
	const [api, setApi] = useState<CarouselApi>();
	const previews = Object.keys(component.files)
		.filter((f) => f.startsWith('/previews/'))
		.map((path) => ({
			path,
			content: component.files[path],
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
		<Carousel className={cn('relative', className)} setApi={setApi}>
			<CarouselContent>
				{previews.map((preview) => (
					<CarouselItem
						className="w-full aspect-video flex items-center justify-center relative"
						key={`preview:${preview.path}`}
					>
						<ModpackRuntime
							componentId={component.id}
							files={component.files}
							path={preview.path}
						/>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious className="left-4" />
			<CarouselNext className="right-4" />
			<div className="bottom-0 w-full px-4 py-2 absolute left-0 flex items-center justify-center gap-1 z-20">
				{previews.map((preview, i) => (
					<button
						className={cn(
							`w-3 h-1 rounded-lg`,
							i === index
								? 'bg-foreground/20 cursor-default'
								: 'bg-muted cursor-pointer',
						)}
						disabled={i === index}
						key={`id:${preview.path}`}
						onClick={() => {
							api?.scrollTo(i);
						}}
						type={'button'}
					/>
				))}
			</div>
		</Carousel>
	);
}
