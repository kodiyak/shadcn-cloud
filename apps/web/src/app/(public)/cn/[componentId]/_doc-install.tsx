'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@workspace/ui/components/card';
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@workspace/ui/components/tabs';
import { PanelBottomCloseIcon, TerminalIcon } from 'lucide-react';
import { CodeBlock } from '@/components/code-block';
import type { Component } from '@/lib/domain';
import DocManualInstall from './_doc-manual-install';

interface DocInstallProps {
	component: Component;
}

export default function DocInstall({ component }: DocInstallProps) {
	return (
		<div className="flex flex-col container max-w-4xl mx-auto">
			<Tabs className="py-6" defaultValue="account">
				<TabsList>
					<TabsTrigger value="account">
						<TerminalIcon />
						<span>CLI</span>
					</TabsTrigger>
					<TabsTrigger value="password">
						<PanelBottomCloseIcon />
						<span>Manual</span>
					</TabsTrigger>
				</TabsList>
				<TabsContent value="account">
					<Card>
						<CardHeader>
							<CardTitle>Install via CLI</CardTitle>
							<CardDescription>
								Use the following command to install the component via CLI:
							</CardDescription>
						</CardHeader>
						<CardContent>
							<CodeBlock
								className="text-sm p-4 rounded-xl border border-t-border bg-background [&>pre]:bg-background!"
								code={
									'pnpm shadcn add "https://localhost:4000/api/r/component_id.json"'
								}
								lang={'bash'}
							/>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="password">
					<Card className="bg-transparent dark:bg-transparent border-transparent">
						<CardHeader>
							<CardTitle>Manual Installation</CardTitle>
							<CardDescription>
								Follow these steps to manually install the component:
							</CardDescription>
						</CardHeader>
						<CardContent>
							<DocManualInstall component={component} />
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
