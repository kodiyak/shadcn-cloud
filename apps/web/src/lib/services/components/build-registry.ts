import {
	type RegistryItem,
	type RegistryItemType,
	registryItemSchema,
} from '@uipub/registry';
import kebabCase from 'lodash.kebabcase';
import type { Exports, Imports, Metadata } from '@/lib/domain';
import { processFileDependencies } from './process-file-dependencies';

interface BuildRegistryProps {
	entrypoint: string;
	exports: Exports;
	imports: Imports;
	metadata: Metadata;
	files: Map<string, string>;
}

export function buildRegistry({
	entrypoint,
	exports,
	imports,
	metadata,
	files,
}: BuildRegistryProps): RegistryItem {
	const urls = Array.from(
		new Set([...Array.from(imports.keys()), ...Array.from(exports.keys())]),
	);

	const result = processFileDependencies({
		imports,
		exports,
		path: entrypoint,
		urls,
		context: {
			dependencies: [],
			files: [],
		},
	});

	const registryFiles = new Map(
		(result?.files || []).map((file) => {
			const content = files.get(new URL(file).pathname);
			return [file, content];
		}),
	);

	const registryItem: RegistryItem = {
		name: kebabCase(metadata.title),
		title: metadata.title,
		description: metadata.description || '',
		type: 'registry:block',
		dependencies: result?.dependencies ?? [],
		files: [
			...Array.from(registryFiles.entries()).map(([file, content]) => ({
				path: normalizePath(file),
				type: classifyPath(file) as any,
				content: content || '',
			})),
		],
		cssVars: {},
	};

	return registryItemSchema.parse(registryItem);
}

function classifyPath(path: string): RegistryItemType {
	const url = new URL(path);

	if (url.pathname.startsWith('/hooks')) {
		return 'registry:hook';
	}

	return 'registry:ui';
}

function normalizePath(path: string) {
	return new URL(path).pathname;
}
