import { db } from "@/lib/clients/db";
import { type Component, componentSchema } from "@/lib/domain";

interface ForkComponentProps {
	component: Component;
	authId: string;
}

export async function forkComponent({ component, authId }: ForkComponentProps) {
	const createdComponent = await db.component.create({
		data: {
			files: component.files,
			metadata: component.metadata,
			name: component.name,
			title: component.metadata.title,
			description: component.metadata.description,
			registryDependencies: component.registryDependencies,
			isForkable: component.isForkable,
			isTemplate: component.isTemplate,
			user: { connect: { id: authId } },
		},
	});

	return componentSchema.parse(createdComponent);
}
