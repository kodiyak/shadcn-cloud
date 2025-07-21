'use client';

import { GlobeIcon, HeartIcon, SignInIcon } from '@phosphor-icons/react';
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
import { cn } from '@workspace/ui/lib/utils';
import { HomeIcon, LibraryIcon, LogOutIcon } from 'lucide-react';
import Link from 'next/link';
import type { PropsWithChildren } from 'react';
import { authClient } from '@/lib/auth-client';
import { backendClient } from '@/lib/clients/backend';
import { useLikesStore } from '@/lib/store';
import { useAuthStore } from '@/lib/store/use-auth-store';
import { useThemeStore } from '@/lib/store/use-theme-store';

export default function Page({ children }: PropsWithChildren) {
	const likedCount = useLikesStore((state) => state.likedItems.length);
	const isPending = useAuthStore((state) => state.isPending);
	const user = useAuthStore((state) => state.user);
	const links = [
		{ label: 'Home', href: '/', icon: <HomeIcon /> },
		{ label: 'Explore', href: '/templates', icon: <GlobeIcon /> },
		{ label: 'My Library', href: '/my-library', icon: <LibraryIcon /> },
		{
			label: 'Liked Components',
			href: '/favorites',
			icon: <HeartIcon weight="fill" />,
			badge: likedCount > 0 ? likedCount : undefined,
		},
	];
	const footerLinks = [{ label: 'Login', href: '/auth', icon: <SignInIcon /> }];
	const { theme, setTheme } = useThemeStore();

	return (
		<>
			<div className="fixed left-0 top-0 flex flex-col h-screen w-16 border-r">
				<div className="flex flex-col items-center py-2">
					{links.map((link) => (
						<Tooltip delayDuration={0} key={link.href}>
							<TooltipTrigger asChild>
								<Button
									asChild
									className="relative"
									size={'icon-lg'}
									variant={'ghost'}
								>
									<Link href={link.href}>
										{link.icon}
										{link.badge && (
											<span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center w-4 h-4 text-xs font-medium bg-primary text-primary-foreground rounded-md">
												{link.badge}
											</span>
										)}
									</Link>
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
						{user ? (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button size={'icon-lg'} variant={'ghost'}>
										<Avatar>
											<AvatarImage src={user.image || undefined} />
											<AvatarFallback />
										</Avatar>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align={'end'}
									className="w-[220]"
									side={'right'}
								>
									<DropdownMenuLabel>{user.name}</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<div className="p-2 grid grid-cols-3 gap-2">
										{[
											{
												class: 'bg-muted border-foreground',
												value: 'base',
											},
											{
												class: 'bg-lime-500 border-lime-300',
												value: 'lime',
											},
											{
												class: 'bg-blue-500 border-blue-300',
												value: 'purple',
											},
										].map((themeOption) => (
											<Button
												className={cn(`h-auto p-2`)}
												key={themeOption.value}
												onClick={() => setTheme(themeOption.value)}
												variant={
													theme === themeOption.value ? 'accent' : 'ghost'
												}
											>
												<div
													className={cn(
														'size-full aspect-square rounded-full border-4',
														themeOption.class,
													)}
												></div>
											</Button>
										))}
									</div>
									<DropdownMenuItem
										onClick={async () => {
											useAuthStore.setState({ isPending: true });
											await authClient.signOut();
											backendClient.setToken(null);
											useAuthStore.setState({ isPending: false, user: null });
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
