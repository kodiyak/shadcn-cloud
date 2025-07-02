'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { cn } from '@workspace/ui/lib/utils';
import { ChevronDownIcon } from 'lucide-react';

function Accordion({
	...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
	return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
	className,
	...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
	return (
		<AccordionPrimitive.Item
			data-slot="accordion-item"
			className={cn('', className)}
			{...props}
		/>
	);
}

function AccordionTrigger({
	className,
	children,
	removeArrow = false,
	...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & {
	removeArrow?: boolean;
}) {
	return (
		<AccordionPrimitive.Header className="flex">
			<AccordionPrimitive.Trigger
				data-slot="accordion-trigger"
				className={cn(
					'text-muted-foreground relative',
					'focus-visible:border-ring focus-visible:ring-ring/50 px-2 h-8',
					'data-[state=open]:text-foreground data-[state=open]:bg-accent/40 data-[state=closed]:bg-transparent',
					'flex flex-1 items-center justify-between gap-4 rounded-lg text-left text-sm font-medium transition-all outline-none',
					'focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50',
					'[&[data-state=closed]>.arrow]:rotate-90 [&[data-state=open]>.arrow]:rotate-0 [&[data-state=closed]>.arrow]:opacity-25',
					className,
				)}
				{...props}
			>
				{children}
				{!removeArrow && (
					<ChevronDownIcon className="arrow text-muted-foreground pointer-events-none size-3.5 shrink-0 transition-transform duration-200" />
				)}
			</AccordionPrimitive.Trigger>
		</AccordionPrimitive.Header>
	);
}

function AccordionContent({
	className,
	children,
	...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
	return (
		<AccordionPrimitive.Content
			data-slot="accordion-content"
			className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
			{...props}
		>
			<div className={cn('', className)}>{children}</div>
		</AccordionPrimitive.Content>
	);
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
