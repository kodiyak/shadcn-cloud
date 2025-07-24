import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '@workspace/ui/components/avatar';
import { Button } from '@workspace/ui/components/button';
import { GithubIcon, TwitterIcon } from '@workspace/ui/components/icons';
import { GlobeIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { PropsWithChildren } from 'react';
import PageLayout from '@/components/layouts/page-layout';
import { getProfile } from '@/lib/services';
import ProfileNav from './_profile-nav';

interface Props {
	params: Promise<{ username: string }>;
}

export default async function Layout({
	params,
	children,
}: PropsWithChildren<Props>) {
	const { username } = await params;
	const profile = await getProfile(username);

	if (!profile) notFound();

	return (
		<PageLayout title={`@${username}`}>
			<div className="flex items-stretch">
				<div className="container mx-auto flex items-stretch border-x relative bg-background">
					<div className="w-1/5 flex flex-col">
						<div className="flex flex-col gap-4 py-4 px-6">
							<Avatar className="size-24">
								<AvatarImage src={profile.avatarUrl!} />
								<AvatarFallback className="font-bold">
									{profile.username[0]}
								</AvatarFallback>
							</Avatar>
							<div className="flex flex-col gap-1">
								<h2 className="text-3xl font-semibold">Kodiyak</h2>
								<h3 className="text-lg text-muted-foreground font-light">{`@${profile.username}`}</h3>
								{profile.bio && (
									<p className="text-sm text-muted-foreground mt-2">
										{profile.bio}
									</p>
								)}
							</div>
							<div className="flex items-center gap-1">
								{[
									{
										href: profile.twitterUrl || '',
										icon: <TwitterIcon />,
										hidden: !profile.twitterUrl,
									},
									{
										href: profile.githubUrl || '',
										icon: <GithubIcon />,
										hidden: !profile.githubUrl,
									},
									{
										href: profile.websiteUrl || '',
										icon: <GlobeIcon />,
										hidden: !profile.websiteUrl,
									},
								]
									.filter((l) => !l.hidden)
									.map((link, l) => (
										<Button
											asChild
											className="relative"
											key={`${link.href}-${l}`}
											size={'icon'}
											variant={'ghost'}
										>
											<Link href={link.href} target={'_blank'}>
												{link.icon}
											</Link>
										</Button>
									))}
							</div>
						</div>
					</div>
					<div className="flex-1 flex flex-col min-h-screen py-4 pr-6">
						<div className="flex items-center gap-0.5">
							<ProfileNav profile={profile} />
						</div>
						<div className="flex flex-col py-4">{children}</div>
					</div>
				</div>
			</div>
		</PageLayout>
	);
}
