'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@workspace/ui/lib/utils';
import type * as React from 'react';

function Tabs({
	className,
	...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
	return (
		<TabsPrimitive.Root
			className={cn('flex flex-col gap-2', className)}
			data-slot="tabs"
			{...props}
		/>
	);
}

function TabsList({
	className,
	...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
	return (
		<TabsPrimitive.List
			className={cn(
				'text-muted-foreground flex items-center justify-start p-[3px]',
				className,
			)}
			data-slot="tabs-list"
			{...props}
		/>
	);
}

function TabsTrigger({
	className,
	...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
	return (
		<TabsPrimitive.Trigger
			className={cn(
				'data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 ',
				'focus-visible:outline-ring dark:data-[state=active]:border-input/35 dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground ',
				'inline-flex items-center justify-center gap-2 rounded-md border border-transparent px-3 py-2 text-sm font-medium whitespace-nowrap',
				'transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50',
				"data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				className,
			)}
			data-slot="tabs-trigger"
			{...props}
		/>
	);
}

function TabsContent({
	className,
	...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
	return (
		<TabsPrimitive.Content
			className={cn('flex-1 flex flex-col outline-none', className)}
			data-slot="tabs-content"
			{...props}
		/>
	);
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
