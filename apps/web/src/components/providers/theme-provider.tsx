'use client';

import '@workspace/ui/themes/defaults.css';
import '@workspace/ui/themes/base.css';
import '@workspace/ui/themes/lime.css';
import '@workspace/ui/themes/purple.css';

import { cn } from '@workspace/ui/lib/utils';
import { Geist_Mono as Font_Mono, Geist as Font_Sans } from 'next/font/google';
import type { PropsWithChildren } from 'react';
import { useThemeStore } from '@/lib/store/use-theme-store';

const sans = Font_Sans({
	variable: '--font-sans',
	subsets: ['latin'],
});
const mono = Font_Mono({
	variable: '--font-mono',
	subsets: ['latin'],
});

export default function ThemeProvider({ children }: PropsWithChildren) {
	const theme = useThemeStore((state) => state.theme);
	return (
		<body
			className={cn(
				'antialiased font-sans dark',
				sans.variable,
				mono.variable,
				theme,
			)}
		>
			{children}
		</body>
	);
}
