import { Button } from "@workspace/ui/components/button";
import { ReactIcon } from "@workspace/ui/components/icons";
import type { NodeProps } from "../types";

export default function FileItem({ path }: NodeProps) {
	return (
		<Button
			className="rounded-md w-full gap-2 justify-start"
			variant={"ghost"}
			size={"xs"}
		>
			<ReactIcon className="size-4" />
			<span className="">{path.split("/").pop()}</span>
		</Button>
	);
}
