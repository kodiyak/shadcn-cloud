import { create } from "zustand";
import type { NodeProps } from "../../types";
import { useEditorStore } from "./use-editor-store";

interface CreateNodeProps extends Omit<NodeProps, "path"> {
	name: string;
}

interface ProjectStore {
	nodes: NodeProps[];
	setNodes: (nodes: NodeProps[]) => void;
	addNode: (parent: string, node: CreateNodeProps) => void;
	deleteNode: (path: string) => void;
	renameNode: (oldPath: string, newPath: string) => void;
	updateContent: (path: string, content: string, isDirty: boolean) => void;
	setNodeDirty: (path: string, isDirty: boolean) => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
	nodes: [{ type: "directory", path: "/", content: "", items: [] }],
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

		if (parentNode.type === "directory") {
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
			console.error("Cannot add a node to a file.");
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
		if (node.type === "directory" && node.items) {
			const found = findNode(node.items, path);
			if (found) return found;
		}
	}
	return undefined;
}

function formatPath(path: string) {
	return `/${path.split("/").filter(Boolean).join("/")}`;
}
