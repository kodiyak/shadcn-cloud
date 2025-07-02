import { create } from 'zustand';

interface TabProps {
	path: string;
	currentState: 'readonly' | 'open' | 'draft';
}

interface EditorStore {
	tabs: TabProps[];
	path: string;
	draft: Map<string, string>;
	code?: string;
	setTabs: (tabs: TabProps[]) => void;
	setPath: (path: string) => void;
	updateCode: (code: string) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
	tabs: [],
	path: '',
	draft: new Map(),
	code: undefined,
	setTabs: (tabs) => set({ tabs }),
	setPath: (path) => set({ path }),
	updateCode: (code) => {
		set((state) => {
			const newDraft = new Map(state.draft);
			newDraft.set(state.path, code);
			return { draft: newDraft, code };
		});
	},
}));
