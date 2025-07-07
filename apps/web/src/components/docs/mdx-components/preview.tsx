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
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { CodeBlock } from '@/components/code-block';
import {
	findNodeInTree,
	flattenNodes,
	getNodeFiles,
	useProjectStore,
} from '@/components/crafter/lib/store/use-project-store';
import type { NodeProps } from '@/components/crafter/types';
import { useModpack } from '@/components/modpack/hooks/use-modpack';
import ModpackRender from '@/components/modpack/modpack-render';
import useCopy from '@/lib/hooks/use-copy';

interface PreviewProps {
	path: string;
}

function Preview({ path }: PreviewProps) {
	const node = useProjectStore((state) => findNodeInTree(state.nodes, path));
	const modpack = useModpack();
	const [copied, onCopy] = useCopy(2.5);
	const nodes = useProjectStore((state) => state.nodes);
	const [files, setFiles] = useState(() => getNodeFiles(nodes));

	const [{ isReady }, set] = useState({
		isReady: false,
	});

	const status = modpack.isCompiling
		? 'compiling'
		: modpack.isError
			? 'error'
			: 'ready';
	const compilationStatus = {
		compiling: {
			label: 'Compiling...',
			icon: <Spinner className="mr-1" size={12} />,
			variant: 'muted' as const,
		},
		error: {
			label: 'Error',
			icon: <CheckIcon className="mr-1" size={12} />,
			variant: 'destructive' as const,
		},
		ready: {
			label: 'Ready',
			icon: <CheckIcon className="mr-1" size={12} />,
			variant: 'success' as const,
		},
	}[status];

	const load = async (node: NodeProps) => {
		set({ isReady: false });
		if (!modpack.Component) {
			await modpack.compile({
				entrypoint: node.path,
				files,
			});
		} else {
			modpack.update({ files, entrypoint: node.path });
		}
		set({ isReady: true });
	};

	useEffect(() => {
		setFiles(() => getNodeFiles(nodes));
	}, [nodes]);

	return (
		<Tabs
			className={cn(
				'flex flex-col rounded-xl gap-0 border bg-muted/30',
				modpack.isError && 'border-destructive',
				modpack.isCompiling && 'animate-pulse',
			)}
			defaultValue="preview"
		>
			<div className="flex px-4 py-2 items-center">
				<div className="flex flex-col flex-1">
					<span className="text-lg font-medium tracking-wider">Button.tsx</span>
					<span className="text-xs text-muted-foreground">
						Minimal Button Preview -{' '}
						{modpack.isCompleted ? 'Completed' : 'Compiling...'}
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
							onClick: async () => {
								if (node) {
									await load(node);
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

					<div className="flex flex-row justify-end p-4 border-t border-dashed border-border">
						<Badge variant={compilationStatus.variant}>
							{compilationStatus.icon}
							<span>{compilationStatus.label}</span>
						</Badge>
					</div>
					{modpack.error && modpack.isError && (
						<AnimatePresence>
							<motion.div
								animate={{ opacity: 1, scale: 1, height: 'auto' }}
								className="p-4"
								exit={{ opacity: 0, scale: 0.95, height: 0 }}
								initial={{ opacity: 0, scale: 0.95, height: 0 }}
								layout
							>
								<div className="p-4 border bg-background border-destructive rounded-xl">
									<p className="text-destructive text-xs font-medium font-mono">
										{modpack.error ? String(modpack.error) : 'N/A'}
									</p>
								</div>
							</motion.div>
						</AnimatePresence>
					)}
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
