import type { Metadata } from 'next';
import '@/lib/store';
import './index.css';
import { SidebarProvider } from '@workspace/ui/components/sidebar';
import AuthProvider from '@/components/providers/auth-provider';
import LikesProvider from '@/components/providers/likes-provider';
import ModpackProvider from '@/components/providers/modpack-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import ThemeProvider from '@/components/providers/theme-provider';

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
			<ThemeProvider>
				<SidebarProvider>
					<QueryProvider>
						<AuthProvider />
						<LikesProvider />
						<ModpackProvider />

						{children}
					</QueryProvider>
				</SidebarProvider>
			</ThemeProvider>
		</html>
	);
}
