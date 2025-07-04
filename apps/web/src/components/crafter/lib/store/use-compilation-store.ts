import { Modpack } from '@modpack/core';
import { esmSh, resolver, swc, virtual } from '@modpack/plugins';
import { create } from 'zustand';

interface CompilationLog {
	timestamp: number;
	message: string;
}

interface CompileProps {
	entrypoint: string;
	files: Record<string, string>;
}

interface CompilationStore {
	isCompiling: boolean;
	logs: CompilationLog[];
	compile: (props: CompileProps) => Promise<void>;
}

export const useCompilationStore = create<CompilationStore>((set) => ({
	isCompiling: false,
	logs: [],
	compile: async ({ files, entrypoint }) => {
		const file = files[entrypoint];
		if (!file) {
			throw new Error(
				`Entrypoint file ${entrypoint} not found in provided files.`,
			);
		}

		set({ isCompiling: true, logs: [] });
		const modpack = await Modpack.boot({
			debug: true,
			plugins: [
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
				resolver({
					extensions: ['.js', '.ts', '.tsx', '.jsx'],
					alias: { '@/': '/src/' },
					index: true,
				}),
				virtual(),
				esmSh(),
			],
		});

		Object.entries(files).forEach(([path, content]) => {
			modpack.fs.writeFile(path, content || '');
		});

		await modpack.mount(entrypoint);

		set((state) => ({
			isCompiling: false,
			logs: [
				...state.logs,
				{
					message: `Compilation successful for entrypoint: ${entrypoint}`,
					timestamp: Date.now(),
				},
			],
		}));
	},
}));
