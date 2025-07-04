import type { TemplateProps } from '@workspace/core';
import { create } from 'zustand';
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
	renameNode: (oldPath: string, newPath: string) => void;
	updateContent: (path: string, content: string) => void;
	findNode: (path: string) => NodeProps | undefined;
	searchNodes: (callback: (node: NodeProps) => boolean) => NodeProps[];
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
		const { compile } = useCompilationStore.getState();
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

		// Make files consistent with the expected structure
		const modpackFiles = flattenNodes(nodes).reduce(
			(acc, node) => {
				if (
					!node.content ||
					node.type !== 'file' ||
					node.path.endsWith('.json') ||
					node.path.endsWith('.mdx')
				) {
					return acc;
				}
				acc[node.path] = node.content || '';
				return acc;
			},
			{} as Record<string, string>,
		);

		const entrypoint = Object.keys(modpackFiles).find(
			(path) => path.endsWith('.tsx') || path.endsWith('.jsx'),
		);

		if (!entrypoint) {
			console.error('No valid entrypoint found in the template files.');
			return;
		}

		await compile({ files: modpackFiles, entrypoint });

		set({
			isReady: true,
			nodes,
		});
	},
	findNode: (path) => {
		const { nodes } = get();
		console.log(`Finding node for path: ${path}`);
		return findNodeInTree(nodes, path);
	},
	setNodes: (nodes) => set({ nodes }),
	addNode: (parent, node) => {
		const { nodes } = get();
		const parentNode = findNodeInTree(nodes, parent);
		const path = formatPath(`${parent}/${node.name}`);
		if (!parentNode) {
			set((state) => ({
				nodes: [...state.nodes, { ...node, path }],
			}));
			return;
		}

		if (parentNode.type === 'directory') {
			const updatedChildren: NodeProps[] = [
				...(parentNode.items || []),
				{ ...node, path },
			];
			set((state) => ({
				nodes: state.nodes.map((n) =>
					n.path === parent ? { ...n, items: updatedChildren } : n,
				),
			}));
			useEditorStore.getState().openFile(path);
		} else {
			console.error('Cannot add a node to a file.');
		}
	},
	deleteNode: (path) => {
		set((state) => ({
			nodes: state.nodes.filter((node) => node.path !== path),
		}));
	},
	renameNode: (oldPath, newPath) => {
		set((state) => ({
			nodes: state.nodes.map((node) =>
				node.path === oldPath ? { ...node, path: newPath } : node,
			),
		}));
	},
	updateContent: (path, content) => {
		const { nodes } = get();
		const node = findNodeInTree(nodes, path);
		if (!node) {
			console.error(`Node not found for path: ${path}`);
			return;
		}

		// Recursively update content in the node tree
		const updateNodeContent = (nodes: NodeProps[]): NodeProps[] => {
			return nodes.map((node) => {
				if (node.path === path) {
					return { ...node, draftContent: content, isDirty: true };
				}
				if (node.type === 'directory' && node.items) {
					return { ...node, items: updateNodeContent(node.items) };
				}
				return node;
			});
		};

		set({
			nodes: updateNodeContent(nodes),
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

function formatPath(path: string) {
	return `/${splitPath(path).join('/')}`;
}
