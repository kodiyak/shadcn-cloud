import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { cn } from '@workspace/ui/lib/utils';
import type { ModpackLog } from './types';

interface ModpackLogsProps {
	logs: ModpackLog[];
}

export default function ModpackLogs({ logs }: ModpackLogsProps) {
	return (
		<div className="flex flex-col h-[40vh] overflow-hidden relative">
			<ScrollArea className="absolute size-full inset-0">
				<div className="top-0 sticky flex items-center gap-2 px-4 w-full h-10 bg-muted/80 backdrop-blur-xs border-b">
					<span className="text-xs">
						{logs.length} log{logs.length !== 1 ? 's' : ''} recorded
					</span>
				</div>
				<div className="flex flex-col text-xs">
					{logs.map((log, index) => (
						<div
							className={cn(
								'flex items-stretch gap-2',
								'data-[level=error]:bg-destructive/5 data-[level=error]:hover:bg-destructive/20 data-[level=error]:[&>pre[data-slot=level]]:text-destructive',
								'data-[level=warn]:bg-orange-500/5 data-[level=warn]:hover:bg-orange-500/20 data-[level=warn]:[&>pre[data-slot=level]]:text-orange-500',
								'data-[level=info]:bg-muted/20 data-[level=info]:hover:bg-muted/80 data-[level=info]:[&>pre[data-slot=level]]:text-blue-500',
								'data-[level=debug]:bg-muted/20 data-[level=debug]:hover:bg-muted/80 data-[level=debug]:[&>pre[data-slot=level]]:text-muted-foreground',
							)}
							data-level={log.level}
							key={index}
						>
							<pre className="w-16 pl-2" data-slot="level">
								{log.level.toUpperCase()}
							</pre>
							<div className="flex flex-col flex-1">
								{log.message.split('\n').map((line, lineIndex) => (
									<pre key={`${index}-${lineIndex}`}>{line}</pre>
								))}
							</div>
						</div>
					))}
				</div>
			</ScrollArea>
		</div>
	);
}
