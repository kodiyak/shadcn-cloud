import * as React from 'react';

import { cn } from '@workspace/ui/lib/utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'min-h-32 text-sm',
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground',
        'dark:bg-input/30 border-input/50 flex w-full min-w-0 rounded-2xl border bg-transparent px-3 py-2 shadow-xs transition-[color,box-shadow] outline-none',
        'focus-visible:border-input focus-visible:ring-ring/50 focus-visible:ring-2',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
