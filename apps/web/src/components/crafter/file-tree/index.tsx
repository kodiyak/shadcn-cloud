import TreeItem from "./tree-item";

export default function FileTree() {
	return (
		<div className="size-full pr-1 pl-3 flex flex-col overflow-y-auto">
			<div className="flex items-center py-2">
				<span className="text-xs">Workspace</span>
			</div>
			<div className="flex flex-col gap-px">
				<TreeItem />
				<TreeItem />
				<TreeItem />
				<TreeItem />
				<TreeItem />
			</div>
		</div>
	);
}
