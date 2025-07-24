import type { Component } from '@/lib/domain';

interface CollectionComponentsProps {
	slug: string;
	components: Component[];
}

export default function CollectionComponents({
	slug,
	components,
}: CollectionComponentsProps) {
	return <div className="grid grid-cols-3 gap-4">{components.length}</div>;
}
