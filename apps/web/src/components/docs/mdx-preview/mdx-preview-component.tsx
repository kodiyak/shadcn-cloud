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
import kebabCase from 'lodash.kebabcase';
import { RefreshCwIcon } from 'lucide-react';
import { type CSSProperties, useEffect, useRef, useState } from 'react';
import { CodeBlock } from '@/components/code-block';
import CopyButton from '@/components/copy-button';
import {
	type ModpackLog,
	useModpack,
} from '@/components/modpack/hooks/use-modpack';
import ModpackLogs from '@/components/modpack/modpack-logs';

interface MdxPreviewComponentProps {
	path: string;
	style?: CSSProperties;
	files: Record<string, string>;
}

export default function MdxPreviewComponent({
	path,
	style,
	files,
}: MdxPreviewComponentProps) {
	const elementRef = useRef<HTMLDivElement | null>(null);
	const content = files[path];
	const [logs, setLogs] = useState<ModpackLog[]>([]);
	const { isReady, module, mount, isCompiling, refresh } = useModpack(
		`editor-${kebabCase(path)}`,
		{
			elementRef,
			onLog: (log) => setLogs((prev) => [...prev, log]),
		},
	);
	const Component = module?.default;

	const onMount = async () => {
		if (isCompiling) return;
		try {
			await mount(path, files);
		} catch (error) {
			console.error('Failed to mount', error);
		}
	};

	const onLoad = async () => {
		if (isCompiling) return;
		try {
			await refresh(path, files);
		} catch (error) {
			console.error('Failed to compile:', error);
		}
	};

	useEffect(() => {
		if (isReady && Object.keys(files).length > 0 && !isCompiling) {
			const onLoadOrMount = Component ? onLoad : onMount;
			onLoadOrMount();
		}
	}, [content]);

	return (
		<Tabs
			className={cn('flex flex-col rounded-xl gap-0 border bg-muted/30')}
			defaultValue="preview"
		>
			<div className="flex px-4 py-2 items-center">
				<div className="flex flex-col flex-1">
					<span className="text-lg font-medium tracking-wider">
						{path.split('/').pop()}
					</span>
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
							disabled: !isReady || isCompiling,
							icon: isCompiling ? <Spinner size={16} /> : <RefreshCwIcon />,
							onClick: () => onMount(),
						},
					]}
				/>
			</div>

			<div className="bg-muted/30 border-t border-border rounded-xl flex flex-col">
				<TabsContent ref={elementRef} value="preview">
					<div className="p-4 aspect-video" style={style}>
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

					<div className="flex flex-col border-t border-dashed border-border">
						<ModpackLogs logs={logs} />
					</div>
				</TabsContent>
				<TabsContent className="relative" value="code">
					<CodeBlock
						className={cn(
							'[&_.line-number]:px-4!',
							'[&>pre]:p-4 [&>pre]:bg-transparent! text-sm',
						)}
						code={content ?? ''}
						lang={(path.split('.').pop() as any) || 'js'}
					/>
					<CopyButton
						className="absolute right-4 bottom-4 z-30"
						content={content ?? ''}
					/>
				</TabsContent>
			</div>
		</Tabs>
	);
}
