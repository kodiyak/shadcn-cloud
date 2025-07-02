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
	setNodeDirty: (path: string, isDirty: boolean) => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
	isReady: false,
	nodes: [{ type: 'directory', path: '/', content: '', items: [] }],
	selectTemplate: (template) => {
		const { files } = template;
		const nodes: NodeProps[] = [{ type: 'directory', path: '/', content: '' }];

		for (const [path, content] of Object.entries(files)) {
			const parts = splitPath(path);

			// Create directory structure
			for (let i = 0; i < parts.length; i++) {
				const currentPath = formatPath(parts.slice(0, i + 1).join('/'));
				const isDir = i < parts.length - 1;

				const parentNode = findNode(
					nodes,
					formatPath(parts.slice(0, i).join('/')),
				);
				console.log(
					`Path: ${currentPath} [${parts.join(', ')}][${parentNode?.path}]`,
				);

				if (!parentNode) {
					nodes.push({
						type: isDir ? 'directory' : 'file',
						path: currentPath,
						content: '',
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

		console.log({ nodes });

		set({
			isReady: true,
			nodes,
		});
	},
	findNode: (path) => {
		const { nodes } = get();
		return findNode(nodes, path);
	},
	setNodes: (nodes) => set({ nodes }),
	addNode: (parent, node) => {
		const { nodes } = get();
		const parentNode = findNode(nodes, parent);
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
				{
					...node,
					path,
				},
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
		set((state) => ({
			nodes: state.nodes.map((node) =>
				node.path === path ? { ...node, content, isDirty } : node,
			),
		}));
	},
	setNodeDirty: (path, isDirty) => {
		set((state) => ({
			nodes: state.nodes.map((node) =>
				node.path === path ? { ...node, isDirty } : node,
			),
		}));
	},
}));

function findNode(nodes: NodeProps[], path: string): NodeProps | undefined {
	for (const node of nodes) {
		if (node.path === path) return node;
		if (node.type === 'directory' && node.items) {
			const found = findNode(node.items, path);
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
