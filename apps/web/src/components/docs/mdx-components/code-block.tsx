import { Badge } from '@workspace/ui/components/badge';
import { ButtonsIcons } from '@workspace/ui/components/button';
import { FileCodeIcon } from '@workspace/ui/components/icons';
import { cn } from '@workspace/ui/lib/utils';
import { CopyIcon } from 'lucide-react';
import { CodeBlock } from '@/components/code-block';

interface CodeBlockProps {
	className?: string;
	children: string;
}

function MDXCodeBlock({ children, className }: CodeBlockProps) {
	const lang = className?.match(/language-(\w+)/)?.[1] || 'text';

	const label = {
		ts: 'TypeScript',
		js: 'JavaScript',
		tsx: 'TypeScript JSX',
		jsx: 'JavaScript JSX',
		mdx: 'Markdown JSX',
		md: 'Markdown',
		text: 'Text Plain',
	}[lang];

	return (
		<div className="flex flex-col rounded-xl border bg-muted/30">
			<div className="flex items-center gap-2 p-2 justify-between">
				<div className="gap-2 flex items-center">
					<FileCodeIcon className="size-4 grayscale" type={lang} />
					<span className="text-xs font-mono text-muted-foreground">
						{label || lang}
					</span>
				</div>
				<ButtonsIcons
					items={[
						{
							label: 'Copy',
							icon: <CopyIcon />,
							onClick: () => {},
						},
					]}
					size={'icon-xs'}
				/>
			</div>
			<div className="p-2 pt-0">
				<CodeBlock
					className={cn(
						'[&>pre]:px-4 text-sm [&>pre]:py-3 [&>pre]:rounded-lg [&>pre]:bg-muted/30! [&>pre]:border-border/60 [&>pre]:border',
						className,
					)}
					code={children}
					lang={lang as any}
				/>
			</div>
		</div>
	);
}

export { MDXCodeBlock as code };
