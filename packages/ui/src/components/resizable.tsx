'use client';

import { cn } from '@workspace/ui/lib/utils';
import type * as React from 'react';
import * as ResizablePrimitive from 'react-resizable-panels';

function ResizablePanelGroup({
	className,
	...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) {
	return (
		<ResizablePrimitive.PanelGroup
			className={cn(
				'flex h-full w-full data-[panel-group-direction=vertical]:flex-col',
				className,
			)}
			data-slot="resizable-panel-group"
			{...props}
		/>
	);
}

function ResizablePanel({
	...props
}: React.ComponentProps<typeof ResizablePrimitive.Panel>) {
	return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />;
}

function ResizableHandle({
	withHandle,
	className,
	...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
	withHandle?: boolean;
}) {
	return (
		<ResizablePrimitive.PanelResizeHandle
			className={cn(
				'transition-all',
				'data-[panel-group-direction=horizontal]:w-2.5 data-[panel-group-direction=horizontal]:px-1 data-[panel-group-direction=horizontal]:py-[12%]',
				'data-[panel-group-direction=horizontal]:data-[resize-handle-state=hover]:px-0.5',
				'data-[panel-group-direction=horizontal]:data-[resize-handle-state=drag]:px-0.5',
				'data-[panel-group-direction=horizontal]:data-[resize-handle-state=drag]:[&>div]:bg-primary',
				'data-[panel-group-direction=vertical]:h-2.5 data-[panel-group-direction=vertical]:py-1 data-[panel-group-direction=vertical]:px-[12%]',
				'data-[panel-group-direction=vertical]:data-[resize-handle-state=hover]:py-0.5',
				'data-[panel-group-direction=vertical]:data-[resize-handle-state=drag]:py-0.5',
				'data-[panel-group-direction=vertical]:data-[resize-handle-state=drag]:[&>div]:bg-primary',
				className,
			)}
			data-slot="resizable-handle"
			{...props}
		>
			<div className="size-full bg-muted rounded-full transition-colors"></div>
			{withHandle && (
				<div className="bg-primary h-full w-2 rounded-full">
					{/* <GripVerticalIcon className="size-2.5" /> */}
				</div>
			)}
		</ResizablePrimitive.PanelResizeHandle>
	);
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
