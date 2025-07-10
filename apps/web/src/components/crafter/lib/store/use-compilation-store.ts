import type { Orchestrator } from '@modpack/core';
import { create } from 'zustand';
import type { ModpackLog } from '@/components/modpack/types';
import { initializeModpack } from '@/components/modpack/utils/initialize-modpack';
import { saveLogsToStorage, loadLogsFromStorage } from '@/lib/utils/log-persistence';

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
	addLog: (level: ModpackLog['level'], message: string, category: string, metadata?: Record<string, any>) => void;
	clearLogs: () => void;
}

export const useCompilationStore = create<CompilationStore>((set, get) => ({
	isReady: false,
	isLoading: false,
	exports: new Map(),
	imports: new Map(),
	logs: typeof window !== 'undefined' ? loadLogsFromStorage() : [],
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
	addLog: (level, message, category, metadata = {}) => {
		set((state) => {
			const newLogs = [...state.logs, {
				level,
				message,
				timestamp: new Date().toISOString(),
				source: 'modpack',
				category,
				metadata
			}];
			
			// Save to localStorage
			if (typeof window !== 'undefined') {
				saveLogsToStorage(newLogs);
			}
			
			return {
				logs: newLogs,
			};
		});
	},
	clearLogs: () => {
		set({ logs: [] });
		if (typeof window !== 'undefined') {
			saveLogsToStorage([]);
		}
	},
}));

async function main() {
	if (useCompilationStore.getState().isReady) {
		console.warn('Modpack is already initialized');
		return;
	}
	useCompilationStore.setState({ isLoading: true });

	const modpack = await initializeModpack({
		onBoot: () => {
			useCompilationStore.setState({ isLoading: false });
		},
		onParse: ({ url, parsed }) => {
			const { exports, imports } = useCompilationStore.getState();

			for (const node of parsed.body) {
				const addExports = (...exportsList: string[]) => {
					exports.set(
						url,
						Array.from(new Set([...(exports.get(url) || []), ...exportsList])),
					);
				};
				const addImports = (path: string, importsList: string[]) => {
					if (imports.has(url)) {
						imports
							.get(url)
							?.set(
								path,
								Array.from(
									new Set([
										...(imports.get(url)?.get(path) || []),
										...importsList,
									]),
								),
							);
					} else {
						imports.set(
							url,
							new Map([[path, Array.from(new Set(importsList))]]),
						);
					}
				};
				if (
					node.type === 'ExpressionStatement' &&
					node.expression.type === 'AssignmentExpression' &&
					node.expression.operator === '=' &&
					node.expression.left.type === 'MemberExpression' &&
					node.expression.left.object.type === 'Identifier' &&
					node.expression.left.object.value === 'module' &&
					node.expression.left.property.type === 'Identifier' &&
					node.expression.left.property.value === 'exports'
				) {
					addExports('default');
				}

				if (node.type === 'ExportNamedDeclaration') {
					for (const specifier of node.specifiers) {
						if (specifier.type === 'ExportSpecifier') {
							addExports(specifier.orig.value);
						} else if (specifier.type === 'ExportDefaultSpecifier') {
							addExports(specifier.exported.value);
						}
					}
				}

				if (node.type === 'ExportAllDeclaration') {
					if (node.source.value) {
						addExports(node.source.value);
					} else {
						addExports('default');
					}
				}

				if (node.type === 'ExportDeclaration') {
					if (
						node.declaration.type === 'FunctionDeclaration' ||
						node.declaration.type === 'ClassDeclaration'
					) {
						addExports(node.declaration.identifier.value);
					}
				}

				if (node.type === 'ImportDeclaration') {
					addImports(
						node.source.value,
						node.specifiers.map((specifier) => {
							switch (specifier.type) {
								case 'ImportSpecifier':
									return specifier.local.value;
								case 'ImportDefaultSpecifier':
									return 'default';
								case 'ImportNamespaceSpecifier':
									return '*';
								default:
									return '';
							}
						}),
					);
				}
			}

			useCompilationStore.setState(() => ({
				exports: new Map(exports),
				imports: new Map(imports),
			}));
		},
		onBuildStart: ({ reporter }) => {
			const { addLog } = useCompilationStore.getState();
			addLog('info', 'Modpack build starting...', 'build');
		},
		onBuildEnd: async ({ result, error, entrypoint, reporter }) => {
			const { addLog } = useCompilationStore.getState();
			
			if (result) {
				useCompilationStore.setState((s) => ({
					results: { ...s.results, [entrypoint]: result },
				}));
			}

			if (error) {
				useCompilationStore.setState((prev) => ({
					errors: { ...prev.errors, [entrypoint]: error },
				}));
			}

			useCompilationStore.setState((prev) => ({
				compiling: { ...prev.compiling, [entrypoint]: false },
			}));

			if (result) {
				addLog('info', 'Build completed successfully', 'build', { entrypoint });
			} else {
				console.error('Build failed:', error);
				addLog('error', `Build failed: ${error ? error.message : 'Unknown error'}`, 'build', { entrypoint, error: error?.message });
			}

			const { exports, imports } = useCompilationStore.getState();
			console.log({ exports, imports });
		},
		onLog: (log) => {
			useCompilationStore.setState((state) => ({
				logs: [...state.logs, { 
					level: log.level, 
					message: log.message,
					timestamp: new Date().toISOString(),
					source: 'modpack',
					category: 'compilation',
					metadata: log.metadata || {}
				}],
			}));
		},
		onSourceStart: ({ url, options, reporter, parent }) => {
			const { addLog } = useCompilationStore.getState();
			addLog('info', `Starting source: ${url}`, 'source', { url, options, parent });
		},
		onSourceEnd: ({ url, options, reporter, parent, result, error }) => {
			const { addLog } = useCompilationStore.getState();
			addLog(
				error ? 'error' : 'info',
				`Finished source: ${url}`,
				'source',
				{ url, options, parent, result, error: error?.message }
			);
		},

		onFetchStart: ({ url, options, reporter }) => {
			const { addLog } = useCompilationStore.getState();
			addLog('info', `Fetching URL: ${url}`, 'fetch', { url, options });
		},
		onFetchEnd: ({ url, options, reporter, response, error }) => {
			const { addLog } = useCompilationStore.getState();
			addLog(
				error ? 'error' : 'info',
				`Fetch completed for URL: ${url}`,
				'fetch',
				{ url, options, status: response?.status, error: error?.message }
			);
		},
		onModuleUpdate: ({ reporter, path, content, updated, result, error }) => {
			const { addLog } = useCompilationStore.getState();
			addLog(
				error ? 'error' : 'info',
				`Module update for path: ${path}`,
				'module',
				{ path, contentLength: content?.length, updated, result, error: error?.message }
			);

			useCompilationStore.setState((prev) => ({
				compiling: { ...prev.compiling, [path]: false },
			}));
		},
	});

	useCompilationStore.setState({
		modpack,
		isReady: true,
	});
}

if (typeof window !== 'undefined') {
	main();
}
