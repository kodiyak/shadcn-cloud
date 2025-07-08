import { Button } from '@workspace/ui/components/button';
import { FileCodeIcon } from '@workspace/ui/components/icons';
import { flattenNodes, useProjectStore } from '../lib/store/use-project-store';

export default function SidebarIcon() {
	const nodes = flattenNodes(useProjectStore((state) => state.nodes)).filter(
		(n) => n.type === 'file',
	);

	return (
		<div className="size-full flex flex-col px-4 items-center gap-2">
			{nodes.map((node) => (
				<Button
					className="rounded-xl 2xl:w-full 2xl:h-auto 2xl:aspect-square"
					key={node.path}
					size={'icon'}
					variant={'outline'}
				>
					<FileCodeIcon
						className="2xl:size-7!"
						fallback={
							<span className="2xl:text-2xl font-bold font-mono">
								{node.path.split('/').pop()?.slice(0, 2)}
							</span>
						}
						type={node.path.split('.').pop()}
					/>
				</Button>
			))}
		</div>
	);
}
