import { Modpack, type Orchestrator } from '@modpack/core';
import { esmSh, inject, resolver, virtual } from '@modpack/plugins';
import { react } from '@modpack/react';
import { swc } from '@modpack/swc';
import type { ComponentType } from 'react';
import * as React from 'react';
import * as DevJSXRuntime from 'react/jsx-dev-runtime';
import * as ReactJSXRuntime from 'react/jsx-runtime';
import * as ReactDOM from 'react-dom/client';

interface CompileProps {
	entrypoint: string;
	files: Record<string, string>;
}

export type UseModpackReturn = ReturnType<typeof useModpack>;

export function useModpack() {
	const modpackRef = React.useRef<Orchestrator | null>(null);
	const [{ Component, files, isCompiling, isError, isCompleted, error }, set] =
		React.useState({
			files: {} as Record<string, string>,
			isCompiling: false,
			isCompleted: false,
			isError: false,
			error: null as Error | null,
			Component: null as ComponentType | null,
		});

	const initializeModpack = async () => {
		const modpack = await Modpack.boot({
			debug: true,
			onBuildEnd: async ({ result, error }) => {
				if (result && 'default' in result) {
					const Component = result.default as ComponentType;
					set((s) => ({
						...s,
						Component,
						isCompiling: false,
						isCompleted: true,
						isError: false,
					}));
				} else {
					console.error('Build failed:', error);
					set((s) => ({
						...s,
						isCompiling: false,
						isCompleted: true,
						isError: true,
						error,
					}));
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
				esmSh({
					external: [
						'react',
						'react-dom',
						'react/jsx-dev-runtime',
						'react/jsx-runtime',
					],
				}),
				virtual(),
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
		modpackRef.current = modpack;
	};

	const compile = async ({ files, entrypoint }: CompileProps) => {
		const file = files[entrypoint];
		if (!file) {
			throw new Error(
				`Entrypoint file ${entrypoint} not found in provided files.`,
			);
		}

		set((s) => ({
			...s,
			files,
			isCompiling: true,
			Component: null,
		}));
		if (!modpackRef.current) {
			await initializeModpack();
		}

		Object.entries(files).forEach(([path, content]) => {
			modpackRef.current?.fs.writeFile(path, content || '');
		});

		await modpackRef.current?.mount(entrypoint);
	};

	const update = async ({ files, entrypoint }: CompileProps) => {
		if (!modpackRef.current) {
			throw new Error('Modpack is not initialized. Please compile first.');
		}
		for (const [path, content] of Object.entries(files)) {
			modpackRef.current?.fs.writeFile(path, content || '');
		}

		const result = await modpackRef.current.refresh(
			entrypoint,
			files[entrypoint],
		);

		console.log('Modpack updated:', { files, entrypoint, result });
	};

	return {
		compile,
		update,
		files,
		isCompiling,
		Component,
		modpack: modpackRef.current,
		isError,
		isCompleted,
		error,
	};
}
