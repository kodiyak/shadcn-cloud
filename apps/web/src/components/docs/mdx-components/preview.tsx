import { CheckIcon, CopyIcon } from '@phosphor-icons/react';
import { Badge } from '@workspace/ui/components/badge';
import { ButtonsIcons } from '@workspace/ui/components/button';
import { ErrorBoundary } from '@workspace/ui/components/error-boundary';
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
import { type CSSProperties, useMemo } from 'react';
import { CodeBlock } from '@/components/code-block';
import { useCompilationStore } from '@/components/crafter/lib/store/use-compilation-store';
import {
	findNodeInTree,
	getNodeFiles,
	useProjectStore,
} from '@/components/crafter/lib/store/use-project-store';
import useCopy from '@/lib/hooks/use-copy';
import { standardTransition } from '@/lib/transitions';

interface PreviewProps {
	path: string;
	style?: CSSProperties;
}

function Preview({ path, style }: PreviewProps) {
	const nodes = useProjectStore((state) => state.nodes);
	const node = findNodeInTree(nodes, path);
	const compile = useCompilationStore((state) => state.compile);
	const module = useCompilationStore((state) => state.results)[path];
	const error = useCompilationStore((state) => state.errors)[path];
	const compiling = useCompilationStore((state) => state.compiling)[path];

	const [copied, onCopy] = useCopy(2.5);

	const status = compiling ? 'compiling' : error ? 'error' : 'ready';
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
	}, [module, path, compiling]);

	const load = async (entrypoint: string) => {
		const { nodes } = useProjectStore.getState();
		const files = getNodeFiles(nodes);
		await compile({
			entrypoint,
			files,
		});
	};

	return (
		<Tabs
			className={cn('flex flex-col rounded-xl gap-0 border bg-muted/30')}
			defaultValue="preview"
		>
			<div className="flex px-4 py-2 items-center">
				<div className="flex flex-col flex-1">
					<span className="text-lg font-medium tracking-wider">Button.tsx</span>
					<span className="text-xs text-muted-foreground">{path}</span>
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
							icon: compiling ? (
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
					<div className="p-4" style={style}>
						<ErrorBoundary
							fallback={(err) => (
								<div className="p-4 border bg-background border-destructive rounded-xl overflow-auto">
									<p className="text-destructive text-xs font-medium font-mono">
										{String(err.message)}
									</p>
									<div className="flex flex-col">
										{(err.stack as string)?.split('\n').map((line) => (
											<pre
												className="text-destructive text-xs font-mono"
												key={line}
											>
												{line}
											</pre>
										))}
									</div>
								</div>
							)}
						>
							{Component ? <Component /> : 'No component found.'}
						</ErrorBoundary>
					</div>

					<div className="flex flex-row justify-end p-4 border-t border-dashed border-border">
						<Badge variant={compilationStatus.variant}>
							{compilationStatus.icon}
							<span>{compilationStatus.label}</span>
						</Badge>
					</div>
					{error && (
						<AnimatePresence mode={'wait'}>
							<motion.div
								animate={{ opacity: 1, scale: 1, height: 'auto' }}
								exit={{ opacity: 0, scale: 0.95, height: 0 }}
								initial={{ opacity: 0, scale: 0.95, height: 0 }}
								layout
								transition={standardTransition}
							>
								<div className="p-4">
									<div className="p-8 border bg-background border-destructive rounded-xl">
										<p className="text-destructive text-xs font-medium font-mono">
											{error ? String(error) : 'N/A'}
										</p>
									</div>
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
