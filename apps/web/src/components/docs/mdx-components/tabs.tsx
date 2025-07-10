import {
	Tabs as MainTabs,
	TabsContent as Tab,
	TabsList,
	TabsTrigger,
} from '@workspace/ui/components/tabs';
import { cn } from '@workspace/ui/lib/utils';
import type { PropsWithChildren } from 'react';

function Tabs({
	items,
	children,
	className,
}: PropsWithChildren<{ items: string[]; className?: string }>) {
	return (
		<MainTabs
			className="rounded-xl gap-0 bg-muted/30 border"
			defaultValue={items[0]}
		>
			<TabsList className="py-0 px-6">
				{items.map((item) => (
					<TabsTrigger
						className={cn(
							'border-0 border-b border-transparent rounded-none',
							'data-[state=active]:border-primary data-[state=active]:dark:border-primary data-[state=active]:dark:bg-transparent',
						)}
						key={`item.${item}`}
						value={item}
					>
						{item}
					</TabsTrigger>
				))}
			</TabsList>
			<div
				className={cn(
					'rounded-xl bg-background p-4 border-t border-border',
					className,
				)}
			>
				{children}
			</div>
		</MainTabs>
	);
}

export { Tabs, Tab };
