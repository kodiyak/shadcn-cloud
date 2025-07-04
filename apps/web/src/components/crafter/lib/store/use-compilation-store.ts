import { Modpack } from '@modpack/core';
import { esmSh, resolver, swc, virtual } from '@modpack/plugins';
import type { ComponentType } from 'react';
import { create } from 'zustand';

interface CompilationLog {
	timestamp: number;
	message: string;
}

interface CompileProps {
	entrypoint: string;
	files: Record<string, string>;
}

function getModpack() {
	return Modpack.boot({});
}
type ModpackType = Awaited<ReturnType<typeof getModpack>>;

interface CompilationStore {
	isCompiling: boolean;
	logs: CompilationLog[];
	modpack: ModpackType | null;
	Component: ComponentType | null;
	previews: string[];
	currentPreview: string | null;
	files: Record<string, string>;
	compile: (props: CompileProps) => Promise<void>;
	hotReload: (path: string, content: string) => void;
}

export const useCompilationStore = create<CompilationStore>((set, get) => ({
	isCompiling: false,
	logs: [],
	previews: [],
	files: {},
	currentPreview: null,
	Component: null,
	modpack: null,
	compile: async ({ files, entrypoint }) => {
		const file = files[entrypoint];
		if (!file) {
			throw new Error(
				`Entrypoint file ${entrypoint} not found in provided files.`,
			);
		}

		set({
			files,
			isCompiling: true,
			logs: [],
		});
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

		const mountedModule = await modpack.mount(entrypoint);

		console.log({ modpack, mountedModule });

		set((state) => ({
			Component: mountedModule.default as ComponentType,
			modpack,
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
	hotReload: (path, content) => {
		const { modpack, Component } = get();
		set((state) => ({
			files: {
				...state.files,
				[path]: content,
			},
		}));

		console.log(`Hot reloading file: ${path}`);
		console.log(`Content length: ${content.length}`);
		console.log(`Modpack instance: ${modpack ? 'available' : 'not available'}`);
		modpack?.fs.writeFile(path, content || '');
	},
}));
