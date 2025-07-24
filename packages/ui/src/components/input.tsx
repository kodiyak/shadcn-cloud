import { cn } from '@workspace/ui/lib/utils';
import type * as React from 'react';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
	return (
		<input
			autoComplete="off"
			className={cn(
				'text-sm',
				'bg-muted border-input flex h-8 w-full min-w-0 rounded-sm border bg-background px-3 py-1 transition-[color,box-shadow] outline-none',
				'placeholder:text-muted-foreground',
				'selection:bg-primary selection:text-primary-foreground',
				'focus-visible:border-foreground/50 focus-visible:ring-ring focus-visible:ring-2',
				'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
				'md:text-sm',
				'file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
				className,
			)}
			data-slot="input"
			type={type}
			{...props}
		/>
	);
}

export { Input };
