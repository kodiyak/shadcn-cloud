import type { PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren) {
	return <div className="flex flex-col w-full">{children}</div>;
}
