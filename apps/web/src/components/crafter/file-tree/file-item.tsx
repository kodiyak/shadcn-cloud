import { Button } from "@workspace/ui/components/button";
import { ReactIcon } from "@workspace/ui/components/icons";
import { useEditorStore } from "../lib/store/use-editor-store";
import type { NodeProps } from "../types";

export default function FileItem({ path }: NodeProps) {
	const activePath = useEditorStore((state) => state.activePath);
	const openFile = useEditorStore((state) => state.openFile);
	return (
		<Button
			className="rounded-md w-full gap-2 justify-start"
			variant={"ghost"}
			size={"xs"}
			onClick={() => openFile(path)}
			data-state={path === activePath ? "open" : undefined}
		>
			<ReactIcon className="size-4" />
			<span className="">{path.split("/").pop()}</span>
		</Button>
	);
}
