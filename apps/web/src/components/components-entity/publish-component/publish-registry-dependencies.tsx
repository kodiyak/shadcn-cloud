import { Button } from '@workspace/ui/components/button';
import { ExternalLinkIcon } from 'lucide-react';
import Link from 'next/link';
import type { CompileComponentResult } from '@/lib/services';

interface PublishRegistryDependenciesProps extends CompileComponentResult {}

export default function PublishRegistryDependencies({
	registry,
}: PublishRegistryDependenciesProps) {
	return (
		<div className="flex flex-col gap-2">
			<span className="text-xs font-mono text-muted-foreground font-medium">
				Registry Dependencies
			</span>
			<div className="flex flex-col gap-0.5">
				{(registry.registryDependencies ?? []).map((registryDependency) => (
					<Button
						asChild
						className="group"
						key={registryDependency}
						size={'xs'}
						variant={'outline'}
					>
						<Link
							href={`https://ui.shadcn.com/docs/components/${registryDependency}`}
							target="_blank"
						>
							<span className="flex-1 font-mono text-xs text-left">
								{registryDependency}
							</span>
							<ExternalLinkIcon className="size-4" />
						</Link>
					</Button>
				))}
			</div>
		</div>
	);
}
