"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { backendClient } from "@/lib/clients/backend";
import type { Collection } from "@/lib/domain";
import CollectionComponents from "./_collection-components";
import type { CollectionFilterFormData } from "./_collection-filter";
import CollectionFilter from "./_collection-filter";

interface CollectionPageClientProps {
	slug: string;
	collection: Collection;
}

export default function CollectionPageClient({
	slug,
	collection,
}: CollectionPageClientProps) {
	const [filter, setFilter] = useState<CollectionFilterFormData>({
		search: "",
		sort: "newest",
	});
	const { data } = useQuery({
		queryKey: ["collection", slug, "components"],
		queryFn: async () => {
			return backendClient.collections.filter(slug, {
				query: filter.search,
				sort: filter.sort,
			});
		},
	});

	return (
		<div className="container mx-auto min-h-screen flex flex-col py-8">
			<div className="flex items-center px-6 justify-between">
				<h2 className="text-xl font-mono font-semibold">{collection.name}</h2>
				<CollectionFilter
					onChange={setFilter}
					value={filter}
					slug={slug}
					collection={collection}
				/>
			</div>
			<CollectionComponents components={data?.data ?? []} slug={slug} />
		</div>
	);
}
