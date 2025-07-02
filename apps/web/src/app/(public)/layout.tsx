import type { Metadata } from "next";
import { Geist_Mono as Font_Mono, Geist as Font_Sans } from "next/font/google";
import "@workspace/ui/globals.css";
import { SidebarProvider } from "@workspace/ui/components/sidebar";
import { cn } from "@workspace/ui/lib/utils";
import type { CSSProperties } from "react";
import { QueryProvider } from "@/components/providers/query-provider";

const sans = Font_Sans({
	variable: "--font-sans",
	subsets: ["latin"],
});
const mono = Font_Mono({
	variable: "--font-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "shadcn.cloud",
	description: "Lo-fi Surf - Your Lofi Music Experience",
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
					"antialiased font-sans dark",
					sans.variable,
					mono.variable,
				)}
				style={
					{
						"--nav-top-height": "calc(var(--spacing)* 10)",
					} as CSSProperties
				}
			>
				<SidebarProvider>
					<QueryProvider>{children}</QueryProvider>
				</SidebarProvider>
			</body>
		</html>
	);
}
