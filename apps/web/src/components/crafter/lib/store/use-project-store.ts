import type { TemplateProps } from '@workspace/core';
import { create } from 'zustand';
import { buildRegistry } from '@/lib/services';
import { exportsMapToRecord, importsMapToRecord } from '@/lib/utils';
import type { NodeProps } from '../../types';
import { useCompilationStore } from './use-compilation-store';
import { useEditorStore } from './use-editor-store';

interface CreateNodeProps extends Omit<NodeProps, 'path'> {
	name: string;
}

interface ProjectStore {
	isReady: boolean;
	selectTemplate: (template: TemplateProps) => Promise<void>;
	nodes: NodeProps[];
	setNodes: (nodes: NodeProps[]) => void;
	addNode: (parent: string, node: CreateNodeProps) => void;
	deleteNode: (path: string) => void;
	renameNode: (oldPath: string, filename: string) => void;
	updateDraft: (path: string, draftContent: string) => void;
	findNode: (path: string) => NodeProps | undefined;
	searchNodes: (callback: (node: NodeProps) => boolean) => NodeProps[];
	save: (path: string, content: string) => Promise<void>;
	publish: () => Promise<void>;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
	isReady: false,
	nodes: [],
	searchNodes: (callback) => {
		const { nodes } = get();
		return searchNodes(callback, nodes);
	},
	selectTemplate: async (template) => {
		const { files: templateFiles } = template;
		const nodes: NodeProps[] = [
			{
				type: 'directory',
				path: '/',
				content: '',
				draftContent: '',
				items: [],
			},
		];

		for (const [path, content] of Object.entries(templateFiles)) {
			const parts = splitPath(path);

			// Create directory structure
			for (let i = 0; i < parts.length; i++) {
				const currentPath = formatPath(parts.slice(0, i + 1).join('/'));
				const isDir = i < parts.length - 1;
				const parentNode = findNodeInTree(
					nodes,
					formatPath(parts.slice(0, i).join('/')),
				);

				if (!parentNode) {
					nodes.push({
						type: isDir ? 'directory' : 'file',
						path: currentPath,
						content: content || '',
						draftContent: content || '',
						items: [],
					});
				}
				if (parentNode && parentNode.type === 'directory') {
					parentNode.items = parentNode.items || [];
					if (!parentNode.items.some((item) => item.path === currentPath)) {
						parentNode.items.push({
							type: isDir ? 'directory' : 'file',
							path: currentPath,
							content: content || '',
							draftContent: content || '',
							items: [],
						});
					}
				}
			}
		}

		useEditorStore.getState().setActivePath('/index.mdx');

		set({
			isReady: true,
			nodes,
		});
	},
	findNode: (path) => {
		const { nodes } = get();
		return findNodeInTree(nodes, path);
	},
	setNodes: (nodes) => set({ nodes }),
	addNode: (parent, node) => {
		const { nodes } = get();
		const parentNode = findNodeInTree(nodes, parent);
		const path = formatPath(`${parent}/${node.name}`);
		if (!parentNode) {
			console.warn(`Parent node not found for path: ${parent}`);
			console.warn(`Available nodes:`, nodes);
			return;
		}

		if (parentNode.type !== 'directory') {
			console.error(`Parent node is not a directory: ${parent}`);
			return;
		}

		// Ensure parentNode.items is initialized
		if (!parentNode.items) parentNode.items = [];

		// Check if the node already exists
		if (parentNode.items.some((item) => item.path === path)) {
			console.warn(`Node already exists at path: ${path}`);
			return;
		}

		const newNode: NodeProps = {
			...node,
			path,
			content: node.content || '',
			draftContent: node.draftContent || '',
			isDirty: true,
		};

		parentNode.items.push(newNode);

		set({
			nodes: updateNodeInTree(parent, { items: parentNode.items }, nodes),
		});
	},
	deleteNode: (path) => {
		set((state) => ({
			nodes: state.nodes.filter((node) => node.path !== path),
		}));
	},
	updateDraft: (path, draftContent) => {
		const { nodes } = get();
		const node = findNodeInTree(nodes, path);
		if (!node) {
			console.error(`Node not found for path: ${path}`);
			return;
		}

		if (node.content === draftContent) {
			console.warn(`No changes detected for path ${path}. Skipping update...`);
			return;
		}

		set({
			nodes: updateNodeInTree(
				path,
				{ draftContent: draftContent, isDirty: true },
				nodes,
			),
		});
	},
	renameNode: (oldPath, filename) => {
		const { nodes } = get();
		const node = findNodeInTree(nodes, oldPath);
		if (!node) {
			console.error(`Node not found for path: ${oldPath}`);
			return;
		}
		const parentNode = findNodeInTree(nodes, oldPath.replace(/\/[^/]+$/, ''));
		if (!parentNode || parentNode.type !== 'directory') {
			console.error(
				`Parent node not found or is not a directory for path: ${oldPath}`,
			);
			return;
		}

		if (parentNode.items) {
			const existingNode = parentNode.items.find(
				(item) => item.path === filename,
			);
			if (existingNode) {
				console.warn(`Node already exists at path: ${filename}`);
				return;
			}
		}

		const newPath = formatPath(parentNode.path, filename);
		const updatedNode: NodeProps = {
			...node,
			path: newPath,
		};
		// modpack?.fs.rm(oldPath);
		// modpack?.fs.writeFile(newPath, updatedNode.content || '');

		set({
			nodes: updateNodeInTree(oldPath, updatedNode, nodes),
		});
	},
	save: async (path, content) => {
		const { nodes } = get();
		const node = findNodeInTree(nodes, path);
		if (!node) {
			console.error(`Node ${path} not found.`);
			return;
		}

		if (node.content === content) {
			console.warn(`No changes detected for path ${path}. Skipping save...`);
			return;
		}

		const { imports, exports } = useCompilationStore.getState();

		console.log(`Saving file at path: ${path}`, {
			node,
			exports,
			imports,
		});

		set({
			nodes: updateNodeInTree(
				path,
				{ content, draftContent: content, isDirty: false },
				nodes,
			),
		});
		useCompilationStore.getState().hotReload(path, content);
	},
	publish: async () => {
		const { nodes } = get();
		const { exports, imports, modpack } = useCompilationStore.getState();
		const virtualFiles = new Map(
			modpack?.fs.readdir().files.map((path) => {
				return [`file://${path}`, modpack?.fs.readFile(path) || ''];
			}),
		);
		const files = new Map([
			...Object.entries(getNodeFiles(nodes)),
			...virtualFiles.entries(),
		]);

		const registry = buildRegistry({
			imports,
			exports,
			files,
			metadata: JSON.parse(files.get('/metadata.json') || '{}'),
			entrypoint: 'file:///index.tsx',
		});
		const sourceMap = {
			imports: importsMapToRecord(imports),
			exports: exportsMapToRecord(exports),
		};

		console.log(`Publishing CN Component`, {
			exports,
			imports,
			files,
			nodes,
			registry,
			virtualFiles,
			sourceMap,
		});

		/**
		 * 1. tabs [CLI/Manual]
		 * CLI -> shadcn cli command
		 * Manual -> Step by step guide, copy paste files explorer.
		 * 2. Refine and ship 🚀
		 * - Errors UI
		 * 	* - Preview Hot reload error.
		 * - Remove modpack logs
		 * - Remove logs
		 */

		await fetch(`/api/publish`, {
			method: 'POST',
			body: JSON.stringify({
				sourceMap,
				registry,
				files: Object.fromEntries(files.entries()),
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log('Publish response:', data);
			});
	},
}));

export function findNodeInTree(
	nodes: NodeProps[],
	path: string,
): NodeProps | undefined {
	for (const node of nodes) {
		if (node.path === path) return node;
		if (node.type === 'directory' && node.items) {
			const found = findNodeInTree(node.items, path);
			if (found) return found;
		}
	}
	return undefined;
}

export function flattenNodes(nodes: NodeProps[]): NodeProps[] {
	const flatNodes: NodeProps[] = [];
	for (const node of nodes) {
		flatNodes.push(node);
		if (node.type === 'directory' && node.items) {
			flatNodes.push(...flattenNodes(node.items));
		}
	}
	return flatNodes;
}

export function getNodeFiles(nodes: NodeProps[]): Record<string, string> {
	return flattenNodes(nodes).reduce(
		(acc, curr) => {
			if (curr.type === 'file') {
				acc[curr.path] = curr.content;
			}
			return acc;
		},
		{} as Record<string, string>,
	);
}

export function searchNodes(
	callback: (node: NodeProps) => boolean,
	nodes: NodeProps[] = useProjectStore.getState().nodes,
): NodeProps[] {
	const results: NodeProps[] = [];
	for (const node of nodes) {
		if (callback(node)) {
			results.push(node);
		}
		if (node.type === 'directory' && node.items) {
			results.push(...searchNodes(callback, node.items));
		}
	}
	return results;
}

function splitPath(path: string): string[] {
	return path.split(/[\\/]/).filter(Boolean);
}

function formatPath(...paths: string[]) {
	return `/${splitPath(paths.join('/')).join('/')}`;
}

export function updateNodeInTree(
	path: string,
	props: Partial<NodeProps>,
	nodes: NodeProps[],
): NodeProps[] {
	const updatedNodes = nodes.map((node) => {
		if (node.path === path) {
			return { ...node, ...props };
		}
		if (node.type === 'directory' && node.items) {
			return { ...node, items: updateNodeInTree(path, props, node.items) };
		}
		return node;
	});
	return updatedNodes;
}
