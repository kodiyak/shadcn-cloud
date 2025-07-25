'use client';

import MdxContent from '@/components/crafter/preview/mdx-content';
import type { Component } from '@/lib/domain';
import TableOfContents from './_table-of-contents';

interface DocContentProps {
	component: Component;
}

export default function DocContent({ component }: DocContentProps) {
	return (
		<div className="flex flex-col">
			<div className="flex gap-12 max-w-4xl items-stretch mx-auto w-full py-12">
				<div className="flex-1 flex flex-col gap-2 overflow-hidden">
					<MdxContent
						content={component.files['/index.mdx'] || ''}
						files={component.files}
					/>
				</div>
				<div className="w-1/5 flex flex-col shrink-0">
					<div className="sticky top-4">
						<TableOfContents content={component.files['/index.mdx'] || ''} />
					</div>
				</div>
			</div>
		</div>
	);
}
