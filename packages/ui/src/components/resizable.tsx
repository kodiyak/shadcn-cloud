'use client';

import * as React from 'react';
import * as ResizablePrimitive from 'react-resizable-panels';

import { cn } from '@workspace/ui/lib/utils';

function ResizablePanelGroup({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) {
  return (
    <ResizablePrimitive.PanelGroup
      data-slot="resizable-panel-group"
      className={cn(
        'flex h-full w-full data-[panel-group-direction=vertical]:flex-col',
        className,
      )}
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
      data-slot="resizable-handle"
      className={cn(
        'w-2.5 px-1 py-[12%]',
        'transition-all',
        'data-[resize-handle-state=hover]:px-0.5',
        'data-[resize-handle-state=drag]:px-0.5 data-[resize-handle-state=drag]:[&>div]:bg-primary',
        className,
      )}
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
