import type { ExportsMap, ImportsMap } from '@/lib/domain';

interface ProcessDependencyContext {
	files: string[];
	dependencies: string[];
}
export interface ProcessFileDependenciesProps {
	path: string;
	exports: ExportsMap;
	imports: ImportsMap;
	urls: string[];
	context: ProcessDependencyContext;
}
export function processFileDependencies({
	imports,
	exports,
	path,
	urls,
	context,
}: ProcessFileDependenciesProps): ProcessDependencyContext | undefined {
	const file = imports.get(path);
	if (!file) return;

	if (path.startsWith('file://') && !context.files.includes(path)) {
		context.files.push(path);
	}
	for (const [importPath] of file.entries()) {
		const resolvedPath = resolveImportPath(importPath, path, urls);
		if (!resolvedPath) {
			continue;
		}

		if (
			resolvedPath.startsWith('file://') &&
			!context.files.includes(resolvedPath)
		) {
			context.files.push(resolvedPath);
			processFileDependencies({
				path: resolvedPath,
				imports,
				exports,
				urls,
				context,
			});
		} else {
			if (!context.dependencies.includes(resolvedPath)) {
				context.dependencies.push(resolvedPath);
			}
		}
	}

	return context;
}

function resolveImportPath(path: string, parent: string, urls: string[]) {
	const extensions = ['.ts', '.tsx', '.js', '.jsx', '.json'];
	const base = parent.split('/').slice(0, -1);
	if (
		path.startsWith('..') ||
		path.startsWith('./') ||
		path.startsWith('@/') ||
		path.startsWith('/')
	) {
		// Handle relative paths
		const resolveRelative = () => {
			const parts = path.split('/').filter(Boolean);
			if (path.startsWith('../') || path.startsWith('..')) {
				if (!path.startsWith('../')) base.pop();
				const upCount = path.split('/').filter((p) => p === '..').length;
				return [...base.slice(0, -upCount), ...parts.slice(upCount)].join('/');
			} else if (path.startsWith('./')) {
				const upCount = path.split('/').filter((p) => p === '..').length;
				return [
					...(upCount > 0 ? base.slice(0, -upCount) : base),
					...parts.slice(1),
				].join('/');
			} else if (path.startsWith('@/')) {
				return [...base, ...parts.slice(1)].join('/');
			} else if (path.startsWith('/')) {
				return `/${[...parts].join('/')}`;
			}
			return [...base, ...parts].join('/');
		};

		const resolvedRelative = resolveRelative();
		const relativePath = isUrl(resolvedRelative)
			? resolvedRelative
			: `file://${resolvedRelative}`;
		const possiblePaths = extensions.map((ext) => `${relativePath}${ext}`);
		possiblePaths.push(relativePath);

		for (const possiblePath of possiblePaths) {
			if (urls.includes(possiblePath)) {
				return possiblePath;
			}
		}

		return null;
	}
	return path;
}

function isUrl(url: string): boolean {
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
}
