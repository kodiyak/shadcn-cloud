'use client';

import { compile, run } from '@mdx-js/mdx';
import { ErrorBoundary } from '@workspace/ui/components/error-boundary';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { cn } from '@workspace/ui/lib/utils';
import kebabCase from 'lodash.kebabcase';
import { Fragment, type ReactNode, useEffect, useMemo, useState } from 'react';
import * as runtime from 'react/jsx-runtime';
import * as MDXComponents from '@/components/docs/mdx-components';

/** @todo Improve components injection logic */
const components: Record<string, (props: any) => ReactNode> = {
	h1: ({ className, ...rest }) => (
		<h1
			className={cn(
				'text-2xl font-mono font-bold leading-none mt-4 mb-1',
				className,
			)}
			id={kebabCase(rest.children as string)}
			{...rest}
		/>
	),
	h2: ({ className, ...rest }) => (
		<h2
			className={cn(
				'text-xl font-mono font-semibold leading-none mt-4 mb-1',
				className,
			)}
			id={kebabCase(rest.children as string)}
			{...rest}
		/>
	),
	h3: ({ className, ...rest }) => (
		<h3
			className={cn(
				'text-lg font-mono font-semibold leading-none mt-4 mb-1',
				className,
			)}
			id={kebabCase(rest.children as string)}
			{...rest}
		/>
	),
	pre: (props) => <pre {...props} />,
	...MDXComponents,
};

interface MdxContentProps {
	content: string;
	className?: string;
}

export default function MdxContent({ content, className }: MdxContentProps) {
	const [mdxModule, setMdxModule] = useState<any>(null);
	const Content = mdxModule ? mdxModule.default : 'div';

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

	useEffect(() => {
		loadMdx(content);
	}, [content]);

	return (
		<ErrorBoundary
			fallback={(err) => <div>Error loading documentation {err?.stack}</div>}
		>
			<Content className={className} components={components} />
		</ErrorBoundary>
	);
}
