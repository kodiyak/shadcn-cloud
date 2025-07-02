import { cn } from '@/lib/utils';
import { InfoIcon } from 'lucide-react';
import React, { type ReactNode } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';

const Description = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title?: string;
    icon?: ReactNode;
    description?: ReactNode;
    tooltip?: string;
  }
>(({ className, title, description, tooltip, icon, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col gap-1', className)} {...props}>
    {(title || tooltip) && (
      <div className="flex items-center gap-2">
        {icon}
        {title && (
          <span className="text-sm leading-3 capitalize text-muted-foreground tracking-tight">
            {title}
          </span>
        )}
        {tooltip && (
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div className="size-4 rounded-full bg-muted p-0.5 ml-2">
                  <InfoIcon className="size-3 text-muted-foreground/40" />
                </div>
              </TooltipTrigger>
              <TooltipContent>{tooltip}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    )}
    <div className="text-sm">{description}</div>
  </div>
));
Description.displayName = 'Description';

export { Description };
