import { describe, expect, it } from 'vitest';
import { processFileDependencies } from './process-file-dependencies';

describe('processFileDependencies', () => {
	it('should resolve paths correctly', () => {
		const exports = new Map<string, string[]>([
			['file:///index.tsx', ['ComponentA', 'ComponentB']],
			['file:///utils.ts', ['cn']],
			['file:///utils/helpers.ts', ['helper']],
			['file:///utils/alias.ts', ['aliastFn']],
			['internal://clsx', ['clsx']],
			['internal://react/jsx-runtime', ['mod']],
			['internal://tailwind-merge', ['mod']],
			['https://esm.sh/@radix-ui/react-slot@1.2.3', ['Slot', 'SlotProvider']],
		]);
		const imports = new Map<string, Map<string, string[]>>([
			[
				'file:///index.tsx',
				new Map([
					['/utils', ['cn']],
					['./utils/helpers', ['helper']],
					['@/utils/alias', ['aliastFn']],
					['react/jsx-dev-runtime', ['_jsxDEV']],
					['@radix-ui/react-slot', ['Slot']],
					['class-variance-authority', ['cva']],
				]),
			],
			[
				'file:///utils.ts',
				new Map([
					['clsx', ['clsx']],
					['tailwind-merge', ['twMerge']],
				]),
			],
			['internal://react/jsx-runtime', new Map([['mod', ['mod']]])],
			[
				'https://esm.sh/@radix-ui/react-slot@1.2.3',
				new Map([['react', ['*']]]),
			],
		]);

		const entrypoint = 'file:///index.tsx';
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

		expect(result?.files).toContain('file:///index.tsx');
		expect(result?.files).toContain('file:///utils/helpers.ts');
		expect(result?.files).toContain('file:///utils.ts');
		expect(result?.files).toContain('file:///utils/alias.ts');

		expect(result?.dependencies).toContain('clsx');
		expect(result?.dependencies).toContain('tailwind-merge');
		expect(result?.dependencies).toContain('react/jsx-dev-runtime');
	});
});
