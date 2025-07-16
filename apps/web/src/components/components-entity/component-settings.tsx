import { useMutation } from '@tanstack/react-query';
import { Button } from '@workspace/ui/components/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@workspace/ui/components/dialog';
import { FieldWrap, InputField } from '@workspace/ui/components/fields';
import { Form, FormField } from '@workspace/ui/components/form';
import type { UseDisclosure } from '@workspace/ui/hooks/use-disclosure';
import { useForm } from 'react-hook-form';

interface ComponentSettingsProps extends UseDisclosure {}

export default function ComponentSettings({
	isOpen,
	onOpenChange,
}: ComponentSettingsProps) {
	const form = useForm({
		defaultValues: {
			name: '',
			isTemplate: false,
		},
	});
	const onSubmit = useMutation({
		mutationFn: async (data: any) => {
			console.log('Form submitted with data:', data);
		},
	});
	const { isSubmitting, isValid, isDirty } = form.formState;

	return (
		<Form {...form}>
			<Dialog onOpenChange={onOpenChange} open={isOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Settings</DialogTitle>
						<DialogDescription>
							Configure your component settings here.
						</DialogDescription>
					</DialogHeader>
					<form
						className="flex flex-col gap-4"
						onSubmit={form.handleSubmit((v) => onSubmit.mutateAsync(v))}
					>
						<FormField
							name={'name'}
							render={({ field }) => (
								<FieldWrap label={'Name'}>
									<InputField {...field} />
								</FieldWrap>
							)}
						/>
						<DialogFooter>
							<Button
								disabled={!isValid || !isDirty || isSubmitting}
								type="submit"
							>
								Save
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</Form>
	);
}
