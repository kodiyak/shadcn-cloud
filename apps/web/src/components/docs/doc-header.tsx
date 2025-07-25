import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { ToolIcon } from '@workspace/ui/components/icons';
import { ArrowRightIcon, CheckIcon } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from '@/lib/domain';

export default function DocHeader({
	title,
	description,
	features = [],
	references = [],
	tools = [],
}: Metadata) {
	return (
		<div className="flex flex-col w-full">
			<div className="flex flex-col border-b border-dashed pb-6 gap-16">
				<div className="flex flex-col flex-1 gap-6">
					<div className="flex flex-col gap-4">
						<h2 className="text-3xl font-bold font-mono">{title}</h2>
						<h3 className="text-muted-foreground text-lg">{description}</h3>
					</div>
					<div className="flex flex-col gap-4">
						{features.map((item) => (
							<div
								className="flex items-start gap-3 text-muted-foreground"
								key={`${item}`}
							>
								<div className="size-6 relative shrink-0 rounded-full border bg-background flex items-center justify-center">
									<CheckIcon className="size-4" />
								</div>
								<span>{item}</span>
							</div>
						))}
					</div>
				</div>
			</div>
			<div className="grid grid-cols-4">
				{references.map((item) => (
					<Button
						asChild
						className="rounded-none "
						key={item.href + item.title}
						size={'sm'}
						variant={'link'}
					>
						<Link href={item.href} target={'_blank'}>
							<span className="flex-1 text-left">{item.title}</span>
							<ArrowRightIcon className="size-3.5" />
						</Link>
					</Button>
				))}
			</div>
			<div className="py-4.5 flex flex-col gap-0.5">
				<span className="text-xs px-2 text-muted-foreground font-mono">
					Build with
				</span>
				<div className="flex overflow-hidden relative items-center gap-1">
					<div className="absolute pointer-events-none bg-gradient-to-r from-transparent to-background w-1/2 h-full right-0 top-0 z-20"></div>
					{tools.map((item) => (
						<Badge
							asChild
							className="text-[11px] font-medium cursor-pointer font-mono tracking-wider uppercase h-6 px-3 gap-2 border-dashed"
							key={`${item.title}.${item.icon}`}
							variant={'muted'}
						>
							<Link href={item.href ?? '#'} target={'_blank'}>
								<ToolIcon className="size-4" type={item.icon} />
								{item.title}
							</Link>
						</Badge>
					))}
				</div>
			</div>
		</div>
	);
}
