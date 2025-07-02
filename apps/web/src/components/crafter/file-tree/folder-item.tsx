import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { FolderIcon } from "lucide-react";
import FileItem from "./file-item";

export default function FolderItem() {
	return (
		<Accordion type="single" collapsible>
			<AccordionItem value="item-1">
				<AccordionTrigger>
					<div className="flex items-center text-left gap-2">
						<FolderIcon className="size-4 text-muted-foreground" />
						<span>Folder Name</span>
					</div>
				</AccordionTrigger>
				<AccordionContent>
					<FileItem />
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
