"use client";

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@workspace/ui/components/resizable";
import CodeEditor from "@/components/crafter/code-editor";
import FileTree from "@/components/crafter/file-tree";
import Preview from "@/components/crafter/preview";

export default function Crafter() {
	return (
		<ResizablePanelGroup className="flex-1" direction="horizontal">
			<ResizablePanel
				className={"relative"}
				minSize={15}
				defaultSize={15}
				maxSize={30}
			>
				<FileTree />
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel>
				<CodeEditor />
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel
				className={"relative"}
				defaultSize={30}
				minSize={30}
				maxSize={60}
			>
				<Preview />
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
