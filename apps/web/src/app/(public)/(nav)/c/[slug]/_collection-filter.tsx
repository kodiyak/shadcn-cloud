import { Button } from "@workspace/ui/components/button";
import { SelectField } from "@workspace/ui/components/fields";
import { Input } from "@workspace/ui/components/input";
import { useDisclosure } from "@workspace/ui/hooks/use-disclosure";
import { PlusIcon } from "lucide-react";
import type { Collection } from "@/lib/domain";
import { useAuthStore } from "@/lib/store";
import AddCollectionComponent from "./_add-collection-component";

export interface CollectionFilterFormData {
	search: string;
	sort: "newest" | "recommended" | "most_liked";
}

interface CollectionFilterProps {
	value: CollectionFilterFormData;
	onChange: (value: CollectionFilterFormData) => void;
	slug: string;
	collection: Collection;
}

export default function CollectionFilter({
	onChange,
	value,
	...rest,
}: CollectionFilterProps) {
  const {collection} = rest;
  const user = useAuthStore((state) => state.user)
  const addComponent = useDisclosure();

	return (
		<>
			<AddCollectionComponent {...rest} {...addComponent} />
			<div className="flex items-center gap-2">
				<Input
					className="w-[300]"
					placeholder={`Search in ${collection.name}`}
          value={value.search}
          onChange={(e) => onChange({ ...value, search: e.target.value })}
				/>
				<SelectField
					_content={{ align: "center" }}
					className="min-w-[200px]"
					options={[
						{ label: "Newest", value: "newest" },
						{ label: "Recommended", value: "recommended" },
						{ label: "Most Liked", value: "most_liked" },
					]}
					size={"sm"}
          value={value.sort}
          onChange={(v) => onChange({ ...value, sort: v as CollectionFilterFormData["sort"] })}
				/>
        {user && (
          <Button size={'sm'} onClick={addComponent.onOpen}>
            <PlusIcon />
            <span>Add Component</span>
          </Button>
        )}
			</div>
		</>
	);
}
