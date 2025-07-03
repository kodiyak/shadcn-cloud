import { compile, run } from '@mdx-js/mdx';
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
import {
	findNodeInTree,
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
	const searchNodes = useProjectStore((state) => state.searchNodes);
	const node = useProjectStore((state) => findNodeInTree(state.nodes, path));
	const docsPaths = useMemo(() => {
		return searchNodes((n) => n.type === 'file' && n.path.endsWith('.mdx'));
	}, [searchNodes]);

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

	useEffect(() => {
		if (node?.content) {
			loadMdx(node.content);
		}
	}, [node?.content]);

	return (
		<div className="size-full flex flex-col">
			<div className="h-12 flex items-center px-4">
				<div className="flex-1"></div>
				<SelectField
					_content={{ align: 'end' }}
					onChange={(v) => setPath(() => v ?? '/')}
					options={docsPaths.map((node) => ({
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
				<div className="size-full rounded-2xl bg-background border border-border overflow-y-auto">
					<Content components={components} />
				</div>
			</div>
		</div>
	);
}
