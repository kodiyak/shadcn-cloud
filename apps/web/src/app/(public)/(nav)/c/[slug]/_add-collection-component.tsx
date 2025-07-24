import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@workspace/ui/components/dialog";
import { FieldWrap, InputField } from "@workspace/ui/components/fields";
import { Form, FormField } from "@workspace/ui/components/form";
import type { UseDisclosure } from "@workspace/ui/hooks/use-disclosure";
import { useForm } from "react-hook-form";
import { backendClient } from "@/lib/clients/backend";
import {
	type AddCollectionComponentProps,
	addCollectionComponentSchema,
	type Collection,
} from "@/lib/domain";

interface AddCollectionComponentInputProps extends UseDisclosure {
	slug: string;
	collection: Collection;
}

export default function AddCollectionComponent({
	slug,
	collection,
	isOpen,
	onOpenChange,
	onClose,
}: AddCollectionComponentInputProps) {
	const form = useForm({
		resolver: zodResolver(addCollectionComponentSchema),
		defaultValues: {
			url: "",
		},
	});
	const { isSubmitting, isDirty, isValid } = form.formState;

	const onSubmit = useMutation({
		mutationFn: async (data: AddCollectionComponentProps) => {
			await backendClient.collections.addComponent(slug, data);
		},
		onSuccess: async () => {
			onClose();
		},
	});

	return (
		<Form {...form}>
			<Dialog onOpenChange={onOpenChange} open={isOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add Component</DialogTitle>
						<DialogDescription>
							Into {collection.name} Collection
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={form.handleSubmit((v) => onSubmit.mutateAsync(v))}>
						<FormField
							name={"url"}
							render={({ field }) => (
								<FieldWrap label={"Component URL"}>
									<InputField
										{...field}
										placeholder={`"kodiyak/button-01" or "https://shadcn.cloud/kodiyak/button-01"`}
									/>
								</FieldWrap>
							)}
						/>
						<DialogFooter>
							<Button
								disabled={!isDirty || !isValid || isSubmitting}
								type={"submit"}
								variant={"outline"}
							>
								Add Component
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</Form>
	);
}
