import { Popover, PopoverContent, PopoverTrigger } from "..";

export default function PopoverPreview() {
	return (
		<Popover>
			<PopoverTrigger>Open Popover</PopoverTrigger>
			<PopoverContent>Popover content goes here</PopoverContent>
		</Popover>
	);
}
