import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@workspace/ui/components/badge";
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
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useProjectStore } from "../lib/store/use-project-store";

interface CreateFileProps extends UseDisclosure {
	parentPath: string;
}

const formData = z.object({
	name: z.string().min(1, "File name is required"),
});

export default function CreateFile({
	parentPath,
	isOpen,
	onOpenChange,
}: CreateFileProps) {
	const form = useForm({
		resolver: zodResolver(formData),
		defaultValues: {
			name: "index.tsx",
		},
	});
	const addNode = useProjectStore((state) => state.addNode);

	const onSubmit = ({ name }: z.infer<typeof formData>) => {
		addNode(parentPath, {
			type: "file",
			name,
			content: "",
			isDirty: true,
			isReadOnly: false,
		});
	};

	useEffect(() => {
		if (isOpen) {
			form.reset();
		}
	}, [isOpen, form]);

	return (
		<Form {...form}>
			<Dialog open={isOpen} onOpenChange={onOpenChange}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create File</DialogTitle>
						<DialogDescription>
							Create a new file in the project.
						</DialogDescription>
					</DialogHeader>
					<form
						className="flex flex-col gap-4"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<div className="flex flex-col">
							<FormField
								name={"name"}
								render={({ field }) => (
									<FieldWrap label={"File Name"}>
										<InputField placeholder={"index.tsx"} {...field} />
									</FieldWrap>
								)}
							/>
						</div>
						<DialogFooter className="sm:justify-between w-full sm:items-end">
							<div className="flex flex-col gap-0.5">
								<span className="text-xs font-mono text-muted-foreground">
									Parent Path
								</span>
								<Badge variant={"muted"}>{parentPath}</Badge>
							</div>

							<Button variant={"outline"} type={"submit"}>
								<span>Create File</span>
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</Form>
	);
}
