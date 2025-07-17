import type { Metadata } from 'next';
import { Geist_Mono as Font_Mono, Geist as Font_Sans } from 'next/font/google';
import '@/lib/store';
import '@workspace/ui/globals.css';
import { SidebarProvider } from '@workspace/ui/components/sidebar';
import { cn } from '@workspace/ui/lib/utils';
import type { CSSProperties } from 'react';
import AuthProvider from '@/components/providers/auth-provider';
import LikesProvider from '@/components/providers/likes-provider';
import { QueryProvider } from '@/components/providers/query-provider';

const sans = Font_Sans({
	variable: '--font-sans',
	subsets: ['latin'],
});
const mono = Font_Mono({
	variable: '--font-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'CN Cloud - Share your component with the world',
	description: '',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={cn(
					'antialiased font-sans dark',
					sans.variable,
					mono.variable,
				)}
				style={
					{
						'--nav-top-height': 'calc(var(--spacing)* 10)',
					} as CSSProperties
				}
			>
				<SidebarProvider>
					<QueryProvider>
						<AuthProvider />
						<LikesProvider />
						{children}
					</QueryProvider>
				</SidebarProvider>
			</body>
		</html>
	);
}
