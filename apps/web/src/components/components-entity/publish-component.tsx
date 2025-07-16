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
import {
	CheckboxField,
	FieldWrap,
	InputField,
} from '@workspace/ui/components/fields';
import { Form, FormField } from '@workspace/ui/components/form';
import type { UseDisclosure } from '@workspace/ui/hooks/use-disclosure';
import { useForm } from 'react-hook-form';

interface PublishComponentProps extends UseDisclosure {}

export default function PublishComponent({
	isOpen,
	onOpenChange,
}: PublishComponentProps) {
	const form = useForm({
		defaultValues: {
			name: '',
			isTemplate: false,
			isForkable: true,
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
						<DialogTitle>🚢 Publish Your Component</DialogTitle>
						<DialogDescription>
							Publish your component to a Public URL.
						</DialogDescription>
					</DialogHeader>
					<form
						className="flex flex-col gap-6"
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
						<FormField
							name={'isTemplate'}
							render={({ field }) => (
								<FieldWrap
									className="flex-row-reverse gap-2"
									description={
										'Make this component available as a template in the marketplace.'
									}
									label={'Mark as Template'}
									orientation="horizontal"
								>
									<CheckboxField {...field} />
								</FieldWrap>
							)}
						/>
						<FormField
							name={'isForkable'}
							render={({ field }) => (
								<FieldWrap
									className="flex-row-reverse gap-2"
									description={
										'Allow others to fork this component and create their own versions.'
									}
									label={'Is Forkable'}
									orientation="horizontal"
								>
									<CheckboxField {...field} />
								</FieldWrap>
							)}
						/>
						<DialogFooter>
							<Button
								className="px-6"
								disabled={!isValid || !isDirty || isSubmitting}
								type="submit"
							>
								Publish
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</Form>
	);
}
