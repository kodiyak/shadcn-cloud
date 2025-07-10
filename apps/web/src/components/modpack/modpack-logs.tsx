import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';
import { FixedSizeList as List } from 'react-window';
import { useMemo } from 'react';
import { Trash2 } from 'lucide-react';
import type { ModpackLog } from './types';

interface ModpackLogsProps {
	logs: ModpackLog[];
	height?: number;
	onClearLogs?: () => void;
}

const LOG_ITEM_HEIGHT = 48;
const MAX_LOGS_TO_VIRTUALIZE = 100;

interface LogItemProps {
	index: number;
	style: React.CSSProperties;
	data: ModpackLog[];
}

function LogItem({ index, style, data }: LogItemProps) {
	const log = data[index];
	
	return (
		<div style={style}>
			<div
				className={cn(
					'flex items-start gap-2 p-2 text-xs border-b border-border/50',
					'data-[level=error]:bg-destructive/5 data-[level=error]:hover:bg-destructive/20',
					'data-[level=warn]:bg-orange-500/5 data-[level=warn]:hover:bg-orange-500/20',
					'data-[level=info]:bg-muted/20 data-[level=info]:hover:bg-muted/80',
					'data-[level=debug]:bg-muted/20 data-[level=debug]:hover:bg-muted/80',
				)}
				data-level={log.level}
			>
				<div className="flex flex-col gap-1 min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<span
							className={cn(
								'inline-block w-2 h-2 rounded-full',
								log.level === 'error' && 'bg-destructive',
								log.level === 'warn' && 'bg-orange-500',
								log.level === 'info' && 'bg-blue-500',
								log.level === 'debug' && 'bg-muted-foreground',
							)}
						/>
						<span className="font-mono text-[10px] text-muted-foreground">
							{new Date(log.timestamp).toLocaleTimeString()}
						</span>
						<span className="text-[10px] text-muted-foreground">
							{log.source}
						</span>
						<span className="text-[10px] text-muted-foreground">
							{log.category}
						</span>
					</div>
					<pre className="text-xs whitespace-pre-wrap break-words">
						{log.message}
					</pre>
				</div>
			</div>
		</div>
	);
}

export default function ModpackLogs({ logs, height, onClearLogs }: ModpackLogsProps) {
	const shouldVirtualize = logs.length > MAX_LOGS_TO_VIRTUALIZE;
	
	// Sort logs by timestamp (newest first)
	const sortedLogs = useMemo(() => {
		return [...logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
	}, [logs]);
	
	const containerStyle = height ? { height } : { height: '100%' };
	
	const headerContent = (
		<div className="top-0 sticky flex items-center justify-between px-4 w-full h-10 bg-muted/80 backdrop-blur-xs border-b">
			<span className="text-xs font-medium">
				{logs.length} log{logs.length !== 1 ? 's' : ''} recorded
			</span>
			{onClearLogs && logs.length > 0 && (
				<Button
					variant="ghost"
					size="sm"
					onClick={onClearLogs}
					className="h-6 px-2 text-xs"
				>
					<Trash2 className="h-3 w-3 mr-1" />
					Clear
				</Button>
			)}
		</div>
	);
	
	if (shouldVirtualize) {
		return (
			<div className="flex flex-col overflow-hidden relative" style={containerStyle}>
				{headerContent}
				<List
					height={height ? height - 40 : 280}
					itemCount={sortedLogs.length}
					itemSize={LOG_ITEM_HEIGHT}
					itemData={sortedLogs}
					width="100%"
				>
					{LogItem}
				</List>
			</div>
		);
	}
	
	return (
		<div className="flex flex-col overflow-hidden relative" style={containerStyle}>
			<ScrollArea className="absolute size-full inset-0">
				{headerContent}
				<div className="flex flex-col">
					{sortedLogs.map((log, index) => (
						<div
							key={`${log.timestamp}-${index}`}
							className={cn(
								'flex items-start gap-2 p-2 text-xs border-b border-border/50',
								'data-[level=error]:bg-destructive/5 data-[level=error]:hover:bg-destructive/20',
								'data-[level=warn]:bg-orange-500/5 data-[level=warn]:hover:bg-orange-500/20',
								'data-[level=info]:bg-muted/20 data-[level=info]:hover:bg-muted/80',
								'data-[level=debug]:bg-muted/20 data-[level=debug]:hover:bg-muted/80',
							)}
							data-level={log.level}
						>
							<div className="flex flex-col gap-1 min-w-0 flex-1">
								<div className="flex items-center gap-2">
									<span
										className={cn(
											'inline-block w-2 h-2 rounded-full',
											log.level === 'error' && 'bg-destructive',
											log.level === 'warn' && 'bg-orange-500',
											log.level === 'info' && 'bg-blue-500',
											log.level === 'debug' && 'bg-muted-foreground',
										)}
									/>
									<span className="font-mono text-[10px] text-muted-foreground">
										{new Date(log.timestamp).toLocaleTimeString()}
									</span>
									<span className="text-[10px] text-muted-foreground">
										{log.source}
									</span>
									<span className="text-[10px] text-muted-foreground">
										{log.category}
									</span>
								</div>
								<pre className="text-xs whitespace-pre-wrap break-words">
									{log.message}
								</pre>
							</div>
						</div>
					))}
				</div>
			</ScrollArea>
		</div>
	);
}
