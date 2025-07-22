'use client';

import { CaretLeftIcon } from '@phosphor-icons/react';
import { Button } from '@workspace/ui/components/button';
import { FileCodeIcon } from '@workspace/ui/components/icons';
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@workspace/ui/components/resizable';
import { useDisclosure } from '@workspace/ui/hooks/use-disclosure';
import { ExternalLinkIcon, SendIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import CodeEditor from '@/components/crafter/code-editor';
import Preview from '@/components/crafter/preview';
import type { Component } from '@/lib/domain';
import PublishComponent from '../components-entity/publish-component';
import CodeSidebar from './code-sidebar';
import { useEditorStore } from './lib/store/use-editor-store';
import { useProjectStore } from './lib/store/use-project-store';

interface CrafterProps {
	component: Component;
}

export default function Crafter({ component }: CrafterProps) {
	const activePath = useEditorStore((state) => state.activePath);
	const isReady = useProjectStore((state) => state.isReady);
	const selectTemplate = useProjectStore((state) => state.selectTemplate);
	const filename = activePath?.split('/').pop() || '';
	const openPublish = useDisclosure();

	useEffect(() => {
		if (!isReady && component) {
			selectTemplate({
				componentId: component.id,
				title: component.metadata.title,
				description: component.metadata.description || '',
				files: component.files,
			});
		}
	}, [component.id, isReady]);

	if (!isReady) return null;

	return (
		<>
			<PublishComponent {...openPublish} />
			<div className="flex-1 flex flex-col">
				<div className="h-10 border-b flex items-center pl-2 pr-4">
					<Button asChild size={'xs'} variant={'ghost'}>
						<Link href={'/my-library'}>
							<CaretLeftIcon />
							<span>Back</span>
						</Link>
					</Button>
					<div className="flex-1 flex items-center justify-center">
						<div className="w-full max-w-2xl h-7 flex items-center justify-center rounded-md bg-muted/20 border gap-2 px-4.5">
							<FileCodeIcon
								className="size-3.5"
								type={filename.split('.').pop() || ''}
							/>
							<span className="text-xs font-medium font-mono text-muted-foreground">
								{filename}
							</span>
						</div>
					</div>
					<div className="flex justify-self-end items-center gap-1">
						<Button asChild size={'xs'} variant={'ghost'}>
							<Link href={`/cn/${component.id}`} target="_blank">
								<ExternalLinkIcon />
								<span>Preview</span>
							</Link>
						</Button>
						<Button onClick={openPublish.onOpen} size={'xs'} variant={'ghost'}>
							<SendIcon />
							<span>Publish</span>
						</Button>
					</div>
				</div>
				<ResizablePanelGroup
					className="flex-1"
					direction="vertical"
					id={'crafter-container'}
				>
					<ResizablePanel defaultSize={80} id={'crafter-code-edit-ropanel'}>
						<ResizablePanelGroup
							direction="horizontal"
							id={'crafter-editor-group'}
						>
							<ResizablePanel
								className={'relative flex flex-col'}
								defaultSize={15}
								id={'resizable-code-sidebar'}
								maxSize={30}
								minSize={15}
							>
								<CodeSidebar />
							</ResizablePanel>
							<ResizableHandle id={'resizable-code-sidebar-handle'} />
							<ResizablePanel id={'resizable-code-editor'}>
								<CodeEditor />
							</ResizablePanel>
							<ResizableHandle id={'resizable-code-editor-handle'} />
							<ResizablePanel
								className={'relative'}
								defaultSize={50}
								id={'resizable-preview-panel'}
								maxSize={60}
								minSize={30}
							>
								<Preview />
							</ResizablePanel>
						</ResizablePanelGroup>
					</ResizablePanel>
					<ResizableHandle id={'resizable-code-editor-vertical-separator'} />

					<ResizablePanel id={'resizable-code-logs'}>
						{/* Logs */}
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		</>
	);
}
