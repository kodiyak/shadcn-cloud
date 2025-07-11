import { Slot } from '@radix-ui/react-slot';
import type React from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '../lib/utils';

function Panel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				'flex flex-row rounded-none! items-center gap-4 border border-b-0! bg-card dark:bg-card/30 p-4 text-panel-foreground',
				'first-of-type:rounded-t-lg! last-of-type:rounded-b-lg! last-of-type:border-b!',
				className,
			)}
			{...props}
		/>
	);
}

function PanelLink({
	className,
	asChild,
	...props
}: HTMLAttributes<HTMLAnchorElement> & { asChild?: boolean }) {
	const Link = asChild ? Slot : 'a';
	return <Link className={cn('flex flex-1 flex-col', className)} {...props} />;
}

function PanelTitle({
	className,
	...props
}: React.HTMLAttributes<HTMLSpanElement>) {
	return (
		<span
			className={cn('font-heading text-sm font-semibold', className)}
			{...props}
		/>
	);
}

function PanelDescription({
	className,
	...props
}: HTMLAttributes<HTMLParagraphElement>) {
	return (
		<p
			className={cn('text-xs font-medium text-muted-foreground', className)}
			{...props}
		/>
	);
}

export { Panel, PanelLink, PanelTitle, PanelDescription };
