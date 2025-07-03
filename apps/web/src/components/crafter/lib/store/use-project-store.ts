import type { TemplateProps } from '@workspace/core';
import { create } from 'zustand';
import type { NodeProps } from '../../types';
import { useEditorStore } from './use-editor-store';

interface CreateNodeProps extends Omit<NodeProps, 'path'> {
	name: string;
}

interface ProjectStore {
	isReady: boolean;
	selectTemplate: (template: TemplateProps) => void;
	nodes: NodeProps[];
	setNodes: (nodes: NodeProps[]) => void;
	addNode: (parent: string, node: CreateNodeProps) => void;
	deleteNode: (path: string) => void;
	renameNode: (oldPath: string, newPath: string) => void;
	updateContent: (path: string, content: string, isDirty: boolean) => void;
	findNode: (path: string) => NodeProps | undefined;
	searchNodes: (callback: (node: NodeProps) => boolean) => NodeProps[];
	setNodeDirty: (path: string, isDirty: boolean) => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
	isReady: false,
	nodes: [{ type: 'directory', path: '/', content: '', items: [] }],
	searchNodes: (callback) => {
		const { nodes } = get();
		const findInNode = (nodes: NodeProps[]): NodeProps[] => {
			const newNodes: NodeProps[] = [];
			for (const node of nodes) {
				if (callback(node)) {
					newNodes.push(node);
				}
				if (node.type === 'directory' && node.items) {
					newNodes.push(...findInNode(node.items));
				}
			}

			return newNodes;
		};

		return findInNode(nodes);
	},
	selectTemplate: (template) => {
		const { files } = template;
		const nodes: NodeProps[] = [{ type: 'directory', path: '/', content: '' }];

		for (const [path, content] of Object.entries(files)) {
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
							items: [],
						});
					}
				}
			}
		}

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
	updateContent: (path, content, isDirty) => {
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
					return { ...node, content, isDirty };
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
	setNodeDirty: (path, isDirty) => {
		set((state) => ({
			nodes: state.nodes.map((node) =>
				node.path === path ? { ...node, isDirty } : node,
			),
		}));
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

function splitPath(path: string): string[] {
	return path.split(/[\\/]/).filter(Boolean);
}

function formatPath(path: string) {
	return `/${splitPath(path).join('/')}`;
}
