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
import Link from 'next/link';
import { Fragment } from 'react';

export default function DocFooter() {
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
			<div className="flex flex-col border-t border-dashed border-border gap-12 bg-muted/10">
				<div className="flex justify-center items-center gap-4 pt-24">
					<ButtonsIcons
						items={[
							{
								label: 'Like',
								icon: <HeartIcon />,
								className: 'rounded-3xl size-14',
							},
							{
								label: 'Save',
								icon: <BookmarkIcon />,
								className: 'rounded-3xl size-14',
							},
							{
								label: 'Fork',
								icon: <GitForkIcon />,
								className: 'rounded-3xl size-14',
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
				<span className="text-center text-xs text-muted-foreground font-medium">
					© 2023 shadcn-cloud. All rights reserved.
				</span>
			</div>
		</>
	);
}
