'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@workspace/ui/lib/utils';
import { XIcon } from 'lucide-react';
import type * as React from 'react';

function Dialog({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
	return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
	return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
	return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
	return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
	return (
		<DialogPrimitive.Overlay
			className={cn(
				'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
				'fixed inset-0 z-10 backdrop-blur-sm bg-zinc-500/20',
				className,
			)}
			data-slot="dialog-overlay"
			{...props}
		/>
	);
}

function DialogContent({
	className,
	children,
	removeClose = false,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
	removeClose?: boolean;
}) {
	return (
		<DialogPortal data-slot="dialog-portal">
			<div
				className={cn(
					'fixed z-50 inset-0 w-screen h-screen flex items-center justify-center',
				)}
			>
				<DialogOverlay />
				<DialogPrimitive.Content
					className={cn(
						'fixed z-50 border border-border',
						'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
						'relative bg-background/70 backdrop-blur-xl z-50 flex flex-col w-full max-w-[calc(100%-2rem)] gap-4 rounded-xl p-6 duration-200 sm:max-w-lg',
						'will-change-[transform,opacity]',
						className,
					)}
					data-slot="dialog-content"
					{...props}
				>
					{children}
					{!removeClose && (
						<DialogPrimitive.Close
							className={cn(
								'transition-all duration-300 ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:opacity-100',
								'focus:ring-2 focus:outline-hidden disabled:pointer-events-none',
								"[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-6",
								'absolute top-4 right-4 rounded-xl bg-background opacity-70 p-1 border',
							)}
						>
							<XIcon />
							<span className="sr-only">Close</span>
						</DialogPrimitive.Close>
					)}
				</DialogPrimitive.Content>
			</div>
		</DialogPortal>
	);
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			className={cn(
				'flex flex-col gap-2 text-center mb-6 sm:text-left',
				className,
			)}
			data-slot="dialog-header"
			{...props}
		/>
	);
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			className={cn(
				'flex flex-col-reverse gap-2 mt-6 sm:flex-row sm:justify-end',
				className,
			)}
			data-slot="dialog-footer"
			{...props}
		/>
	);
}

function DialogTitle({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
	return (
		<DialogPrimitive.Title
			className={cn('text-lg leading-none font-semibold', className)}
			data-slot="dialog-title"
			{...props}
		/>
	);
}

function DialogDescription({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
	return (
		<DialogPrimitive.Description
			className={cn('text-muted-foreground text-sm', className)}
			data-slot="dialog-description"
			{...props}
		/>
	);
}

export {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
};
