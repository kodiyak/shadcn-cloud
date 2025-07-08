import { ButtonsIcons } from '@workspace/ui/components/button';
import { FileCodeIcon } from '@workspace/ui/components/icons';
import { cn } from '@workspace/ui/lib/utils';
import { useEditorStore } from '../lib/store/use-editor-store';
import { flattenNodes, useProjectStore } from '../lib/store/use-project-store';

export default function SidebarIcon() {
	const nodes = flattenNodes(useProjectStore((state) => state.nodes)).filter(
		(n) => n.type === 'file',
	);
	const activePath = useEditorStore((state) => state.activePath);

	return (
		<div className="size-full flex flex-col px-4 items-center gap-2">
			<ButtonsIcons
				contentProps={{ side: 'right', align: 'center' }}
				items={nodes.map((node) => ({
					label: node.path,
					className: cn(
						'rounded-xl relative 2xl:w-full 2xl:h-auto 2xl:aspect-square',
						node.path === activePath ? 'bg-accent hover:bg-accent' : '',
						node.content !== node.draftContent && 'border-primary',
						node.content !== node.draftContent && node.path !== activePath
							? 'bg-muted/60 border-border'
							: '',
					),
					size: 'icon',
					variant: 'outline',
					icon: (
						<>
							<FileCodeIcon
								className="size-4"
								fallback={
									<span className="font-bold font-mono">
										{node.path.split('/').pop()?.slice(0, 2)}
									</span>
								}
								type={node.path.split('.').pop()}
							/>
							{node.content !== node.draftContent && (
								<div className="absolute bg-primary -right-0.5 -bottom-0.5 size-2.5 rounded-full">
									{node.path === activePath && (
										<div className="size-full rounded-full bg-primary absolute inset-0 animate-ping scale-125"></div>
									)}
								</div>
							)}
						</>
					),
					onClick: () => useEditorStore.getState().openFile(node.path),
				}))}
			/>
		</div>
	);
}
