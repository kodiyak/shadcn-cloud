"use client";

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@workspace/ui/components/resizable";
import type { NextPage } from "next";
import CodeEditor from "@/components/crafter/code-editor";
import FileTree from "@/components/crafter/file-tree";
import Navtop from "@/components/crafter/nav-top";
import Preview from "@/components/crafter/preview";

const Page: NextPage = () => {
	return (
		<div className="h-screen w-full bg-gradient-to-br from-background to-muted relative py-8 px-20 overflow-hidden">
			<div className="size-full shadow-2xl bg-background rounded-3xl border flex flex-col">
				<Navtop />
				<ResizablePanelGroup className="flex-1" direction="horizontal">
					<ResizablePanel className={"relative"} minSize={15} maxSize={30}>
						<FileTree />
					</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel>
						<CodeEditor />
					</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel className={"relative"} minSize={30} maxSize={60}>
						<Preview />
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		</div>
	);
};

export default Page;
