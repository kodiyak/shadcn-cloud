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
