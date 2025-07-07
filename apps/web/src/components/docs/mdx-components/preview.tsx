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
import { useMemo, useState } from 'react';
import { CodeBlock } from '@/components/code-block';
import {
	findNodeInTree,
	getNodeFiles,
	useProjectStore,
} from '@/components/crafter/lib/store/use-project-store';
import ModpackLogs from '@/components/modpack/modpack-logs';
import { useModpackProvider } from '@/components/providers/modpack-provider';
import useCopy from '@/lib/hooks/use-copy';

interface PreviewProps {
	path: string;
}

function Preview({ path }: PreviewProps) {
	const node = useProjectStore((state) => findNodeInTree(state.nodes, path));
	const modpack = useModpackProvider();
	const module = useMemo(() => modpack.results[path], [path, modpack.results]);
	const error = useMemo(() => modpack.errors[path], [path, modpack.errors]);
	const compiling = useMemo(
		() => modpack.compiling[path],
		[path, modpack.compiling],
	);

	const [copied, onCopy] = useCopy(2.5);

	const status = modpack.compiling[path]
		? 'compiling'
		: modpack.errors[path]
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

	const Component = useMemo(() => {
		if (!module) return null;
		return module.default || module.Component || null;
	}, [module]);

	const load = async (entrypoint: string) => {
		const { nodes } = useProjectStore.getState();
		const files = getNodeFiles(nodes);
		console.log('Compiling modpack with files:', { files, nodes });
		await modpack.compile({
			entrypoint,
			files,
		});
	};

	return (
		<Tabs
			className={cn(
				'flex flex-col rounded-xl gap-0 border bg-muted/30',
				// modpack.isError && 'border-destructive',
				// modpack.isCompiling && 'animate-pulse',
			)}
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
							icon: modpack.compiling[path] ? (
								<Spinner size={16} />
							) : (
								<RefreshCwIcon className="size-4" />
							),
							onClick: async () => {
								if (node) {
									await load(node.path);
								}
							},
						},
					]}
				/>
			</div>

			<div className="bg-muted/30 border-t border-border rounded-xl flex flex-col">
				<TabsContent value="preview">
					<div className="p-4">
						{Component ? <Component /> : 'No component found.'}
					</div>

					<div className="flex flex-row justify-end p-4 border-t border-dashed border-border">
						<Badge variant={compilationStatus.variant}>
							{compilationStatus.icon}
							<span>{compilationStatus.label}</span>
						</Badge>
					</div>
					{error && (
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
										{error ? String(error) : 'N/A'}
									</p>
								</div>
							</motion.div>
						</AnimatePresence>
					)}
					<ModpackLogs logs={modpack.logs} />
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
