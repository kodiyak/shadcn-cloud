'use client';

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@workspace/ui/components/resizable';
import CodeEditor from '@/components/crafter/code-editor';
import FileTree from '@/components/crafter/file-tree';
import Preview from '@/components/crafter/preview';
import CodeSidebar from './code-sidebar';
import { useProjectStore } from './lib/store/use-project-store';
import SelectTemplate from './select-template';

export default function Crafter() {
	const isReady = useProjectStore((state) => state.isReady);
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
						defaultSize={30}
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
