import type { TemplateProps } from '@workspace/core';
import { Button } from '@workspace/ui/components/button';
import { EmptyIcon, EmptyState } from '@workspace/ui/components/empty';
import { FileCodeIcon } from '@workspace/ui/components/icons';
import {
	ScrollArea,
	ScrollAreaShadow,
	ScrollBar,
} from '@workspace/ui/components/scroll-area';
import { Spinner } from '@workspace/ui/components/spinner';
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@workspace/ui/components/tabs';
import { ImageOffIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useMemo } from 'react';
import { CodeBlock } from '@/components/code-block';
import { useCompilationStore } from '../lib/store/use-compilation-store';

const MotionSpinner = motion(Spinner);

interface TemplatePreviewProps {
	template: TemplateProps;
	onSelect?: (template: TemplateProps) => void;
}

export default function TemplatePreview({
	template,
	onSelect,
}: TemplatePreviewProps) {
	const isCompiling = useCompilationStore((state) => Object.values(state.compiling).some(Boolean));
	const files = useMemo(() => {
		return Object.entries(template.files).map(([path, content]) => {
			const parts = path.split(/(\/|\\)/g);
			return {
				path,
				content: content || '',
				fileName: parts.pop() || '',
				root: parts.length === 1,
			};
		});
	}, [template]);
	return (
		<Tabs
			className="flex flex-col aspect-video rounded-3xl bg-muted border overflow-hidden"
			defaultValue="preview"
		>
			<ScrollArea className="">
				<TabsList className="py-2 px-4 overflow-x-auto">
					<TabsTrigger value="preview">{template.title}</TabsTrigger>
					{files.map((file, f) => (
						<TabsTrigger key={`${file.fileName}.${f}`} value={file.fileName}>
							<FileCodeIcon
								className="size-4.5"
								type={file.fileName.split('.').pop()}
							/>
							{!file.root && <span className="text-muted-foreground">...</span>}
							<span>{file.fileName}</span>
						</TabsTrigger>
					))}
				</TabsList>
				<ScrollBar className="h-2" orientation="horizontal" />
			</ScrollArea>
			<div className="flex-1 p-4 pt-0 relative">
				<Button
					className="bottom-6 right-6 z-30 absolute"
					disabled={isCompiling}
					onClick={() => {
						onSelect?.(template);
					}}
					variant={'outline'}
				>
					{isCompiling && (
						<MotionSpinner
							animate={{
								opacity: 1,
							}}
							className="absolute left-1/2 top-0 translate-y-1/2 -translate-x-1/2"
							initial={{ opacity: 0 }}
							size={20}
							transition={{ duration: 0.7 }}
						/>
					)}
					<motion.span
						animate={{
							opacity: isCompiling ? 0 : 1,
							scale: isCompiling ? 0.8 : 1,
							transition: { duration: 0.2 },
						}}
					>
						Use Template
					</motion.span>
				</Button>
				<TabsContent className="size-full" value="preview">
					<EmptyState
						className="size-full items-center justify-center bg-gradient-to-br border border-border from-background/20 to-background"
						description="This template does not have a preview available."
						icon={<EmptyIcon icon={<ImageOffIcon />} />}
						title="No Preview Available"
					/>
				</TabsContent>
				{files.map((file, f) => (
					<TabsContent
						className="size-full overflow-hidden relative"
						key={`${file.fileName}.${f}`}
						value={file.fileName}
					>
						<div className="absolute size-full">
							<ScrollArea className="size-full">
								<ScrollAreaShadow className="to-muted" />
								<CodeBlock
									className="[&>pre]:bg-transparent! [&>pre]:p-0 [&>pre]:pt-4 h-full text-sm [&>pre]:h-full"
									code={file.content}
									lang={file.fileName.split('.').pop() as any}
								/>
								<ScrollBar className="w-2" orientation="vertical" />
							</ScrollArea>
						</div>
					</TabsContent>
				))}
			</div>
		</Tabs>
	);
}
