'use client';

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@workspace/ui/components/resizable';
import CodeEditor from '@/components/crafter/code-editor';
import FileTree from '@/components/crafter/file-tree';
import Preview from '@/components/crafter/preview';
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
					<ResizablePanel
						className={'relative'}
						defaultSize={15}
						maxSize={30}
						minSize={15}
					>
						<FileTree />
					</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel>
						<CodeEditor />
					</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel
						className={'relative'}
						defaultSize={30}
						maxSize={60}
						minSize={30}
					>
						<Preview />
					</ResizablePanel>
				</ResizablePanelGroup>
			)}
		</>
	);
}
