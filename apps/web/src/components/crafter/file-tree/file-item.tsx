import { Button } from "@workspace/ui/components/button";
import { ReactIcon } from "@workspace/ui/components/icons";
import { FileIcon } from "lucide-react";

export default function FileItem() {
	return (
		<Button
			className="rounded-md w-full gap-2 justify-start"
			variant={"ghost"}
			size={"xs"}
		>
			<ReactIcon className="size-4" />
			<span className="">index.tsx</span>
		</Button>
	);
}
