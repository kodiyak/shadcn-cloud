import { GlobeIcon, SignInIcon } from '@phosphor-icons/react/ssr';
import { Button } from '@workspace/ui/components/button';
import { ToolIcon } from '@workspace/ui/components/icons';
import {
	ScrollArea,
	ScrollAreaShadow,
} from '@workspace/ui/components/scroll-area';
import { Separator } from '@workspace/ui/components/separator';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@workspace/ui/components/tooltip';
import { HomeIcon } from 'lucide-react';
import { headers } from 'next/headers';
import Link from 'next/link';
import type { PropsWithChildren } from 'react';
import { auth } from '@/lib/clients/auth';
import { loadSidebarCollections } from '@/lib/services';

export default async function Page({ children }: PropsWithChildren) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	const user = session?.user || null;
	const links = [
		{ label: 'Home', href: '/', icon: <HomeIcon /> },
		{ label: 'Explore', href: '/templates', icon: <GlobeIcon /> },
	];

	const collections = await loadSidebarCollections();

	const groups = [
		{
			label: 'shadcn/ui registries',
			icon: <ToolIcon className="size-3" type={'shadcn'} />,
			links: [
				{ label: 'Pages', href: '/r/pages' },
				{ label: 'UI', href: '/r/ui' },
				{ label: 'Blocks', href: '/r/blocks' },
				{ label: 'Components', href: '/r/components' },
			],
		},
		{
			label: 'collections',
			icon: <ToolIcon className="size-3" type={'shadcn'} />,
			links: collections
				.sort((a, b) => a.name.localeCompare(b.name))
				.map((collection) => ({
					label: collection.name,
					href: `/c/${collection.slug}`,
				})),
		},
	];
	const footerLinks = [{ label: 'Login', href: '/auth', icon: <SignInIcon /> }];

	return (
		<>
			<div className="fixed left-0 top-0 flex flex-col h-screen w-[280]">
				<div className="px-8 h-12 flex items-center gap-1.5">
					<ToolIcon className="size-4" type={'shadcn'} />
					<span className="font-mono font-medium text-sm">shadcn.cloud</span>
				</div>
				<div className="flex flex-1 overflow-hidden relative">
					<ScrollAreaShadow className="to-background h-4" />
					<ScrollArea className="size-full inset-0 absolute">
						<div className="flex flex-col py-2 px-8">
							{links.map((link, l) => (
								<Button
									asChild
									className="relative"
									key={`${link.href}-${l}`}
									size={'sm'}
									variant={'ghost'}
								>
									<Link href={link.href}>
										{link.icon}
										<span className="flex-1 text-left">{link.label}</span>
									</Link>
								</Button>
							))}
							<div className="px-4">
								<Separator className={'my-4'} />
							</div>
							<div className="flex flex-col gap-4">
								{groups.map((group, g) => (
									<div className="flex flex-col gap-2" key={group.label}>
										<div className="flex items-center gap-2">
											{group.icon}
											<span className="text-xs font-medium">{group.label}</span>
										</div>
										<div className="flex flex-col">
											{group.links.map((link) => (
												<Button
													asChild
													className="relative"
													key={link.href}
													size={'sm'}
													variant={'ghost'}
												>
													<Link href={link.href}>
														<span className="flex-1 text-left">
															{link.label}
														</span>
													</Link>
												</Button>
											))}
										</div>
										{g < groups.length - 1 && (
											<div className="px-4">
												<Separator />
											</div>
										)}
									</div>
								))}
							</div>
						</div>
					</ScrollArea>
				</div>
				<div className="flex flex-col py-2 px-8">
					{footerLinks.map((link) => (
						<Button asChild key={link.href} size={'sm'} variant={'ghost'}>
							<Link href={link.href}>
								{link.icon}
								<span className="flex-1 text-left">{link.label}</span>
							</Link>
						</Button>
					))}
				</div>
			</div>
			<div className="flex flex-col w-full pl-[280]">
				<div className="h-12"></div>
				<div className="flex flex-1 flex-col bg-muted/20 border-t border-l rounded-tl-lg">
					{children}
				</div>
			</div>
		</>
	);
}
