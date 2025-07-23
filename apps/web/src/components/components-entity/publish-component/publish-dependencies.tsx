import { Button } from '@workspace/ui/components/button';
import { ToolIcon } from '@workspace/ui/components/icons';
import { ExternalLinkIcon } from 'lucide-react';
import Link from 'next/link';
import type { CompileComponentResult } from '@/lib/services';

interface PublishDependenciesProps extends CompileComponentResult {}

export default function PublishDependencies({
	registry,
	dependencies,
}: PublishDependenciesProps) {
	return (
		<div className="flex flex-col gap-2">
			<span className="text-xs font-mono text-muted-foreground font-medium">
				Dependencies
			</span>
			<div className="grid grid-cols-3 gap-1">
				{(dependencies ?? []).map((dependency) => (
					<Button
						asChild
						className="group"
						key={dependency.name}
						size={'xs'}
						variant={'outline'}
					>
						<Link
							href={`https://www.npmjs.com/package/${dependency.name}`}
							target="_blank"
						>
							<span className="text-xs font-mono text-left flex-1 truncate">
								{dependency.name}@{dependency.version}
							</span>
							<div className="size-4 relative">
								<ToolIcon
									className="absolute inset-0 size-full transition-all duration-300 opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100"
									type={'npm'}
								/>
								<ExternalLinkIcon className="absolute inset-0 size-full transition-all duration-300 opacity-100 group-hover:opacity-0 group-hover:scale-50" />
							</div>
						</Link>
					</Button>
				))}
			</div>
		</div>
	);
}
