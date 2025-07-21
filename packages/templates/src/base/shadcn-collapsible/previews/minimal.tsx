import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "..";

export default function CollapsiblePreview() {
	return (
		<Collapsible>
			<CollapsibleTrigger>Toggle</CollapsibleTrigger>
			<CollapsibleContent>Content goes here</CollapsibleContent>
		</Collapsible>
	);
}
