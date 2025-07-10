import { describe, expect, it, vi } from 'vitest';
import { buildRegistry } from './build-registry';

describe('buildRegistry', () => {
	it('should log the correct values', () => {
		const entrypoint = 'file:///index.tsx';
		const metadata = {
			title: 'Button',
			description:
				'Used to trigger an action or event, such as submitting a form, displaying a dialog or sending a request.',
			features: [
				'A wrapper around native HTML <button>, supports all HTMLButtonElement properties, methods and events',
				'Different variants, sizes and border radiuses',
				'Pending state animation',
				'Respects reduce motion settings',
				'Supports icons, loading spinner and custom content',
			],
			references: [
				{
					title: 'llms.txt',
					href: 'https://llms.ai/docs/components/button',
				},
				{
					title: 'MDN Reference',
					href: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button',
				},
			],
			tools: [
				{
					title: 'React',
					icon: 'react',
					href: 'https://react.dev',
				},
				{
					title: 'TypeScript',
					icon: 'typescript',
					href: 'https://www.typescriptlang.org',
				},
				{
					title: 'Radix UI',
					icon: 'radix',
					href: 'https://www.radix-ui.com',
				},
				{
					title: 'Tailwind CSS',
					icon: 'tailwindcss',
					href: 'https://tailwindcss.com',
				},
				{
					title: 'Motion',
					icon: 'motion',
					href: 'https://motion.dev/one',
				},
				{
					title: 'cva',
					icon: 'cva',
					href: 'https://cva-ui.com',
				},
			],
		};
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
					['./utils', ['cn']],
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

		const result = buildRegistry({ entrypoint, exports, imports, metadata });

		expect(result).toBeDefined();
		expect(result.name).toBe('button');
	});
});
