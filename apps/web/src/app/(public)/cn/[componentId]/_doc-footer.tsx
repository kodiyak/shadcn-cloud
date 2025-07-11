'use client';

import {
	BookmarkIcon,
	GitForkIcon,
	HeartIcon,
	ShareIcon,
} from '@phosphor-icons/react';
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '@workspace/ui/components/avatar';
import { Button, ButtonsIcons } from '@workspace/ui/components/button';
import { Card, CardContent } from '@workspace/ui/components/card';
import { SocialIcon } from '@workspace/ui/components/icons';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@workspace/ui/components/tooltip';
import { useDisclosure } from '@workspace/ui/hooks/use-disclosure';
import { cn } from '@workspace/ui/lib/utils';
import Link from 'next/link';
import { Fragment } from 'react';
import AuthInvite from '@/components/auth/auth-invite';
import type { Component } from '@/lib/domain';
import { useLikesStore } from '@/lib/store/use-likes-store';

interface DocFooterProps {
	component: Component;
}

export default function DocFooter({ component }: DocFooterProps) {
	const openSignup = useDisclosure();
	const isLiked = useLikesStore((state) =>
		state.likedItems.includes(component.id),
	);
	const toggleLike = useLikesStore((state) => state.toggleLike);
	const institutionLinks = [
		{ label: 'Terms', href: '/terms' },
		{ label: 'Privacy', href: '/privacy' },
		{
			label: 'Github',
			href: '/github',
		},
		{
			label: 'Blog',
			href: '/blog',
		},
	];

	const socialLinks = [
		{
			icon: <SocialIcon className="size-4" type="github" />,
			label: 'GitHub',
			href: 'https://github.com/kodiyak',
		},
		{
			icon: <SocialIcon className="size-4" type="twitter" />,
			label: 'Twitter',
			href: 'https://x.com/mathews536',
		},
		{
			icon: <SocialIcon className="size-4" type="devto" />,
			label: 'Dev.to',
			href: 'https://github.com/kodiyak',
		},
		{
			icon: <SocialIcon className="size-4" type="bluesky" />,
			label: 'Bluesky',
			href: 'https://github.com/kodiyak',
		},
	];

	return (
		<>
			<AuthInvite {...openSignup} />
			<div className="flex flex-col border-t border-dashed border-border gap-12 bg-muted/10">
				<div className="flex justify-center items-center gap-4 pt-24">
					<ButtonsIcons
						items={[
							{
								label: isLiked ? 'Liked!' : 'Like',
								icon: (
									<HeartIcon
										className={cn(
											isLiked ? 'fill-red-500 dark:fill-red-600' : '',
										)}
										weight={isLiked ? 'fill' : 'regular'}
									/>
								),
								className: cn(
									'rounded-3xl size-14',
									isLiked
										? 'bg-red-400/30 border-red-500/20 dark:bg-red-500/10'
										: '',
								),
								onClick: () => toggleLike(component.id),
							},
							{
								label: 'Save',
								icon: <BookmarkIcon />,
								className: 'rounded-3xl size-14',
								onClick: () => openSignup.onOpen(),
							},
							{
								label: 'Fork',
								icon: <GitForkIcon />,
								className: 'rounded-3xl size-14',
								onClick: () => openSignup.onOpen(),
							},
							{
								label: 'Share',
								icon: <ShareIcon />,
								className: 'rounded-3xl size-14',
							},
						]}
						size={'icon-lg'}
						variant={'outline'}
					/>
				</div>
				<div className="flex items-center justify-center">
					<Card className="w-full max-w-lg border-t-border">
						<CardContent className="font-mono">
							<div className="flex items-center gap-4">
								<Avatar className="size-14 ">
									<AvatarImage
										className=""
										src={'https://github.com/kodiyak.png'}
									/>
									<AvatarFallback className="">CN</AvatarFallback>
								</Avatar>
								<div className="flex-1 flex flex-col gap-1">
									<span className="text-xs text-muted-foreground">Author</span>
									<span className="text-sm font-medium">kodiyak</span>
								</div>
								<div className="flex items-center gap-1">
									{socialLinks.map((item) => (
										<Tooltip key={item.label}>
											<TooltipTrigger asChild>
												<Button asChild size={'icon'} variant={'ghost'}>
													<Link href={item.href} target={'_blank'}>
														{item.icon}
													</Link>
												</Button>
											</TooltipTrigger>
											<TooltipContent>
												<p>{item.label}</p>
											</TooltipContent>
										</Tooltip>
									))}
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
				<div className="container max-w-xl mx-auto pb-24 flex items-center justify-center gap-2">
					{institutionLinks.map((item, i) => (
						<Fragment key={item.href}>
							<Button asChild className="h-auto p-0" variant={'link'}>
								<Link href={item.href}>{item.label}</Link>
							</Button>
							{i < institutionLinks.length - 1 && <span>·</span>}
						</Fragment>
					))}
				</div>
			</div>
			<div className="border-t border-dashed flex justify-center items-center border-border h-16 bg-muted/20">
				<span className="text-center text-sm font-mono text-foreground font-medium">
					Build with{' '}
					<Link
						className="underline text-muted-foreground hover:text-foreground"
						href={'/'}
					>
						shadcn.cloud
					</Link>
				</span>
			</div>
		</>
	);
}
