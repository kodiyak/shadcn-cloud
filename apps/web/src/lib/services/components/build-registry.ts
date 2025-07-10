import { type RegistryItem, registryItemSchema } from '@uipub/registry';
import kebabCase from 'lodash.kebabcase';
import type { Exports, Imports, Metadata } from '@/lib/domain';
import { processFileDependencies } from './process-file-dependencies';

interface BuildRegistryProps {
	entrypoint: string;
	exports: Exports;
	imports: Imports;
	metadata: Metadata;
}

export function buildRegistry({
	entrypoint,
	exports,
	imports,
	metadata,
}: BuildRegistryProps): RegistryItem {
	const urls = Array.from(
		new Set([...Array.from(imports.keys()), ...Array.from(exports.keys())]),
	);

	const result = processFileDependencies(imports, exports, entrypoint, urls, {
		dependencies: [],
		files: [],
	});

	const registryItem: RegistryItem = {
		name: kebabCase(metadata.title),
		title: metadata.title,
		description: metadata.description || '',
		type: 'registry:block',
		files: [],
		cssVars: {},
	};

	return registryItemSchema.parse(registryItem);
}
