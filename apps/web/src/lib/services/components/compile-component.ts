import type { Orchestrator } from '@modpack/core';
import { initializeModpack } from '@/components/modpack/utils/initialize-modpack';
import { buildDependenciesExtractor } from './build-dependencies-extractor';
import { buildRegistry } from './build-registry';

interface CompileComponentProps {
	componentId: string;
	files: Record<string, string>;
	entrypoints: string[];
}

export type CompileComponentResult = Awaited<
	ReturnType<typeof compileComponent>
>;

export async function compileComponent({
	componentId,
	entrypoints,
	files,
}: CompileComponentProps) {
	const sessionId = Date.now().toString(36);
	const baseUrl = `compile-${componentId}-${sessionId}`;
	const deps = buildDependenciesExtractor();
	const modpack = await initializeModpack({
		baseUrl,
		files,
		onParse: deps.onParse,
		onTransform: deps.onTransform,
		onBuildEnd: async (props) => {
			console.log('[onBuildEnd] Modpack build completed:', props.entrypoint, {
				result: props.result,
				error: props.error,
			});
		},
	});

	await Promise.all(
		entrypoints.map((entrypoint) =>
			compileEntrypoint(modpack, `/${baseUrl}${entrypoint}`),
		),
	);

	const registry = buildRegistry({
		entrypoint: `file:///${baseUrl}/index.tsx`,
		exports: deps.getExports(),
		imports: deps.getImports(),
		metadata: JSON.parse(files['/metadata.json'] || '{}'),
		files: Object.fromEntries(
			Object.entries(files).map(([filePath, content]) => [
				`/${baseUrl}${filePath}`,
				content,
			]),
		),
	});

	return {
		registry,
		imports: deps.getImports(),
		exports: deps.getExports(),
	};
}

async function compileEntrypoint(modpack: Orchestrator, entrypoint: string) {
	await modpack.mount(`file://${entrypoint}`);
	console.log(`Mounted entrypoint: ${entrypoint}`);
}
