import { Button } from "@workspace/ui/components/button";
import { FileCodeIcon } from "@workspace/ui/components/icons";
import { useEditorStore } from "../lib/store/use-editor-store";
import type { NodeProps } from "../types";

export default function FileItem({ path }: NodeProps) {
	const filename = path.split("/").pop();
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
			<FileCodeIcon type={filename?.split(".").pop()} className="size-4" />
			<span className="">{filename}</span>
		</Button>
	);
}
