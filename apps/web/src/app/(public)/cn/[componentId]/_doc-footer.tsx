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
import { ButtonsIcons } from '@workspace/ui/components/button';
import { Card, CardContent } from '@workspace/ui/components/card';
import { SocialIcon } from '@workspace/ui/components/icons';

export default function DocFooter() {
	return (
		<>
			<div className="flex flex-col py-24 border-t border-dashed border-border gap-12 bg-muted/10">
				<div className="flex justify-center items-center gap-4">
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
									<ButtonsIcons
										items={[
											{
												icon: <SocialIcon className="size-4" type="github" />,
												label: 'GitHub',
											},
											{
												icon: <SocialIcon className="size-4" type="twitter" />,
												label: 'Twitter',
											},
											{
												icon: <SocialIcon className="size-4" type="devto" />,
												label: 'Dev.to',
											},
											{
												icon: <SocialIcon className="size-4" type="bluesky" />,
												label: 'Bluesky',
											},
										]}
									/>
								</div>
							</div>
						</CardContent>
					</Card>
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
