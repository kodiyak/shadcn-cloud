import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { ButtonsIcons } from "@workspace/ui/components/button";
import { useDisclosure } from "@workspace/ui/hooks/use-disclosure";
import { FolderIcon, PlusIcon } from "lucide-react";
import type { NodeProps } from "../types";
import CreateFile from "./create-file";
import TreeItem from "./tree-item";

export default function FolderItem({ path, items = [] }: NodeProps) {
	const createFile = useDisclosure();
	return (
		<>
			<CreateFile {...createFile} parentPath={path} />
			<AccordionItem value={path}>
				<AccordionTrigger removeArrow>
					<div className="flex items-center text-left gap-2 relative">
						<FolderIcon className="size-4 text-muted-foreground" />
						<span>{path}</span>
					</div>
					<div className="absolute right-2 z-20">
						<ButtonsIcons
							size={"icon-xs"}
							variant={"ghost"}
							items={[
								{
									label: "Create File",
									icon: <PlusIcon />,
									onClick: () => createFile.onOpen(),
								},
							]}
						/>
					</div>
				</AccordionTrigger>
				<AccordionContent>
					<div className="pl-4">
						{items.map((child) => (
							<TreeItem key={child.path} {...child} />
						))}
					</div>
				</AccordionContent>
			</AccordionItem>
		</>
	);
}
