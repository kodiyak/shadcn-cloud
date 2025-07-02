import React, { type ReactNode } from 'react';
import { cn } from '../lib/utils';

const EmptyState = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title?: string;
    description?: string;
    icon?: ReactNode;
  }
>(({ className, children, title, description, icon, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-col bg-background/50 gap-6 p-6 border rounded-2xl shadow-sm items-center',
      className,
    )}
    {...props}
  >
    {icon}
    <div className="flex flex-col items-center text-center gap-2">
      <span className="text-base font-medium">{title}</span>
      <span className="text-muted-foreground max-w-xs text-sm">
        {description}
      </span>
    </div>
    {children}
  </div>
));
EmptyState.displayName = 'EmptyState';

const EmptyIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { icon: ReactNode }
>(({ className, icon, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'size-14 rounded-xl flex items-center text-muted-foreground justify-center border bg-muted/35',
      '[&>svg]:size-8',
      className,
    )}
    {...props}
  >
    {icon}
  </div>
));
EmptyIcon.displayName = 'EmptyIcon';

export { EmptyState, EmptyIcon };
