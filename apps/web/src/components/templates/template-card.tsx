'use client';

import { Badge } from '@workspace/ui/components/badge';
import { Card } from '@workspace/ui/components/card';
import { FileCodeIcon } from '@workspace/ui/components/icons';
import { cn } from '@workspace/ui/lib/utils';
import Link from 'next/link';
import type { Component } from '@/lib/domain';

interface TemplateCardProps {
	template: Component;
}

export default function TemplateCard({ template }: TemplateCardProps) {
	const files = Object.keys(template.files).map(
		(f) => f.split('/').pop() || '',
	);

	return (
		<Link href={`/cn/${template.id}`} target={'_blank'}>
			<Card
				className={cn(
					'p-2 rounded-2xl gap-2 cursor-pointer select-none transition-[shadow,border-color]',
					'hover:border-ring',
				)}
			>
				<div className="w-full aspect-video rounded-2xl bg-background relative border border-border">
					<div className="absolute size-full inset-0 flex flex-col">
						<div className="flex mt-auto justify-end p-2 gap-1 overflow-hidden relative">
							<div className="absolute left-0 top-0 h-full w-full z-20 bg-gradient-to-l from-transparent to-background rounded-bl-2xl flex items-center px-6">
								<span className="text-xs text-muted-foreground">
									{files.length} files
								</span>
							</div>
							{files.map((file, f) => (
								<Badge key={`${file + f}`} variant={'muted'}>
									<FileCodeIcon type={file.split('.').pop() || ''} />
									<span>{file}</span>
								</Badge>
							))}
						</div>
					</div>
				</div>
				<div className="flex flex-col gap-1">
					<span className="text-lg font-medium">{template.metadata.title}</span>
					<span className="text-sm text-muted-foreground line-clamp-2">
						{template.metadata.description}
					</span>
				</div>
			</Card>
		</Link>
	);
}
