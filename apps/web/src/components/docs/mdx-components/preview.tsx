import { CheckIcon, CopyIcon } from '@phosphor-icons/react';
import { Badge } from '@workspace/ui/components/badge';
import { ButtonsIcons } from '@workspace/ui/components/button';
import { Separator } from '@workspace/ui/components/separator';
import { Spinner } from '@workspace/ui/components/spinner';
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@workspace/ui/components/tabs';
import { cn } from '@workspace/ui/lib/utils';
import { RefreshCwIcon } from 'lucide-react';
import { useState } from 'react';
import { CodeBlock } from '@/components/code-block';
import {
	findNodeInTree,
	flattenNodes,
	useProjectStore,
} from '@/components/crafter/lib/store/use-project-store';
import type { NodeProps } from '@/components/crafter/types';
import { useModpack } from '@/components/modbox/hooks/use-modpack';
import ModpackRender from '@/components/modbox/modpack-render';
import useCopy from '@/lib/hooks/use-copy';

interface PreviewProps {
	path: string;
}

function Preview({ path }: PreviewProps) {
	const node = useProjectStore((state) => findNodeInTree(state.nodes, path));
	const modpack = useModpack();
	const [copied, onCopy] = useCopy(2.5);

	const [{ isReady }, set] = useState({
		isReady: false,
	});

	const load = async (node: NodeProps) => {
		const files = flattenNodes(useProjectStore.getState().nodes).reduce(
			(acc, curr) => {
				if (curr.type === 'file') {
					acc[curr.path] = curr.content;
				}
				return acc;
			},
			{} as Record<string, string>,
		);
		console.log('Loading files for modpack:', { entrypoint: node.path, files });
		await modpack.compile({
			entrypoint: node.path,
			files,
		});
	};

	return (
		<Tabs
			className="flex flex-col rounded-xl gap-0 border bg-muted/30"
			defaultValue="preview"
		>
			<div className="flex px-4 py-2 items-center">
				<div className="flex flex-col flex-1">
					<span className="text-lg font-medium tracking-wider">Button.tsx</span>
					<span className="text-xs text-muted-foreground">
						Minimal Button Preview
					</span>
				</div>
				<TabsList>
					<TabsTrigger value="preview">Preview</TabsTrigger>
					<TabsTrigger value="code">Code</TabsTrigger>
				</TabsList>
				<Separator className="mx-6" orientation="vertical" />
				<ButtonsIcons
					items={[
						{
							label: 'Reload',
							icon: modpack.isCompiling ? (
								<Spinner size={16} />
							) : (
								<RefreshCwIcon className="size-4" />
							),
							onClick: () => {
								if (node) {
									set({ isReady: false });
									load(node);
								}
							},
						},
					]}
				/>
			</div>

			<div className="bg-muted/30 border-t border-border rounded-xl flex flex-col">
				<TabsContent value="preview">
					<div className="p-4">
						{!modpack.isCompiling && modpack.Component && (
							<ModpackRender {...modpack} />
						)}
					</div>

					<div className="flex flex-row justify-end p-4 border-t border-dashed border-border bg-background/20 rounded-b-xl">
						<Badge variant={modpack.isCompiling ? 'muted' : 'success'}>
							{modpack.isCompiling ? (
								<Spinner className="mr-1" size={12} />
							) : (
								<CheckIcon />
							)}
							<span>{modpack.isCompiling ? 'Compiling...' : 'Ready'}</span>
						</Badge>
					</div>
				</TabsContent>
				<TabsContent className="relative" value="code">
					<CodeBlock
						className={cn(
							'[&_.line-number]:px-4!',
							'[&>pre]:p-4 [&>pre]:bg-transparent! text-sm',
						)}
						code={node?.content || ''}
						lang={(node?.path.split('.').pop() as any) || 'js'}
					/>
					<div className="absolute right-4 bottom-4 z-30">
						<ButtonsIcons
							items={[
								{
									variant: copied ? 'success-outline' : 'outline',
									className: copied ? 'text-success' : '',
									label: copied ? 'Copied!' : 'Copy',
									icon: copied ? <CheckIcon /> : <CopyIcon />,
									onClick: async () => {
										if (node?.content) {
											await onCopy(node.content);
										}
									},
								},
							]}
						/>
					</div>
				</TabsContent>
			</div>
		</Tabs>
	);
}

export { Preview };
