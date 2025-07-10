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
			reporter.log('info', 'Modpack build starting...');
		},
		onBuildEnd: async ({ result, error, entrypoint, reporter }) => {
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
				reporter.log('info', 'Build completed successfully');
			} else {
				console.error('Build failed:', error);
				reporter.log(
					'error',
					`Build failed: ${error ? error.message : 'Unknown error'}`,
				);
			}

			const { exports, imports } = useCompilationStore.getState();
			console.log({ exports, imports });
		},
		onLog: (log) => {
			useCompilationStore.setState((state) => ({
				logs: [...state.logs, { level: log.level, message: log.message }],
			}));
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
