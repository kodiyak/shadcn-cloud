import { compile, run } from '@mdx-js/mdx';
import { SelectField } from '@workspace/ui/components/fields';
import { FileCodeIcon } from '@workspace/ui/components/icons';
import {
	Fragment,
	type HTMLProps,
	type ReactNode,
	useEffect,
	useMemo,
	useState,
} from 'react';
import * as runtime from 'react/jsx-runtime';
import { useProjectStore } from '../lib/store/use-project-store';

const components: Record<string, (props: HTMLProps<HTMLElement>) => ReactNode> =
	{
		h1: ({ children }) => (
			<h1 className="text-2xl font-bold mb-4">{children}</h1>
		),
		code: ({ children, className }) => {
			return (
				<pre className="px-4 text-xs py-1 bg-muted rounded-lg">{children}</pre>
			);
		},
	};

export default function DocsPreview() {
	const [path, setPath] = useState('/index.mdx');
	const searchNodes = useProjectStore((state) => state.searchNodes);
	const findNode = useProjectStore((state) => state.findNode);
	const node = findNode(path);
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
