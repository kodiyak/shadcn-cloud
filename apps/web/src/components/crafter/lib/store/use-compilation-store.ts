import type { Orchestrator } from '@modpack/core';
import { create } from 'zustand';
import type { ModpackLog } from '@/components/modpack/types';
import { initializeModpack } from '@/components/modpack/utils/initialize-modpack';

interface CompileProps {
	entrypoint: string;
	files: Record<string, string>;
}

interface CompilationStore {
	isReady: boolean;
	isLoading: boolean;
	logs: ModpackLog[];
	modpack: Orchestrator | null;
	results: Record<string, any>;
	compiling: Record<string, boolean>;
	errors: Record<string, Error>;
	files: Record<string, string>;
	exports: Map<string, string[]>;
	imports: Map<string, Map<string, string[]>>;
	compile: (props: CompileProps) => Promise<void>;
	hotReload: (path: string, content: string) => void;
}

export const useCompilationStore = create<CompilationStore>((set, get) => ({
	isReady: false,
	isLoading: false,
	exports: new Map(),
	imports: new Map(),
	logs: [],
	files: {},
	results: {},
	errors: {},
	compiling: {},
	modpack: null,
	compile: async ({ files, entrypoint }) => {
		const { modpack } = get();
		const file = files[entrypoint];
		if (!file) {
			throw new Error(
				`Entrypoint file ${entrypoint} not found in provided files.`,
			);
		}

		if (!modpack) {
			throw new Error('Modpack is not initialized.');
		}

		set((s) => ({
			files,
			compiling: { ...s.compiling, [entrypoint]: true },
		}));

		Object.entries(files).forEach(([path, content]) => {
			modpack.fs.writeFile(path, content || '');
		});

		await modpack.mount(entrypoint);

		set(() => ({ modpack, isReady: false }));
	},
	hotReload: (path, content) => {
		const { modpack } = get();
		modpack?.fs.writeFile(path, content || '');
		set((state) => ({
			files: {
				...state.files,
				[path]: content,
			},
		}));
	},
}));

async function main() {
	if (useCompilationStore.getState().isReady) {
		console.warn('Modpack is already initialized');
		return;
	}
	useCompilationStore.setState({ isLoading: true });
	useCompilationStore.setState({
		isReady: true,
		isLoading: false,
	});
}

if (typeof window !== 'undefined') {
	main();
}
