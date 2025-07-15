'use client';

import { BookmarksIcon, GlobeIcon, HeartIcon } from '@phosphor-icons/react';
import { Button } from '@workspace/ui/components/button';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@workspace/ui/components/tooltip';
import { LibraryIcon, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import type { PropsWithChildren } from 'react';

export default function Page({ children }: PropsWithChildren) {
	const links = [
		{ label: 'Explore', href: '/', icon: <GlobeIcon /> },
		{ label: 'My Library', href: '/my-library', icon: <LibraryIcon /> },
		{
			label: 'Favorites',
			href: '/favorites',
			icon: <HeartIcon weight="fill" />,
		},
		{ label: 'Bookmarks', href: '/bookmarks', icon: <BookmarksIcon /> },
		{ label: 'Create', href: '/templates', icon: <PlusIcon /> },
	];
	const footerLinks = [{ label: 'Create', href: '/new', icon: <PlusIcon /> }];
	return (
		<>
			<div className="fixed left-0 top-0 flex flex-col h-screen w-16 border-r">
				<div className="flex flex-col items-center py-2">
					{links.map((link) => (
						<Tooltip delayDuration={0} key={link.href}>
							<TooltipTrigger asChild>
								<Button asChild size={'icon-lg'} variant={'ghost'}>
									<Link href={link.href}>{link.icon}</Link>
								</Button>
							</TooltipTrigger>
							<TooltipContent side={'right'}>
								<p>{link.label}</p>
							</TooltipContent>
						</Tooltip>
					))}
				</div>
				<div className="flex-1"></div>
				<div className="flex flex-col items-center py-2">
					{footerLinks.map((link) => (
						<Tooltip delayDuration={0} key={link.href}>
							<TooltipTrigger asChild>
								<Button asChild size={'icon-lg'} variant={'ghost'}>
									<Link href={link.href}>{link.icon}</Link>
								</Button>
							</TooltipTrigger>
							<TooltipContent side={'right'}>
								<p>{link.label}</p>
							</TooltipContent>
						</Tooltip>
					))}
				</div>
			</div>
			<div className="flex flex-col w-full pl-16">{children}</div>
		</>
	);
}
