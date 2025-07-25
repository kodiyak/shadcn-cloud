'use client';

import { CodeIcon, GitForkIcon, ShareIcon } from '@phosphor-icons/react';
import { useMutation } from '@tanstack/react-query';
import { ButtonsIcons } from '@workspace/ui/components/button';
import { Spinner } from '@workspace/ui/components/spinner';
import { useDisclosure } from '@workspace/ui/hooks/use-disclosure';
import { ExternalLinkIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { backendClient } from '@/lib/clients/backend';
import type { Component } from '@/lib/domain';
import { useAuthStore } from '@/lib/store';
import AuthInvite from '../auth/auth-invite';
import ShareDialog from '../sections/share-dialog';
import ComponentModal from './component-modal';

interface ComponentActionsProps {
	component: Component;
}

export default function ComponentActions({ component }: ComponentActionsProps) {
	const router = useRouter();
	const userId = useAuthStore((state) => state.user?.id);
	const isOwner = userId === component.userId;
	const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/cn/${component.id}`;
	const editorUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/editor/${component.id}`;
	const openShare = useDisclosure();
	const openSignup = useDisclosure();
	const openComponent = useDisclosure();
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
			<ComponentModal {...openComponent} component={component} />
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
						label: 'Fork',
						icon: onFork.isPending ? <Spinner size={16} /> : <GitForkIcon />,
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
						label: 'Open Component',
						icon: <ExternalLinkIcon />,
						onClick: openComponent.onOpen,
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
		</>
	);
}
