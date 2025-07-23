import type { CompileComponentResult } from '@/lib/services';

interface PublishRegistryDependenciesProps extends CompileComponentResult {}

export default function PublishRegistryDependencies({}: PublishRegistryDependenciesProps) {
	return (
		<div className="flex flex-col">
			<span className="text-xs font-mono text-muted-foreground font-medium">
				Registry Dependencies
			</span>
		</div>
	);
}
