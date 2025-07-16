'use client';

import {
	BookmarksIcon,
	GlobeIcon,
	HeartIcon,
	SignInIcon,
} from '@phosphor-icons/react';
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '@workspace/ui/components/avatar';
import { Button } from '@workspace/ui/components/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@workspace/ui/components/tooltip';
import { LibraryIcon, LogOutIcon, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import type { PropsWithChildren } from 'react';
import { authClient } from '@/lib/auth-client';

export default function Page({ children }: PropsWithChildren) {
	const { data, isPending } = authClient.useSession();
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
	const footerLinks = [{ label: 'Login', href: '/auth', icon: <SignInIcon /> }];
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
				{!isPending && (
					<div className="flex flex-col items-center py-2">
						{data?.user ? (
							<DropdownMenu>
								<DropdownMenuTrigger>
									<Button size={'icon-lg'} variant={'ghost'}>
										<Avatar>
											<AvatarImage src={data.user.image || undefined} />
											<AvatarFallback />
										</Avatar>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align={'end'}
									className="w-[220]"
									side={'right'}
								>
									<DropdownMenuLabel>{data.user.name}</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={() => {
											authClient.signOut();
										}}
									>
										<span className="flex-1">Sign Out</span>
										<LogOutIcon />
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						) : (
							footerLinks.map((link) => (
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
							))
						)}
					</div>
				)}
			</div>
			<div className="flex flex-col w-full pl-16">{children}</div>
		</>
	);
}
