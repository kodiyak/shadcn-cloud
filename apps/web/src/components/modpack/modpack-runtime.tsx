'use client';

import { ErrorBoundary } from '@workspace/ui/components/error-boundary';
import { useEffect, useRef } from 'react';
import { useModpack } from './hooks/use-modpack';

interface ModpackRuntimeProps {
	componentId: string;
	path: string;
	files: Record<string, string>;
}

export default function ModpackRuntime({
	componentId,
	files,
	path,
}: ModpackRuntimeProps) {
	const elementRef = useRef<HTMLDivElement | null>(null);
	const { isReady, mount, module } = useModpack(componentId, { elementRef });
	const Component = module?.default;
	const onMount = async () => {
		try {
			const componentFiles = Object.keys(files).reduce(
				(acc, file) => {
					acc[`${file.replace('file://', '')}`] = files[file];
					return acc;
				},
				{} as Record<string, string>,
			);
			await mount(path, componentFiles);
		} catch (error) {
			console.error('Failed to load modpack:', error);
		}
	};

	useEffect(() => {
		if (isReady) onMount();
	}, [isReady]);

	return (
		<div
			className={'size-full absolute inset-0 flex items-center justify-center'}
			ref={elementRef}
		>
			{Component && (
				<ErrorBoundary fallback={(err) => <div>{err.stack}</div>}>
					<Component />
				</ErrorBoundary>
			)}
		</div>
	);
}
