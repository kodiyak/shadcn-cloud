'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { InfoIcon } from '@phosphor-icons/react';
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
import { CheckboxField, FieldWrap } from '@workspace/ui/components/fields';
import { Form, FormField } from '@workspace/ui/components/form';
import { Separator } from '@workspace/ui/components/separator';
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@workspace/ui/components/tabs';
import type { UseDisclosure } from '@workspace/ui/hooks/use-disclosure';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { backendClient } from '@/lib/clients/backend';
import { type PublishProps, publishSchema } from '@/lib/domain';
import { compileComponent } from '@/lib/services';
import {
	getNodeFiles,
	useProjectStore,
} from '../crafter/lib/store/use-project-store';
import PublishDependencies from './publish-component/publish-dependencies';
import PublishFiles from './publish-component/publish-files';
import PublishPreview from './publish-component/publish-preview';
import PublishRegistry from './publish-component/publish-registry';
import PublishRegistryDependencies from './publish-component/publish-registry-dependencies';

interface PublishComponentProps extends UseDisclosure {}

export default function PublishComponent({
	isOpen,
	onOpenChange,
	onClose,
}: PublishComponentProps) {
	const router = useRouter();
	const componentId = useProjectStore((state) => state.componentId);
	const form = useForm({
		resolver: zodResolver(publishSchema),
		defaultValues: {
			isTemplate: false,
			isForkable: true,
			componentId,
		},
	});
	const { isSubmitting, isValid } = form.formState;
	const onSubmit = useMutation({
		mutationFn: async (data: PublishProps) => {
			console.log('Form submitted with data:', data);
			return backendClient.component.publish(data);
		},
		onSuccess: async (response) => {
			if (response.data.status === 'published') {
				onClose();
				router.push(`/cn/${componentId}`);
			}
		},
	});
	const onCompile = useMutation({
		mutationFn: async () => {
			const { componentId, nodes } = useProjectStore.getState();
			const files = getNodeFiles(nodes);

			const result = await compileComponent({
				componentId,
				entrypoints: ['/index.tsx'],
				files,
			});

			return result;
		},
		onSuccess: (res) => {
			console.log('Component compiled successfully', res);
			form.reset(
				{
					...form.getValues(),
					registry: res.registry,
					dependencies: res.dependencies,
					componentId,
				},
				{ keepDirty: false },
			);
			return res;
		},
		onError: (error) => {
			console.error('Error compiling component:', error);
		},
	});

	return (
		<Form {...form}>
			<Dialog onOpenChange={onOpenChange} open={isOpen}>
				<DialogContent className="sm:max-w-2xl">
					<DialogHeader>
						<DialogTitle>🚢 Publish Your Component</DialogTitle>
						<DialogDescription>
							Publish your component to a Public URL.
						</DialogDescription>
					</DialogHeader>
					<form
						className="flex flex-col gap-6"
						onSubmit={form.handleSubmit(
							(v) => onSubmit.mutateAsync(v),
							console.error,
						)}
					>
						<div className="flex flex-col">
							<Tabs
								className="bg-muted/50 rounded-xl border gap-0"
								defaultValue="preview"
							>
								<TabsList className="p-1">
									<TabsTrigger value="info">
										<InfoIcon />
										<span>Info</span>
									</TabsTrigger>
									<TabsTrigger value="preview">Preview</TabsTrigger>
									<TabsTrigger disabled={!onCompile.data} value="registry">
										Registry
									</TabsTrigger>
								</TabsList>
								<div className="aspect-video overflow-y-auto">
									<TabsContent className="p-2 flex flex-col gap-4" value="info">
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
										{onCompile.data && (
											<>
												<Separator />
												<PublishFiles {...onCompile.data} />
												<Separator />
												<PublishDependencies {...onCompile.data} />
												<Separator />
												<PublishRegistryDependencies {...onCompile.data} />
											</>
										)}
									</TabsContent>
									<TabsContent value="files">
										{onCompile.data && <PublishFiles {...onCompile.data} />}
									</TabsContent>

									<TabsContent value="preview">
										{onCompile.data && <PublishPreview {...onCompile.data} />}
									</TabsContent>
									<TabsContent className="size-full" value="registry">
										{onCompile.data && <PublishRegistry {...onCompile.data} />}
									</TabsContent>
								</div>
							</Tabs>
						</div>
						<DialogFooter>
							<Button
								disabled={onCompile.isPending}
								onClick={() => {
									onCompile.mutate();
								}}
								variant={'outline'}
							>
								Build Registry
							</Button>
							<Button
								className="px-6"
								disabled={isSubmitting || !isValid}
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
