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
			<Tabs className="py-6" defaultValue="cli">
				<TabsList>
					<TabsTrigger value="cli">
						<TerminalIcon />
						<span>CLI</span>
					</TabsTrigger>
					<TabsTrigger value="manual">
						<PanelBottomCloseIcon />
						<span>Manual</span>
					</TabsTrigger>
				</TabsList>
				<TabsContent value="cli">
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
				<TabsContent value="manual">
					<Card className="bg-transparent dark:bg-transparent border-transparent">
						<CardHeader>
							<CardTitle>Manual Installation</CardTitle>
							<CardDescription>
								Follow these steps to manually install the component:
							</CardDescription>
						</CardHeader>
						<CardContent className="px-0">
							<DocManualInstall component={component} />
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
