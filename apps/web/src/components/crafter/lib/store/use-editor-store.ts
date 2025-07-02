import { create } from "zustand";

interface TabProps {
	path: string;
}

interface EditorStore {
	tabs: TabProps[];
	activePath: string | null;
	setTabs: (tabs: TabProps[]) => void;
	setActivePath: (path: string) => void;
	openFile: (path: string) => void;
	closeFile: (path: string) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
	tabs: [],
	activePath: null,
	setTabs: (tabs) => set({ tabs }),
	setActivePath: (path) => set({ activePath: path }),
	openFile: (path) => {
		set((state) => {
			const existingTab = state.tabs.find((tab) => tab.path === path);
			if (!existingTab) {
				return { tabs: [...state.tabs, { path }], activePath: path };
			}
			return { activePath: path };
		});
	},
	closeFile: (path) => {
		set((state) => ({
			tabs: state.tabs.filter((tab) => tab.path !== path),
			activePath: state.activePath === path ? null : state.activePath,
		}));
	},
}));
