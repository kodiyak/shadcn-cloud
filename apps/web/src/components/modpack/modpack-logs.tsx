'use client';

import { InfoIcon, WarningOctagonIcon } from '@phosphor-icons/react';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';
import { AlertTriangleIcon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ModpackLog } from './types';

interface ModpackLogsProps {
	logs: ModpackLog[];
}

export default function ModpackLogs({ logs }: ModpackLogsProps) {
	const scrollRef = useRef<HTMLDivElement | null>(null);
	const [tab, setTab] = useState('all');
	const filteredLogs = useMemo(() => {
		const levels = {
			all: () => true,
			info: (log: ModpackLog) => log.level === 'info',
			warning: (log: ModpackLog) => log.level === 'warn',
			error: (log: ModpackLog) => log.level === 'error',
		};

		return logs.filter((log) => levels[tab as keyof typeof levels](log));
	}, [tab, logs]);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [logs]);

	return (
		<div className="flex flex-col">
			<div className="flex justify-between items-center py-2 px-6">
				<span className="font-mono text-sm font-medium">
					{tab === 'all'
						? `${logs.length} logs`
						: `${filteredLogs.length}/${logs.length} logs`}
				</span>
				<div className="flex items-center gap-1">
					{[
						{
							label: 'All',
							value: 'all',
						},
						{
							label: (
								<>
									<InfoIcon />
									<span>Info</span>
								</>
							),
							value: 'info',
						},
						{
							label: (
								<>
									<WarningOctagonIcon />
									<span>Warning</span>
								</>
							),
							value: 'warning',
						},
						{
							label: (
								<>
									<AlertTriangleIcon />
									<span>Error</span>
								</>
							),
							value: 'error',
						},
					].map((button) => (
						<Button
							data-state={tab === button.value ? 'open' : 'closed'}
							key={button.value}
							onClick={() => {
								setTab(button.value);
							}}
							size="xs"
							variant="ghost"
						>
							{button.label}
						</Button>
					))}
				</div>
			</div>
			<div
				className="flex flex-col max-h-52 overflow-y-auto overflow-x-auto"
				ref={scrollRef}
			>
				{filteredLogs.map((log, index) => (
					<div
						className={cn(
							'text-xs font-mono min-w-full flex text-muted-foreground w-max py-1 hover:bg-muted/50',
							'data-[level="info"]:[&>span]:bg-blue-500 data-[level="info"]:[&>span]:text-white',
							'data-[level="error"]:[&>span]:bg-destructive data-[level="error"]:[&>span]:text-destructive-foreground',
							'data-[level="warn"]:[&>span]:bg-orange-500 data-[level="warn"]:[&>span]:text-white',
						)}
						data-level={log.level}
						key={`${log.level}.${index}`}
					>
						<span className="text-muted-foreground/70 self-start px-1 py-0.5 rounded-sm ml-1 mr-2">
							{log.level}
						</span>
						<div className="flex-1">
							<pre>{log.message}</pre>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
