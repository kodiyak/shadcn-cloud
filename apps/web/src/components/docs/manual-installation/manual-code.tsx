'use client';

import { EyeClosedIcon, EyeIcon } from '@phosphor-icons/react';
import { Button } from '@workspace/ui/components/button';
import { FileCodeIcon } from '@workspace/ui/components/icons';
import { useDisclosure } from '@workspace/ui/hooks/use-disclosure';
import { cn } from '@workspace/ui/lib/utils';
import { CodeBlock } from '@/components/code-block';
import CopyButton from '@/components/copy-button';

interface ManualCodeProps {
	path: string;
	content: string;
}

export default function ManualCode({ path, content }: ManualCodeProps) {
	const open = useDisclosure();

	return (
		<div className="flex flex-col rounded-2xl bg-muted/30 border" key={path}>
			<div className="flex items-center gap-2 h-10 px-6 border-b border-border border-dashed">
				<FileCodeIcon
					className="size-4 grayscale-100"
					type={path.split('.').pop() || 'tsx'}
				/>
				<span className="font-mono text-sm text-muted-foreground bg-muted rounded-sm px-1 py-0.5 mr-auto">
					{path}
				</span>
				<Button onClick={open.onToggle} size={'xs'} variant={'ghost'}>
					{open.isOpen ? <EyeIcon /> : <EyeClosedIcon />}
					{open.isOpen ? 'Hide Code' : 'Show Code'}
				</Button>
			</div>

			<div
				className={cn(
					'relative',
					open.isOpen ? '' : 'max-h-[200px] overflow-hidden',
				)}
			>
				<div className="absolute size-full z-50 pointer-events-none">
					<div className="flex justify-end sticky top-0 z-50">
						<div className="p-4">
							<CopyButton
								className={'pointer-events-auto'}
								content={content}
								size={'icon-sm'}
								variant={'ghost'}
							/>
						</div>
					</div>
				</div>
				{!open.isOpen && (
					<div className="absolute pointer-events-none size-full inset-0 z-20 bg-gradient-to-br from-muted/50 to-background rounded-b-2xl" />
				)}

				<CodeBlock
					className={cn('text-sm [&>pre]:bg-transparent!')}
					code={content || ''}
					lang={(path.split('.').pop() as any) || 'tsx'}
					lineCount
				/>
			</div>
		</div>
	);
}
