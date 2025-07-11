import { Button } from '@workspace/ui/components/button';
import kebabCase from 'lodash.kebabcase';
import { useMemo } from 'react';

interface TableOfContentsProps {
	content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
	const toc = useMemo(() => {
		const headings = content.match(/^(#{1,6})\s+(.*)$/gm);
		if (!headings) return [];

		return headings.map((heading) => {
			const level = heading.match(/^(#{1,6})/)?.[0].length || 0;
			const text = heading.replace(/^(#{1,6})\s+/, '');
			return { level, text };
		});
	}, [content]);

	return (
		<div className="sticky top-12 flex flex-col gap-2">
			<span className="text-sm font-medium text-muted-foreground font-mono border-y border-border border-dashed py-2">
				Table of Contents
			</span>
			<ul className="list-none pl-0 mt-2">
				{toc.map((item, i) => (
					<li className={'flex items-center'} key={`${item.level}.${i}`}>
						{[...Array(item.level - 1)].map((_, i) => (
							<div className="w-2 h-2" key={`level.${item.level}.${i}`} />
						))}
						<Button
							asChild
							className="h-auto py-1 text-sm flex-1 text-left justify-start pl-0"
							size={'xs'}
							variant={'link'}
						>
							<a href={`#${kebabCase(item.text)}`}>{item.text}</a>
						</Button>
					</li>
				))}
			</ul>
		</div>
	);
}
