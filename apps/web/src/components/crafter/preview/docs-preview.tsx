'use client';

import { compile, run } from '@mdx-js/mdx';
import { ErrorBoundary } from '@workspace/ui/components/error-boundary';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { cn } from '@workspace/ui/lib/utils';
import { Fragment, type ReactNode, useEffect, useMemo, useState } from 'react';
import * as runtime from 'react/jsx-runtime';
import DocHeader from '@/components/docs/doc-header';
import * as MDXComponents from '@/components/docs/mdx-components';
import {
	findNodeInTree,
	searchNodes,
	useProjectStore,
} from '../lib/store/use-project-store';

/** @todo Improve components injection logic */
const components: Record<string, (props: any) => ReactNode> = {
	h1: ({ className, ...rest }) => (
		<h1
			className={cn(
				'text-2xl font-mono font-bold leading-none mt-4 mb-1',
				className,
			)}
			{...rest}
		/>
	),
	h2: ({ className, ...rest }) => (
		<h2
			className={cn(
				'text-xl font-mono font-semibold leading-none mt-4 mb-1',
				className,
			)}
			{...rest}
		/>
	),
	h3: ({ className, ...rest }) => (
		<h3
			className={cn(
				'text-lg font-mono font-semibold leading-none mt-4 mb-1',
				className,
			)}
			{...rest}
		/>
	),
	pre: (props) => <pre {...props} />,
	...MDXComponents,
};

export default function DocsPreview() {
	const [path, setPath] = useState('/index.mdx');
	const nodes = useProjectStore((state) => state.nodes);
	const docsNodes = useMemo(() => {
		return searchNodes((n) => {
			return n.path.endsWith('.mdx') && n.type === 'file';
		}, nodes);
	}, [nodes]);
	const node = docsNodes.find((n) => n.path === path) || null;
	const [content, setContent] = useState('');

	const [mdxModule, setMdxModule] = useState<any>(null);
	const Content = mdxModule ? mdxModule.default : Fragment;

	const loadMdx = async (code: string) => {
		const compiled = await compile(code, {
			format: 'mdx',
			outputFormat: 'function-body',
		});
		const mdx = await run(compiled, {
			...runtime,
			baseUrl: import.meta.url,
		});
		setMdxModule(mdx);
	};

	const metadata = useMemo(() => {
		try {
			return JSON.parse(
				findNodeInTree(nodes, '/metadata.json')?.content || '{}',
			);
		} catch (err) {
			console.error('Error parsing metadata:', err);
			return {};
		}
	}, [nodes]);

	useEffect(() => {
		loadMdx(content);
	}, [content]);

	useEffect(() => {
		setContent(node?.content || '');
	}, [node?.content]);

	return (
		<div className="size-full flex flex-col">
			<div className="size-full relative overflow-hidden">
				<div className="size-full rounded-2xl bg-background absolute inset-0 overflow-hidden">
					<ScrollArea className="size-full absolute inset-0">
						<div className="pt-12 bg-gradient-to-b from-muted/15 to-background rounded-t-xl">
							<DocHeader {...metadata} />
						</div>
						<div className="max-w-4xl mx-auto min-h-screen flex flex-col gap-2">
							<ErrorBoundary
								fallback={(err) => (
									<div>Error loading documentation {err?.stack}</div>
								)}
								key={`error.${content}`}
							>
								<Content components={components} key={`content.${content}`} />
							</ErrorBoundary>
						</div>
					</ScrollArea>
				</div>
			</div>
		</div>
	);
}
