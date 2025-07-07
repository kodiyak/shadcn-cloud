'use client';

import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { cn } from '@workspace/ui/lib/utils';
import type * as React from 'react';

function Separator({
	className,
	orientation = 'horizontal',
	decorative = true,
	...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
	return (
		<SeparatorPrimitive.Root
			className={cn(
				'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:rounded-full data-[orientation=vertical]:h-6 data-[orientation=vertical]:w-1',
				className,
			)}
			data-slot="separator-root"
			decorative={decorative}
			orientation={orientation}
			{...props}
		/>
	);
}

export { Separator };
