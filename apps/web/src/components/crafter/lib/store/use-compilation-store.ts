import { Modpack, type Orchestrator } from '@modpack/core';
import { esmSh, inject, resolver, virtual } from '@modpack/plugins';
import { react } from '@modpack/react';
import { swc } from '@modpack/swc';
import type { ComponentType } from 'react';
import * as React from 'react';
import * as DevJSXRuntime from 'react/jsx-dev-runtime';
import * as ReactJSXRuntime from 'react/jsx-runtime';
import * as ReactDOM from 'react-dom/client';
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
	modpack: Orchestrator | null;
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
			onBuildEnd: async ({ result }) => {
				if (result && 'default' in result) {
					const Component = result.default as ComponentType;
					set(() => ({ Component }));
				}
			},
			plugins: [
				{
					name: 'fetch',
					pipeline: {
						fetcher: {
							fetch: ({ url, options, next }) => {
								console.log(`OPTIONS`, options);
								return url.startsWith('http') ? fetch(url) : next();
							},
						},
					},
				},
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
								refresh: true,
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
				esmSh({
					external: [
						'react',
						'react-dom',
						'react/jsx-dev-runtime',
						'react/jsx-runtime',
					],
				}),
				inject({
					modules: {
						react: React,
						'react/jsx-dev-runtime': DevJSXRuntime,
						'react/jsx-runtime': ReactJSXRuntime,
						'react-dom/client': ReactDOM,
					},
				}),
				react({ self: window, extensions: ['.tsx', '.jsx'] }),
			],
		});

		Object.entries(files).forEach(([path, content]) => {
			modpack.fs.writeFile(path, content || '');
		});

		await modpack.mount(entrypoint);

		set(() => ({ modpack, isCompiling: false }));
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
