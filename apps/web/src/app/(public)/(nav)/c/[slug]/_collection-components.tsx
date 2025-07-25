import ComponentCard from "@/components/components-entity/component-card";
import type { Component } from "@/lib/domain";

interface CollectionComponentsProps {
	slug: string;
	components: Component[];
}

export default function CollectionComponents({
	components,
}: CollectionComponentsProps) {
	return (
		<div className="grid grid-cols-3 gap-4">
			{components.map((component) => (
				<ComponentCard key={component.id} component={component} />
			))}
		</div>
	);
}
