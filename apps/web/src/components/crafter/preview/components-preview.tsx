import { SelectField } from '@workspace/ui/components/fields';
import { FileCodeIcon } from '@workspace/ui/components/icons';
import { useMemo, useState } from 'react';
import { searchNodes, useProjectStore } from '../lib/store/use-project-store';

export default function ComponentsPreview() {
	const [path, setPath] = useState('/previews/hero.tsx');
	const nodes = useProjectStore((state) => state.nodes);
	const previewsNodes = useMemo(() => {
		return searchNodes((n) => {
			return n.path.startsWith('/previews') && n.type === 'file';
		}, nodes);
	}, [nodes]);

	const [Component, setComponent] = useState<React.ComponentType | null>(null);

	return (
		<div className="size-full flex flex-col">
			<div className="h-12 flex items-center px-4">
				<div className="flex-1"></div>
				<SelectField
					_content={{ align: 'end' }}
					onChange={(v) => setPath(() => v ?? '/')}
					options={previewsNodes.map((node) => ({
						value: node.path,
						label: node.path.split('/').pop() || 'Untitled',
						icon: (
							<FileCodeIcon
								className="size-4"
								type={node.path.split('.').pop()}
							/>
						),
					}))}
					size={'xs'}
					value={path}
				/>
			</div>
			<div className="flex-1 p-4 pt-0">
				<div className="size-full bg-background rounded-2xl border border-border">
					{Component ? (
						<Component />
					) : (
						<div className="flex items-center justify-center h-full">
							<span className="text-muted-foreground">
								Loading component...
							</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
