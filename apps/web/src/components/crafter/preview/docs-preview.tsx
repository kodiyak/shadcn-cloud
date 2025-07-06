import { compile, run } from '@mdx-js/mdx';
import { ErrorBoundary } from '@workspace/ui/components/error-boundary';
import { SelectField } from '@workspace/ui/components/fields';
import { FileCodeIcon } from '@workspace/ui/components/icons';
import { cn } from '@workspace/ui/lib/utils';
import {
	Fragment,
	type HTMLAttributes,
	type ReactNode,
	useEffect,
	useMemo,
	useState,
} from 'react';
import * as runtime from 'react/jsx-runtime';
import DocHeader from '@/components/docs/doc-header';
import {
	findNodeInTree,
	flattenNodes,
	searchNodes,
	useProjectStore,
} from '../lib/store/use-project-store';

/** @todo Improve components injection logic */
const components: Record<
	string,
	(props: HTMLAttributes<HTMLElement>) => ReactNode
> = {
	h1: ({ className, ...rest }) => (
		<h1 className={cn('text-2xl font-bold mb-4', className)} {...rest} />
	),
	h2: ({ className, ...rest }) => (
		<h2 className={cn('text-xl font-semibold mb-3', className)} {...rest} />
	),
	h3: ({ className, ...rest }) => (
		<h3 className={cn('text-lg font-semibold mb-2', className)} {...rest} />
	),
	code: ({ className, ...rest }) => (
		<pre
			className={cn('px-4 text-xs py-1 bg-muted rounded-lg', className)}
			{...rest}
		/>
	),
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
		const compiled = await compile(code, { outputFormat: 'function-body' });
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
			<div className="h-12 flex items-center px-4">
				<SelectField
					_content={{ align: 'end' }}
					onChange={(v) => setPath(() => v ?? '/')}
					options={docsNodes.map((node) => ({
						value: node.path,
						label: node.path.split('/').pop() || 'Untitled',
						icon: (
							<FileCodeIcon
								className="size-4"
								type={node.path.split('.').pop()}
							/>
						),
					}))}
					size={'xs'}
					value={path}
				/>
			</div>
			<div className="flex-1 p-4 pt-0">
				<div className="size-full relative">
					<div className="size-full rounded-2xl bg-background absolute inset-0 border border-border overflow-y-scroll">
						<div className="p-4 bg-gradient-to-b from-muted to-background rounded-t-xl">
							<DocHeader {...metadata} />
						</div>
						{content.length}
						<ErrorBoundary
							fallback={<div>Error loading documentation</div>}
							key={`error.${content}`}
						>
							<Content components={components} key={`content.${content}`} />
						</ErrorBoundary>
					</div>
				</div>
			</div>
		</div>
	);
}
