'use client';

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@workspace/ui/components/resizable';
import CodeEditor from '@/components/crafter/code-editor';
import Preview from '@/components/crafter/preview';
import CodeSidebar from './code-sidebar';
import { useProjectStore } from './lib/store/use-project-store';
import { useCompilationStore } from './lib/store/use-compilation-store';
import SelectTemplate from './select-template';
import ModpackLogs from '@/components/modpack/modpack-logs';

export default function Crafter() {
	const isReady = useProjectStore((state) => state.isReady);
	const logs = useCompilationStore((state) => state.logs);
	const clearLogs = useCompilationStore((state) => state.clearLogs);
	
	return (
		<>
			{!isReady ? (
				<SelectTemplate />
			) : (
				<ResizablePanelGroup className="flex-1" direction="vertical">
					{/* Main content area */}
					<ResizablePanel 
						id={'resizable-main-content'} 
						order={1}
						defaultSize={75}
						minSize={50}
					>
						<ResizablePanelGroup direction="horizontal">
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
					</ResizablePanel>
					
					{/* Logs panel */}
					<ResizableHandle id={'resizable-logs-handle'} />
					<ResizablePanel
						id={'resizable-logs-panel'}
						order={2}
						defaultSize={25}
						maxSize={50}
						minSize={10}
					>
						<ModpackLogs logs={logs} onClearLogs={clearLogs} />
					</ResizablePanel>
				</ResizablePanelGroup>
			)}
		</>
	);
}
