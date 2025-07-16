'use client';

import { QuotesIcon } from '@phosphor-icons/react';
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '@workspace/ui/components/avatar';
import { Button } from '@workspace/ui/components/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@workspace/ui/components/card';
import { GithubIcon } from '@workspace/ui/components/icons';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';

export default function Login() {
	return (
		<div className="w-screen h-screen flex items-stretch">
			<div className="flex flex-col flex-1 max-w-3xl items-center justify-center">
				<Card className="w-full max-w-sm bg-transparent dark:bg-transparent border-0">
					<CardHeader>
						<CardTitle className="text-3xl">Welcome back</CardTitle>
						<CardDescription>Sign in to your account.</CardDescription>
					</CardHeader>
					<CardContent>
						<Button
							onClick={() => {
								authClient.signIn.social({ provider: 'github' });
							}}
							variant={'outline'}
						>
							<GithubIcon />
							<span>Continue with GitHub</span>
						</Button>
					</CardContent>
					<CardFooter className="pt-16">
						<span className="text-xs text-muted-foreground">
							By signing in, you agree to our{' '}
							<Link className="underline hover:text-foreground" href="/terms">
								terms of service
							</Link>{' '}
							and{' '}
							<Link className="underline hover:text-foreground" href="/privacy">
								privacy policy
							</Link>
							.
						</span>
					</CardFooter>
				</Card>
			</div>
			<div className="flex flex-col flex-1 border-l border-dashed border-border bg-muted/30 items-center justify-center">
				<div className="flex mt-auto flex-col w-full max-w-md relative">
					<div className="flex mb-4">
						<QuotesIcon
							className="size-16 text-muted-foreground opacity-30"
							weight="fill"
						/>
					</div>
					<div className="text-2xl font-mono font-light text-muted-foreground">
						<p className="[&>strong]:font-bold [&>strong]:text-primary">
							<strong>Distribution</strong> is a <strong>multiplier</strong> for{' '}
							<strong>generated code</strong>. The <strong>registry</strong> is{' '}
							<strong>infrastructure</strong>.
						</p>
					</div>
					<div className="flex justify-end mt-4">
						<div className="flex items-center gap-3 px-6 py-2 rounded-xl border bg-background/20">
							<Avatar className="size-10">
								<AvatarImage src={'https://github.com/shadcn.png'} />
								<AvatarFallback>cn</AvatarFallback>
							</Avatar>
							<span className="text-lg font-mono">@shadcn</span>
						</div>
					</div>
				</div>
				<div className="mt-auto py-2">
					<span className="text-xs font-mono font-medium text-muted-foreground">
						Ship Components Faster with{' '}
						<Link className="underline text-foreground" href={'/'}>
							shadcn.cloud
						</Link>
					</span>
				</div>
			</div>
		</div>
	);
}
