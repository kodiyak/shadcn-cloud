import { Modpack } from '@modpack/core';
import {
	cache,
	external,
	logger,
	resolver,
	swc,
	virtual,
} from '@modpack/plugins';
import { SelectField } from '@workspace/ui/components/fields';
import { FileCodeIcon } from '@workspace/ui/components/icons';
import { useEffect, useMemo, useState } from 'react';
import {
	findNodeInTree,
	flattenNodes,
	searchNodes,
	useProjectStore,
} from '../lib/store/use-project-store';

export default function ComponentsPreview() {
	const [path, setPath] = useState('/previews/hero.tsx');
	const nodes = useProjectStore((state) => state.nodes);
	const previewsNodes = useMemo(() => {
		return searchNodes((n) => {
			return n.path.startsWith('/previews') && n.type === 'file';
		}, nodes);
	}, [nodes]);
	const node = useProjectStore((state) => findNodeInTree(state.nodes, path));

	const [Component, setComponent] = useState<React.ComponentType | null>(null);

	const loadModpack = async () => {
		const modpack = await Modpack.boot({
			debug: true,
			plugins: [
				resolver({
					extensions: ['.js', '.ts', '.tsx', '.jsx'],
					alias: { '@/': '/src/' },
					index: true,
				}),
				cache(),
				virtual(),
				external(),
				swc({
					extensions: ['.js', '.ts', '.tsx', '.jsx'],
					jsc: {
						target: 'es2022',
						parser: {
							syntax: 'typescript',
							tsx: true,
						},
						transform: {
							legacyDecorator: true,
							decoratorMetadata: true,
							react: {
								development: true,
								runtime: 'automatic',
							},
						},
					},
					sourceMaps: true,
					module: {
						type: 'es6',
						strict: false,
						ignoreDynamic: true,
						importInterop: 'swc',
					},
				}),
				logger(),
			],
		});

		if (node) {
			console.log(`Mounting modpack for node: ${node.path}`);
			Object.entries(flattenNodes(nodes)).forEach(
				([_, { path, content, type }]) => {
					const isValid =
						!path.endsWith('.json') &&
						!path.endsWith('.mdx') &&
						type === 'file';
					console.log(
						`Writing "${path}" to modpack\n${isValid ? content : 'Invalid file'}`,
					);
					if (isValid) {
						modpack.fs.writeFile(path, content || '');
					}
				},
			);

			try {
				const component = await modpack.mount(path);
				console.log(`Mounted component: ${path}`, component);

				if (component.default) {
					setComponent(() => component.default);
				}
			} catch (error) {
				console.error(`Failed to mount component at ${path}`, error);
			}
		}
	};

	useEffect(() => {
		loadModpack();
	}, [path]);

	return (
		<div className="size-full flex flex-col">
			<div className="h-12 flex items-center px-4">
				<div className="flex-1"></div>
				<SelectField
					_content={{ align: 'end' }}
					onChange={(v) => setPath(() => v ?? '/')}
					options={previewsNodes.map((node) => ({
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
				<div className="size-full bg-background rounded-2xl border border-border">
					{Component ? (
						<Component />
					) : (
						<div className="flex items-center justify-center h-full">
							<span className="text-muted-foreground">
								Loading component...
							</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
