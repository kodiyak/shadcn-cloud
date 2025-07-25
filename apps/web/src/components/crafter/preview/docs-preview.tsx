'use client';

import {
	ScrollArea,
	ScrollAreaShadow,
} from '@workspace/ui/components/scroll-area';
import { useEffect, useMemo, useState } from 'react';
import DocHeader from '@/components/docs/doc-header';
import {
	findNodeInTree,
	getNodeFiles,
	searchNodes,
	useProjectStore,
} from '../lib/store/use-project-store';
import MdxContent from './mdx-content';

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
	const nodeFiles = getNodeFiles(nodes);
	const files = Object.keys(nodeFiles).reduce(
		(acc, filePath) => {
			acc[filePath.replace('file://', '')] = nodeFiles[filePath];
			return acc;
		},
		{} as Record<string, string>,
	);

	useEffect(() => {
		setContent(node?.content || '');
	}, [node?.content]);

	return (
		<div className="size-full bg-background absolute inset-0 overflow-hidden">
			<ScrollAreaShadow className="to-background" />
			<ScrollArea className="size-full absolute inset-0 [&_[data-slot=scroll-area-viewport]]:[&>div]:max-w-full [&_[data-slot=scroll-area-viewport]]:[&>div]:overflow-hidden">
				<div className="pt-12">
					<DocHeader {...metadata} />
				</div>
				<div className="max-w-xl w-full mx-auto min-h-screen flex flex-col gap-2">
					<MdxContent content={content} files={files} />
				</div>
			</ScrollArea>
		</div>
	);
}
