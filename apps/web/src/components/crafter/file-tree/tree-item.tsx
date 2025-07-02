import type { NodeProps } from "../types";
import FileItem from "./file-item";
import FolderItem from "./folder-item";

export default function TreeItem(props: NodeProps) {
	if (props.type === "file") return <FileItem {...props} />;
	return <FolderItem {...props} />;
}
