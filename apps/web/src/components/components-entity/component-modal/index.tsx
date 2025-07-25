'use client';

import { CopyIcon, GitForkIcon, ShareIcon } from '@phosphor-icons/react';
import { useMutation } from '@tanstack/react-query';
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '@workspace/ui/components/avatar';
import { Button, ButtonsIcons } from '@workspace/ui/components/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
} from '@workspace/ui/components/dialog';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { Separator } from '@workspace/ui/components/separator';
import { Spinner } from '@workspace/ui/components/spinner';
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@workspace/ui/components/tabs';
import {
	type UseDisclosure,
	useDisclosure,
} from '@workspace/ui/hooks/use-disclosure';
import { CodeIcon, ExternalLinkIcon, SearchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AuthInvite from '@/components/auth/auth-invite';
import MdxContent from '@/components/crafter/preview/mdx-content';
import DocHeader from '@/components/docs/doc-header';
import ShareDialog from '@/components/sections/share-dialog';
import { backendClient } from '@/lib/clients/backend';
import type { Component } from '@/lib/domain';
import { useAuthStore } from '@/lib/store';
import ComponentPreviewsCarousel from '../component-previews-carousel';

interface ComponentModalProps extends UseDisclosure {
	component: Component;
}

export default function ComponentModal({
	isOpen,
	onOpenChange,
	component,
}: ComponentModalProps) {
	const openShare = useDisclosure();
	const openSignup = useDisclosure();
	const userId = useAuthStore((state) => state.user?.id);
	const isOwner = userId === component.userId;

	const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/cn/${component.id}`;
	const editorUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/editor/${component.id}`;

	const router = useRouter();
	const onFork = useMutation({
		mutationFn: backendClient.fork,
		onSuccess: (result) => {
			router.push(`/editor/${result.data.id}`);
		},
	});

	return (
		<>
			<AuthInvite {...openSignup} />
			<ShareDialog key={shareUrl} url={shareUrl} {...openShare} />
			<Dialog onOpenChange={onOpenChange} open={isOpen}>
				<DialogContent
					className="sm:max-w-6xl gap-0 max-h-[90vh] p-0"
					removeClose
				>
					<div className="flex items-center justify-between py-2 m-0 pl-4 pr-2">
						<div className="flex items-center gap-2">
							{component.user && (
								<Avatar>
									<AvatarFallback />
									<AvatarImage
										alt={component.user?.username}
										src={component.user?.image ?? undefined}
									/>
								</Avatar>
							)}
							<div className="flex flex-col gap-1">
								<span className="text-sm">{component.title}</span>
								<span className="text-xs text-muted-foreground">
									{component.description}
								</span>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<div className="flex items-center gap-0.5">
								<ButtonsIcons
									items={[
										{
											label: 'Edit Code',
											icon: <CodeIcon />,
											hidden: !isOwner || component.status === 'published',
											onClick: () => {
												window.open(editorUrl, '_blank');
											},
										},
										{
											label: 'Open in New Tab',
											icon: <ExternalLinkIcon />,
											onClick: () => window.open(shareUrl, '_blank'),
										},
										{
											label: 'Fork',
											icon: onFork.isPending ? (
												<Spinner size={16} />
											) : (
												<GitForkIcon />
											),
											hidden: !component.isForkable,
											disabled: onFork.isPending,
											onClick: () => {
												if (userId) {
													onFork.mutate({ componentId: component.id });
												} else {
													openSignup.onOpen();
												}
											},
										},
										{
											label: 'Share',
											icon: <ShareIcon />,
											onClick: openShare.onOpen,
										},
									]}
									size={'icon-sm'}
									variant={'ghost'}
								/>
							</div>
							<Separator orientation={'vertical'} />
							<Button size={'sm'}>
								<span>{'Open Component'}</span>
							</Button>
						</div>
					</div>
					<Tabs
						className="flex-1 bg-background rounded-b-xl rounded-t-md border-t gap-0 border-border flex flex-col"
						defaultValue="account"
					>
						<div className="flex items-center px-6">
							<TabsList className="flex-1">
								<TabsTrigger value="account">Previews</TabsTrigger>
								<TabsTrigger value="password">Docs</TabsTrigger>
							</TabsList>
							<Button size={'xs'} variant={'outline'}>
								<CopyIcon />
								<span>
									{`pnpm shadcn@latest add "https://shadcn.cloud/${component.user?.username}/${component.name}"`}
								</span>
							</Button>
						</div>
						<div className="flex-1 relative bg-background border-t border-border rounded-b-xl rounded-t-md w-full aspect-video">
							<TabsContent
								className="size-full absolute inset-0"
								value="account"
							>
								<ComponentPreviewsCarousel
									className={'size-full absolute inset-0 z-10'}
									component={component}
								/>
							</TabsContent>
							<TabsContent
								className="size-full absolute inset-0"
								value="password"
							>
								<ScrollArea className="size-full absolute inset-0">
									<div className="flex flex-col max-w-2xl mx-auto py-12">
										<DocHeader {...component.metadata} />
										<MdxContent
											content={component.files['/index.mdx']}
											files={component.files}
										/>
									</div>
								</ScrollArea>
							</TabsContent>
						</div>
					</Tabs>
				</DialogContent>
			</Dialog>
		</>
	);
}
