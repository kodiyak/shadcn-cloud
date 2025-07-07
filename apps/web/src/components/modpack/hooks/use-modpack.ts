import { Modpack, type Orchestrator } from '@modpack/core';
import { esmSh, inject, resolver, virtual } from '@modpack/plugins';
import { react } from '@modpack/react';
import { swc } from '@modpack/swc';
import type { ComponentType } from 'react';
import * as React from 'react';
import * as DevJSXRuntime from 'react/jsx-dev-runtime';
import * as ReactJSXRuntime from 'react/jsx-runtime';
import * as ReactDOM from 'react-dom/client';
import type { ModpackLog } from '../types';

interface CompileProps {
	entrypoint: string;
	files: Record<string, string>;
}

export type UseModpackReturn = ReturnType<typeof useModpack>;

export function useModpack() {
	const modpackRef = React.useRef<Orchestrator | null>(null);
	const [logs, setLogs] = React.useState<ModpackLog[]>([]);
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
			onBuildEnd: async ({ result, error, reporter }) => {
				if (result && 'default' in result) {
					const Component = result.default as ComponentType;
					set((s) => ({
						...s,
						Component,
						isCompiling: false,
						isCompleted: true,
						isError: false,
					}));

					reporter.log('info', 'Build completed successfully');
					console.log('Modpack build completed:', result);
				} else {
					console.error('Build failed:', error);
					set((s) => ({
						...s,
						isCompiling: false,
						isCompleted: true,
						isError: true,
						error,
					}));
					reporter.log(
						'error',
						`Build failed: ${error ? error.message : 'Unknown error'}`,
					);
				}
			},
			onLog: (log) => {
				console.log('Modpack log:', log);
				setLogs((prevLogs) => [
					...prevLogs,
					{ level: log.level, message: log.message },
				]);
			},
			onSourceStart: ({ url, options, reporter, parent }) => {
				reporter.log(
					'info',
					[
						`Starting source: ${url}`,
						`Options:`,
						JSON.stringify({ options, parent }, null, 2),
					].join('\n'),
				);
			},
			onSourceEnd: ({ url, options, reporter, parent, result, error }) => {
				reporter.log(
					error ? 'error' : 'info',
					[
						`Finished source: ${url}`,
						`Options:`,
						JSON.stringify({ error, options, parent, result }, null, 2),
					].join('\n'),
				);
			},
			onBoot: ({ reporter }) => {
				reporter.log('info', 'Modpack booting...');
			},
			onBuildStart: ({ reporter }) => {
				reporter.log('info', 'Modpack build starting...');
			},
			onFetchStart: ({ url, options, reporter }) => {
				reporter.log(
					'info',
					`Fetching URL: ${url} with options: ${JSON.stringify(options)}`,
				);
			},
			onFetchEnd: ({ url, options, reporter, response, error }) => {
				reporter.log(
					error ? 'error' : 'info',
					[
						`Fetch completed for URL: ${url}`,
						`Options: ${JSON.stringify(options)}`,
						`Response: ${response ? response.status : 'No response'}`,
						error ? `Error: ${error.message}` : '',
					].join('\n'),
				);
			},
			onModuleUpdate: ({ reporter, path, content, updated, result, error }) => {
				reporter.log(
					error ? 'error' : 'info',
					[
						`Module update for path: ${path}`,
						`Content: ${content ? content.slice(0, 100) + '...' : 'No content'}`,
						`Updated: ${updated}`,
						result ? `Result: ${JSON.stringify(result)}` : '',
						error ? `Error: ${error.message}` : '',
					].join('\n'),
				);
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
		await initializeModpack();

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
		logs,
	};
}
