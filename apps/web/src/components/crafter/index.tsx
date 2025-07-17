'use client';

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@workspace/ui/components/resizable';
import { useEffect } from 'react';
import CodeEditor from '@/components/crafter/code-editor';
import Preview from '@/components/crafter/preview';
import type { Component } from '@/lib/domain';
import CodeSidebar from './code-sidebar';
import { useProjectStore } from './lib/store/use-project-store';
import SelectTemplate from './select-template';

interface CrafterProps {
	component: Component;
}

export default function Crafter({ component }: CrafterProps) {
	const isReady = useProjectStore((state) => state.isReady);
	const selectTemplate = useProjectStore((state) => state.selectTemplate);

	useEffect(() => {
		if (!isReady && component) {
			selectTemplate({
				title: component.metadata.title,
				description: component.metadata.description || '',
				files: component.files,
			});
		}
	}, [component.id, isReady]);

	return (
		<>
			{!isReady ? (
				<SelectTemplate />
			) : (
				<ResizablePanelGroup className="flex-1" direction="horizontal">
					<CodeSidebar />
					<ResizablePanel id={'resizable-code-editor'} order={1}>
						<CodeEditor />
					</ResizablePanel>
					<ResizableHandle id={'resizable-code-editor-handle'} />
					<ResizablePanel
						className={'relative'}
						defaultSize={50}
						id={'resizable-preview-panel'}
						maxSize={60}
						minSize={30}
						order={2}
					>
						<Preview />
					</ResizablePanel>
				</ResizablePanelGroup>
			)}
		</>
	);
}
