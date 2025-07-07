'use client';

import type { Orchestrator } from '@modpack/core';
import {
	createContext,
	type PropsWithChildren,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import type { ModpackLog } from '../modpack/types';
import { initializeModpack } from '../modpack/utils/initialize-modpack';

interface CompileProps {
	entrypoint: string;
	files: Record<string, string>;
}

interface ModpackContextProps {
	isReady: boolean;
	results: Record<string, any>;
	compiling: Record<string, boolean>;
	errors: Record<string, Error>;
	logs: ModpackLog[];
	compile: (props: CompileProps) => Promise<void>;
}

const ModpackContext = createContext({} as ModpackContextProps);

export function ModpackProvider({ children }: PropsWithChildren) {
	const [results, setResults] = useState<ModpackContextProps['results']>({});
	const [errors, setErrors] = useState<ModpackContextProps['errors']>({});
	const [compiling, setCompiling] = useState<ModpackContextProps['compiling']>(
		{},
	);

	const compile: ModpackContextProps['compile'] = async ({
		entrypoint,
		files,
	}) => {
		if (!modpackRef.current) {
			throw new Error('Modpack is not initialized');
		}

		for (const [path, content] of Object.entries(files)) {
			modpackRef.current.fs.writeFile(path, content || '');
		}

		setCompiling((prev) => ({ ...prev, [entrypoint]: true }));
		await modpackRef.current.mount(entrypoint);
	};
	const [isReady, setIsReady] = useState(false);
	const modpackRef = useRef<Orchestrator | null>(null);
	const [logs, setLogs] = useState<ModpackLog[]>([]);

	useEffect(() => {
		console.log(`Modpack results updated:`, results);
	}, [results.length]);

	useEffect(() => {
		if (!modpackRef.current) {
			initializeModpack({
				onBuildEnd: async ({
					result,
					error,
					options,
					entrypoint,
					reporter,
				}) => {
					if (result)
						setResults((results) => ({ ...results, [entrypoint]: result }));

					if (error) setErrors((prev) => ({ ...prev, [entrypoint]: error }));

					setCompiling((prev) => ({ ...prev, [entrypoint]: false }));

					if (result) {
						reporter.log('info', 'Build completed successfully');

						console.log('Modpack build completed:', {
							result,
							options,
							entrypoint,
						});
					} else {
						console.error('Build failed:', error);
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
				onModuleUpdate: ({
					reporter,
					path,
					content,
					updated,
					result,
					error,
				}) => {
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
			}).then((modpack) => {
				setIsReady(true);
				setResults([]);
				modpackRef.current = modpack;
			});
		}
	}, []);

	return (
		<ModpackContext.Provider
			value={{
				compile,
				logs,
				isReady,
				results,
				compiling,
				errors,
			}}
		>
			{children}
		</ModpackContext.Provider>
	);
}

export const useModpackProvider = () => useContext(ModpackContext);
