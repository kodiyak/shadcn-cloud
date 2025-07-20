import { ScrollArea } from '@workspace/ui/components/scroll-area';
import type { PropsWithChildren, ReactNode } from 'react';
import AppFooter from '../sections/app-footer';

interface PageLayoutProps {
	title: string;
	icon?: ReactNode;
}

export default function PageLayout({
	title,
	icon,
	children,
}: PropsWithChildren<PageLayoutProps>) {
	return (
		<div className="flex flex-col flex-1">
			<div className="w-full h-12 border-b border-border flex items-center px-6 gap-2 [&>svg]:size-6">
				{icon}
				<h2 className="text-lg font-semibold text-muted-foreground">{title}</h2>
			</div>
			<div className="flex-1 relative overflow-hidden">
				<div className="absolute size-full inset-0">
					<ScrollArea className="absolute inset-0 size-full">
						<div className="flex flex-col min-h-screen">{children}</div>
						<AppFooter />
					</ScrollArea>
				</div>
			</div>
		</div>
	);
}
