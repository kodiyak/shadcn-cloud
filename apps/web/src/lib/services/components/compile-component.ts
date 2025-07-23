import type { Orchestrator } from '@modpack/core';
import { initializeModpack } from '@/components/modpack/utils/initialize-modpack';
import { backendClient } from '@/lib/clients/backend';
import cnFiles from '@/lib/cn.json';
import type { PackageJson } from '@/lib/domain';
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

	const ignoredDependencies = ['react', 'react-dom'];
	const dependencies = (
		await Promise.all(
			(registry.dependencies ?? []).map(async (dep) => {
				return backendClient
					.getExternalPackage(dep)
					.then((res) => res.data)
					.catch(() => null) as Promise<PackageJson>;
			}),
		)
	)
		.filter((dep) => dep && !ignoredDependencies.includes(dep.name))
		.reduce((acc: PackageJson[], curr) => {
			if (!curr || acc.some((pkg) => pkg.name === curr.name)) return acc;
			acc.push(curr);
			return acc;
		}, [] as PackageJson[]);

	registry.files = (registry.files ?? []).map((file) => ({
		...file,
		path: file.path.replace(`/${baseUrl}`, ''),
	}));
	registry.registryDependencies = registry.registryDependencies ?? [];

	const cnPaths = Object.keys(cnFiles);
	const cnIgnore = ['/lib/utils.ts'];
	registry.files?.forEach((file) => {
		if (cnPaths.includes(file.path)) {
			registry.files = registry.files?.filter((f) => f.path !== file.path);

			if (!cnIgnore.includes(file.path)) {
				const registryDependency = file.path.split('/').pop()!.split('.')[0];
				registry.registryDependencies?.push(registryDependency);
			}
		}
	});

	return {
		registry,
		dependencies,
		imports: deps.getImports(),
		exports: deps.getExports(),
	};
}

async function compileEntrypoint(modpack: Orchestrator, entrypoint: string) {
	await modpack.mount(`file://${entrypoint}`);
	console.log(`Mounted entrypoint: ${entrypoint}`);
}
