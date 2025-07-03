import type { PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren) {
	return (
		<div className="flex flex-col w-full">
			<div className="flex items-center h-12 fixed top-0 left-0 border-b border-border border-dashed z-50 w-full bg-background/80 backdrop-blur-xs"></div>
			{children}
		</div>
	);
}
