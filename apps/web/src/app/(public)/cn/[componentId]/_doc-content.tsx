'use client';

import { useDisclosure } from '@workspace/ui/hooks/use-disclosure';
import { useEffect } from 'react';
import { useCompilationStore } from '@/components/crafter/lib/store/use-compilation-store';
import { useProjectStore } from '@/components/crafter/lib/store/use-project-store';
import MdxContent from '@/components/crafter/preview/mdx-content';
import type { Component } from '@/lib/domain';
import TableOfContents from './_table-of-contents';

interface DocContentProps {
	component: Component;
}

export default function DocContent({ component }: DocContentProps) {
	const loading = useDisclosure();
	const isReady = useCompilationStore((state) => state.isReady);

	const onInit = async () => {
		const { selectTemplate } = useProjectStore.getState();
		const { compile } = useCompilationStore.getState();
		await selectTemplate({
			title: component.metadata.title,
			description: component.metadata.description || '',
			files: component.files,
		});

		for (const path of Object.keys(component.files)) {
			if (path.startsWith('file:///previews')) {
				await compile({
					entrypoint: path.replace('file://', ''),
					files: Object.fromEntries(
						Object.entries(component.files).map(([key, value]) => [
							key.replace('file://', ''),
							value,
						]),
					),
				});
			}
		}
	};

	useEffect(() => {
		if (!loading.isOpen && isReady) {
			loading.onOpen();
			onInit().finally(() => {
				loading.onClose();
			});
		}
	}, [isReady]);

	return (
		<div className="flex flex-col">
			<div className="flex gap-12 max-w-4xl items-stretch mx-auto w-full py-12">
				<div className="flex-1 flex flex-col gap-2 overflow-hidden">
					<MdxContent content={component.files['file:///index.mdx'] || ''} />
				</div>
				<div className="w-1/5 flex flex-col shrink-0">
					<div className="sticky top-4">
						<TableOfContents
							content={component.files['file:///index.mdx'] || ''}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
