'use client';

import { SignOutIcon } from '@phosphor-icons/react';
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
import { CodeIcon } from 'lucide-react';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { useAuthStore } from '@/lib/store';

export default function AuthActions() {
	const user = useAuthStore((state) => state.user);

	if (!user) {
		return (
			<Button asChild size={'sm'}>
				<Link href="/auth">Sign In</Link>
			</Button>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Avatar className="cursor-pointer transition-shadow data-[state=open]:ring-2 data-[state=open]:ring-primary">
					<AvatarImage src={user.image || ''} />
					<AvatarFallback></AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-[240]" sideOffset={12}>
				<DropdownMenuLabel>{user.email}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{[
					{ label: 'Profile', href: `/${user.username}` },
					{
						label: 'New Component',
						href: '/new-component',
						icon: <CodeIcon />,
					},
					{
						label: 'Settings',
						href: '/settings/profile',
					},
				].map((item) => (
					<DropdownMenuItem asChild key={item.label}>
						<Link className="flex items-center gap-2" href={item.href}>
							<span className="flex-1">{item.label}</span>
							{item.icon}
						</Link>
					</DropdownMenuItem>
				))}
				<DropdownMenuSeparator />
				{[{ label: 'Terms of Service', href: `/terms` }].map((item) => (
					<DropdownMenuItem asChild key={item.label}>
						<Link className="flex items-center gap-2" href={item.href}>
							<span>{item.label}</span>
						</Link>
					</DropdownMenuItem>
				))}
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => {
						authClient.signOut();
					}}
				>
					<span className="flex-1">Log Out</span>
					<SignOutIcon />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
