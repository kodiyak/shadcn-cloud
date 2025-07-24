import { SelectField } from "@workspace/ui/components/fields";
import { Input } from "@workspace/ui/components/input";
import { notFound } from "next/navigation";
import PageLayout from "@/components/layouts/page-layout";
import { findCollectionBySlug } from "@/lib/services";
import CollectionComponents from "./_collection-components";
import CollectionPageClient from "./page.client";

interface Props {
	params: Promise<{ slug: string }>;
}

export default async function Page({ params }: Props) {
	const { slug } = await params;
	const collection = await findCollectionBySlug(slug);

	if (!collection) notFound();

	return (
		<PageLayout title={""}>
			<CollectionPageClient slug={slug} collection={collection} />
		</PageLayout>
	);
}
